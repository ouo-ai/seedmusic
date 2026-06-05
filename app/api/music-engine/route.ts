import { NextRequest, NextResponse } from "next/server"

import { buildKieSubmitRequest, extractTaskId, getKieDetailPath } from "@/lib/kie-suno"
import { MUSIC_MODEL_VERSIONS, MUSIC_WORKFLOWS } from "@/lib/music-workflows"

export const runtime = "nodejs"

const MUSIC_ENGINE_BASE = "https://api.kie.ai/api/v1"

type EngineResponse = {
  ok: boolean
  status: number
  data: unknown
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

function siteUrlFromRequest(request: NextRequest) {
  return process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {}
}

async function readEngineResponse(response: Response) {
  const text = await response.text()
  try {
    return text ? JSON.parse(text) : null
  } catch {
    return { raw: text.slice(0, 1000) }
  }
}

async function callMusicEngine(path: string, init: RequestInit): Promise<EngineResponse> {
  const apiKey = process.env.KIE_AI_API_KEY
  if (!apiKey) {
    return { ok: false, status: 500, data: { error: "Music engine is not configured." } }
  }

  const response = await fetch(`${MUSIC_ENGINE_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    cache: "no-store",
  })

  return {
    ok: response.ok,
    status: response.status,
    data: await readEngineResponse(response),
  }
}

function findArray(value: unknown): Array<Record<string, unknown>> {
  const root = asRecord(value)
  const data = asRecord(root.data)
  const response = asRecord(data.response)
  const candidates = [response.sunoData, response.data, data.sunoData, data.items, data.audio_info]
  const match = candidates.find(Array.isArray)
  return Array.isArray(match) ? (match as Array<Record<string, unknown>>) : []
}

function extractTracks(value: unknown) {
  return findArray(value)
    .slice(0, 6)
    .map((row, index) => ({
      id: String(row.id || row.audio_id || row.audioId || index),
      title: String(row.title || row.name || `Seed Music result ${index + 1}`),
      meta: [row.modelName || row.model, row.duration || row.duration_seconds, row.tags || row.style].filter(Boolean).join(" · "),
      audioUrl:
        typeof row.audioUrl === "string"
          ? row.audioUrl
          : typeof row.audio_url === "string"
            ? row.audio_url
            : typeof row.streamAudioUrl === "string"
              ? row.streamAudioUrl
              : typeof row.stream_audio_url === "string"
                ? row.stream_audio_url
                : undefined,
    }))
}

function collectLinks(value: unknown, links: Array<{ label: string; url: string }> = []) {
  if (!value || links.length >= 8) return links
  if (typeof value === "string" && /^https?:\/\//i.test(value)) {
    links.push({ label: `Media ${links.length + 1}`, url: value })
    return links
  }
  if (Array.isArray(value)) {
    value.forEach((item) => collectLinks(item, links))
    return links
  }
  if (typeof value === "object") {
    Object.values(value).forEach((item) => collectLinks(item, links))
  }
  return links
}

function publicWorkflow(workflowId: string) {
  return MUSIC_WORKFLOWS.find((workflow) => workflow.id === workflowId) || null
}

function sanitizeEngineResponse(result: EngineResponse, workflowId?: string) {
  const tracks = extractTracks(result.data)
  const trackUrls = new Set(tracks.map((track) => track.audioUrl).filter(Boolean))
  const links = collectLinks(result.data).filter((link) => !trackUrls.has(link.url)).slice(0, 6)

  return {
    ok: result.ok,
    status: result.status,
    error: result.ok ? undefined : "Music workflow request failed.",
    workflow: workflowId ? publicWorkflow(workflowId) : undefined,
    taskId: extractTaskId(result.data),
    tracks,
    links,
  }
}

export async function GET(request: NextRequest) {
  const workflow = request.nextUrl.searchParams.get("workflow")
  const taskId = request.nextUrl.searchParams.get("taskId")

  if (!workflow || !taskId) {
    return json({
      ok: true,
      models: MUSIC_MODEL_VERSIONS,
      workflows: MUSIC_WORKFLOWS,
    })
  }

  const detailPath = getKieDetailPath(workflow)
  if (!detailPath) {
    return json({ ok: false, error: `Workflow ${workflow} does not expose a polling endpoint.` }, 400)
  }

  const result = await callMusicEngine(`${detailPath}?taskId=${encodeURIComponent(taskId)}`, { method: "GET" })
  return json(sanitizeEngineResponse(result, workflow), result.ok ? 200 : result.status)
}

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return json({ ok: false, error: "Request body must be valid JSON." }, 400)
  }

  try {
    const config = buildKieSubmitRequest(body as never, siteUrlFromRequest(request))
    const result = await callMusicEngine(config.workflow.path, {
      method: "POST",
      body: JSON.stringify(config.payload),
    })

    return json(sanitizeEngineResponse(result, config.workflow.id), result.ok ? 200 : result.status)
  } catch (error) {
    return json({ ok: false, error: error instanceof Error ? error.message : "Invalid music workflow request." }, 400)
  }
}
