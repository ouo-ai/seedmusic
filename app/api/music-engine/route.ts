import { NextRequest, NextResponse } from "next/server"

import { buildKieSubmitRequest, extractTaskId, getKieDetailPath } from "@/lib/kie-suno"
import { isDownloadableMediaUrl } from "@/lib/media-links"
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
      imageUrl:
        typeof row.imageUrl === "string"
          ? row.imageUrl
          : typeof row.image_url === "string"
            ? row.image_url
            : typeof row.sourceImageUrl === "string"
              ? row.sourceImageUrl
              : typeof row.source_image_url === "string"
                ? row.source_image_url
                : undefined,
    }))
}

function extractState(value: unknown): "pending" | "ready" | "failed" {
  const data = asRecord(asRecord(value).data)
  const status =
    typeof data.status === "string" ? data.status : typeof data.successFlag === "string" ? data.successFlag : ""
  if (/FAIL|FAILED|ERROR|EXCEPTION|SENSITIVE/i.test(status)) return "failed"
  if (status === "SUCCESS") return "ready"
  return "pending"
}

// 提取文本类结果：boost-style 的 data.result；generate-lyrics 的 data.response.data[].text。
function extractTexts(value: unknown): string[] {
  const data = asRecord(asRecord(value).data)
  const texts: string[] = []
  if (typeof data.result === "string" && data.result.trim()) texts.push(data.result.trim())
  const response = asRecord(data.response)
  const rows = Array.isArray(response.data) ? response.data : Array.isArray(data.data) ? data.data : []
  for (const item of rows) {
    const row = asRecord(item)
    if (typeof row.text === "string" && row.text.trim()) texts.push(row.text.trim())
  }
  return texts
}

// generate-persona 同步返回 data.personaId。
function extractPersonaId(value: unknown): string | undefined {
  const data = asRecord(asRecord(value).data)
  if (typeof data.personaId === "string") return data.personaId
  if (typeof data.persona_id === "string") return data.persona_id
  return undefined
}

// voice/validate-info 返回 data.validateInfo（用户需朗读的验证短语）。
function extractPhrase(value: unknown): string | undefined {
  const data = asRecord(asRecord(value).data)
  if (typeof data.validateInfo === "string" && data.validateInfo.trim()) return data.validateInfo.trim()
  return undefined
}

// voice/record-info 等返回最终 voiceId。
function extractVoiceId(value: unknown): string | undefined {
  const data = asRecord(asRecord(value).data)
  if (typeof data.voiceId === "string") return data.voiceId
  if (typeof data.voice_id === "string") return data.voice_id
  return undefined
}

function extractEngineCode(value: unknown): number | undefined {
  const code = asRecord(value).code
  if (typeof code === "number" && Number.isFinite(code)) return code
  if (typeof code === "string" && /^\d+$/.test(code)) return Number(code)
  return undefined
}

function firstMessage(...values: unknown[]): string | undefined {
  for (const value of values) {
    if (typeof value !== "string") continue
    const message = value.trim()
    if (message && !/^success$/i.test(message)) return message
  }
  return undefined
}

function extractEngineError(value: unknown): string | undefined {
  const root = asRecord(value)
  const data = asRecord(root.data)
  const response = asRecord(data.response)
  return firstMessage(
    data.errorMessage,
    data.error,
    data.message,
    response.errorMessage,
    response.error,
    response.message,
    root.error,
    root.message,
    root.msg,
  )
}

function collectLinks(value: unknown, links: Array<{ label: string; url: string }> = [], sourceKey?: string) {
  if (!value || links.length >= 8) return links
  if (typeof value === "string") {
    const url = value.trim()
    if (isDownloadableMediaUrl(url, sourceKey) && !links.some((link) => link.url === url)) {
      links.push({ label: `Media ${links.length + 1}`, url })
    }
    return links
  }
  if (Array.isArray(value)) {
    value.forEach((item) => collectLinks(item, links, sourceKey))
    return links
  }
  if (typeof value === "object") {
    Object.entries(value).forEach(([key, item]) => collectLinks(item, links, key))
  }
  return links
}

function publicWorkflow(workflowId: string) {
  return MUSIC_WORKFLOWS.find((workflow) => workflow.id === workflowId) || null
}

function sanitizeEngineResponse(result: EngineResponse, workflowId?: string, options: { expectAsyncResult?: boolean } = {}) {
  const tracks = extractTracks(result.data)
  const trackUrls = new Set(tracks.map((track) => track.audioUrl).filter(Boolean))
  const links = collectLinks(result.data).filter((link) => !trackUrls.has(link.url)).slice(0, 6)
  const taskId = extractTaskId(result.data)
  const texts = extractTexts(result.data)
  const personaId = extractPersonaId(result.data)
  const phrase = extractPhrase(result.data)
  const voiceId = extractVoiceId(result.data)
  const hasResultPayload = Boolean(taskId || tracks.length || links.length || texts.length || personaId || phrase || voiceId)
  const engineCode = extractEngineCode(result.data)
  const engineFailed = engineCode !== undefined && engineCode !== 200 && !hasResultPayload
  const missingExpectedAsyncResult = Boolean(options.expectAsyncResult && !hasResultPayload)
  const ok = result.ok && !engineFailed && !missingExpectedAsyncResult
  const error =
    ok
      ? undefined
      : extractEngineError(result.data) ||
        (missingExpectedAsyncResult ? "No task ID returned by music engine." : "Music workflow request failed.")

  return {
    ok,
    status: result.status,
    state: ok ? extractState(result.data) : "failed",
    error,
    workflow: workflowId ? publicWorkflow(workflowId) : undefined,
    taskId,
    tracks,
    links,
    texts,
    personaId,
    phrase,
    voiceId,
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

    const sanitized = sanitizeEngineResponse(result, config.workflow.id, { expectAsyncResult: "detailPath" in config.workflow })
    return json(sanitized, sanitized.ok ? 200 : result.status)
  } catch (error) {
    return json({ ok: false, error: error instanceof Error ? error.message : "Invalid music workflow request." }, 400)
  }
}
