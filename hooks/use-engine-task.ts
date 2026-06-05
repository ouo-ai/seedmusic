"use client"

import { useCallback, useEffect, useRef } from "react"

import { pollWorkflow, submitWorkflow, type EngineResult } from "@/lib/music-engine-client"
import type { MusicWorkflowId } from "@/lib/music-workflows"

import { useLibrary } from "./use-library"

const POLL_INTERVAL_MS = 5000
const MAX_POLLS = 72 // ~6 min

export type RunParams = {
  workflow: MusicWorkflowId
  payload: Record<string, unknown>
  pollable: boolean
  title: string
  model?: string
  tags?: string
  prompt?: string
}

/**
 * 运行「产出歌曲」类工作流：先插入 pending 曲目，提交后自动轮询，
 * 就绪回填 audioUrl/imageUrl/audioId 并持久化到曲库。返回曲目 id。
 */
export function useEngineRunner() {
  const { addTrack, updateTrack } = useLibrary()
  const pollers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  useEffect(() => {
    const map = pollers.current
    return () => {
      map.forEach((handle) => clearTimeout(handle))
      map.clear()
    }
  }, [])

  const applyResult = useCallback(
    (trackId: string, result: EngineResult): boolean => {
      const first = result.tracks.find((track) => track.audioUrl) ?? result.tracks[0]
      if (first?.audioUrl) {
        updateTrack(trackId, {
          status: "ready",
          title: first.title || undefined,
          audioUrl: first.audioUrl,
          imageUrl: first.imageUrl,
          audioId: first.id,
        })
        return true
      }
      return false
    },
    [updateTrack],
  )

  const startPolling = useCallback(
    (trackId: string, workflow: MusicWorkflowId, taskId: string) => {
      let attempts = 0
      const tick = async () => {
        attempts += 1
        try {
          const result = await pollWorkflow(workflow, taskId)
          if (applyResult(trackId, result)) return
          if (result.state === "failed") {
            updateTrack(trackId, { status: "failed", error: result.error || "Generation failed" })
            return
          }
        } catch {
          // 单次轮询失败：忽略并重试
        }
        if (attempts >= MAX_POLLS) {
          updateTrack(trackId, { status: "failed", error: "Generation timed out, try again later" })
          return
        }
        pollers.current.set(trackId, setTimeout(tick, POLL_INTERVAL_MS))
      }
      pollers.current.set(trackId, setTimeout(tick, POLL_INTERVAL_MS))
    },
    [applyResult, updateTrack],
  )

  const run = useCallback(
    async (params: RunParams): Promise<string> => {
      const track = addTrack({
        workflow: params.workflow,
        title: params.title,
        model: params.model,
        tags: params.tags,
        prompt: params.prompt,
        status: "pending",
      })
      try {
        const result = await submitWorkflow(params.payload)
        if (!result.ok) {
          updateTrack(track.id, { status: "failed", error: result.error || "Submission failed" })
          return track.id
        }
        if (applyResult(track.id, result)) return track.id
        if (result.taskId) {
          updateTrack(track.id, { taskId: result.taskId })
          if (params.pollable) startPolling(track.id, params.workflow, result.taskId)
        } else {
          updateTrack(track.id, { status: "failed", error: "No task ID returned" })
        }
      } catch (error) {
        updateTrack(track.id, { status: "failed", error: error instanceof Error ? error.message : "Request failed" })
      }
      return track.id
    },
    [addTrack, applyResult, startPolling, updateTrack],
  )

  return { run }
}
