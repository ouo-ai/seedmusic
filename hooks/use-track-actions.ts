"use client"

import { useCallback, useState } from "react"
import { toast } from "sonner"

import { isDownloadableMediaUrl } from "@/lib/media-links"
import { pollWorkflow, submitWorkflow, type EngineLink } from "@/lib/music-engine-client"
import type { MusicWorkflowId } from "@/lib/music-workflows"
import type { DerivedAsset, LibraryTrack } from "@/lib/studio-store"

import { useEngineRunner } from "./use-engine-task"
import { useLibrary } from "./use-library"
import { usePersonas } from "./use-voices"

const DERIVED_LABEL: Partial<Record<MusicWorkflowId, string>> = {
  "convert-wav": "WAV",
  "generate-midi": "MIDI",
  "create-video": "MV",
  "cover-generate": "Cover Art",
  "separate-vocals": "Stems",
}
const DERIVED_POLL_INTERVAL_MS = 5000
const DERIVED_MAX_POLLS = 48

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function downloadLinks(links: EngineLink[]): EngineLink[] {
  return links.filter((link) => isDownloadableMediaUrl(link.url))
}

function findMidiSourceTaskId(track: LibraryTrack): string | undefined {
  return track.derived?.find((asset) => asset.taskId && asset.label.startsWith("Stems"))?.taskId
}

export function useTrackActions() {
  const { updateTrack } = useLibrary()
  const { addPersona } = usePersonas()
  const { run } = useEngineRunner()
  const [busy, setBusy] = useState(false)

  const appendDerived = useCallback(
    (track: LibraryTrack, items: DerivedAsset[]) => {
      const existing = (track.derived ?? []).filter((asset) => isDownloadableMediaUrl(asset.url))
      const seen = new Set(existing.map((asset) => asset.url))
      const next = items.filter((asset) => {
        if (!isDownloadableMediaUrl(asset.url) || seen.has(asset.url)) return false
        seen.add(asset.url)
        return true
      })
      if (next.length) updateTrack(track.id, { derived: [...existing, ...next] })
    },
    [updateTrack],
  )

  /** 产出文件链接的操作（WAV / MIDI / MV / 封面 / Stems）：轮询拿链接并挂到曲目衍生区。 */
  const runDerived = useCallback(
    async (track: LibraryTrack, workflow: MusicWorkflowId, extra: Record<string, unknown> = {}) => {
      setBusy(true)
      const label = DERIVED_LABEL[workflow] ?? "Result"
      try {
        const sourceTaskId = workflow === "generate-midi" ? findMidiSourceTaskId(track) : track.taskId
        if (workflow === "generate-midi" && !sourceTaskId) {
          throw new Error("Separate stems before generating MIDI")
        }

        const result = await submitWorkflow({
          workflow,
          taskId: sourceTaskId,
          audioId: workflow === "generate-midi" ? undefined : track.audioId,
          ...extra,
        })
        if (!result.ok) throw new Error(result.error || "Submission failed")
        let links = downloadLinks(result.links)
        const taskId = result.taskId
        let attempts = 0
        while (!links.length && taskId && attempts < DERIVED_MAX_POLLS) {
          attempts += 1
          await delay(DERIVED_POLL_INTERVAL_MS)
          const polled = await pollWorkflow(workflow, taskId)
          const polledLinks = downloadLinks(polled.links)
          if (polledLinks.length) {
            links = polledLinks
            break
          }
          if (polled.state === "failed") throw new Error(polled.error || "Processing failed")
        }
        if (links.length) {
          appendDerived(
            track,
            links.map((link, index) => ({
              label: links.length > 1 ? `${label} ${index + 1}` : label,
              url: link.url,
              taskId: workflow === "separate-vocals" ? taskId ?? undefined : undefined,
            })),
          )
          toast.success(`${label} ready`)
        } else {
          toast.message("Submitted", { description: "Processing — check the Library shortly" })
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Action failed")
      } finally {
        setBusy(false)
      }
    },
    [appendDerived],
  )

  /** 即时型操作（如歌词时间轴）：提交后仅提示。 */
  const runSimple = useCallback(async (track: LibraryTrack, workflow: MusicWorkflowId, extra: Record<string, unknown> = {}) => {
    setBusy(true)
    try {
      const result = await submitWorkflow({ workflow, taskId: track.taskId, audioId: track.audioId, ...extra })
      if (!result.ok) throw new Error(result.error || "Submission failed")
      toast.success("Done")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Action failed")
    } finally {
      setBusy(false)
    }
  }, [])

  /** 产出新曲目的操作（续写 / 替换片段）：复用 runner 自动轮询并入库。 */
  const runNewTrack = useCallback(
    async (track: LibraryTrack, workflow: MusicWorkflowId, extra: Record<string, unknown>, title: string) => {
      setBusy(true)
      try {
        await run({
          workflow,
          payload: { workflow, taskId: track.taskId, audioId: track.audioId, ...extra },
          pollable: true,
          title,
          model: track.model,
        })
        toast.success("Submitted — generating…")
      } finally {
        setBusy(false)
      }
    },
    [run],
  )

  /** 存为 Persona：同步返回 personaId，写入声音库。 */
  const runPersona = useCallback(
    async (track: LibraryTrack, fields: { name: string; description: string; style?: string }) => {
      setBusy(true)
      try {
        const result = await submitWorkflow({
          workflow: "generate-persona",
          taskId: track.taskId,
          audioId: track.audioId,
          name: fields.name,
          description: fields.description,
          style: fields.style,
        })
        if (!result.ok) throw new Error(result.error || "Submission failed")
        addPersona({
          name: fields.name,
          description: fields.description,
          personaId: result.personaId,
          personaModel: "style_persona",
          sourceTaskId: track.taskId,
          sourceAudioId: track.audioId,
        })
        toast.success(result.personaId ? "Persona created" : "Persona submitted")
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Action failed")
      } finally {
        setBusy(false)
      }
    },
    [addPersona],
  )

  return { runDerived, runSimple, runNewTrack, runPersona, busy }
}
