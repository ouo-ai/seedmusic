/**
 * 浏览器端音乐引擎客户端：封装对 /api/music-engine 的提交与轮询。
 * 后端复用 lib/kie-suno.ts 的 payload 构建与校验，这里只做 fetch 与结果归一。
 */

export type EngineTrack = {
  id: string
  title: string
  meta: string
  audioUrl?: string
  imageUrl?: string
}

export type EngineLink = {
  label: string
  url: string
}

export type EngineState = "pending" | "ready" | "failed"

export type EngineResult = {
  ok: boolean
  status?: number
  state?: EngineState
  error?: string
  taskId?: string | null
  personaId?: string
  phrase?: string
  voiceId?: string
  tracks: EngineTrack[]
  links: EngineLink[]
  texts: string[]
}

type RawEngineResponse = Partial<EngineResult> & {
  tracks?: EngineTrack[]
  links?: EngineLink[]
  texts?: string[]
}

async function readResult(response: Response): Promise<EngineResult> {
  let data: RawEngineResponse = {}
  try {
    data = (await response.json()) as RawEngineResponse
  } catch {
    data = {}
  }
  return {
    ok: response.ok && data.ok !== false,
    status: response.status,
    state: data.state,
    error: data.error,
    taskId: data.taskId ?? null,
    personaId: data.personaId,
    phrase: data.phrase,
    voiceId: data.voiceId,
    tracks: Array.isArray(data.tracks) ? data.tracks : [],
    links: Array.isArray(data.links) ? data.links : [],
    texts: Array.isArray(data.texts) ? data.texts : [],
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const ASSIST_POLL_INTERVAL_MS = 3000
const ASSIST_MAX_POLLS = 20

/**
 * 运行「产出文本」类助手（boost-style 同步 / generate-lyrics 轮询），返回文本数组。
 */
export async function runAssist(
  payload: Record<string, unknown>,
  opts: { pollable: boolean; workflow: string },
): Promise<string[]> {
  const result = await submitWorkflow(payload)
  if (!result.ok) throw new Error(result.error || "Submission failed")
  if (result.texts.length) return result.texts
  if (!opts.pollable || !result.taskId) return result.texts

  let attempts = 0
  while (attempts < ASSIST_MAX_POLLS) {
    attempts += 1
    await delay(ASSIST_POLL_INTERVAL_MS)
    const polled = await pollWorkflow(opts.workflow, result.taskId)
    if (polled.texts.length) return polled.texts
    if (polled.state === "failed") throw new Error(polled.error || "Generation failed")
  }
  throw new Error("Generation timed out, try again")
}

/** 提交一个工作流；payload 形如 { workflow, model, prompt, ... }。 */
export async function submitWorkflow(payload: Record<string, unknown>): Promise<EngineResult> {
  const response = await fetch("/api/music-engine", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  return readResult(response)
}

/** 轮询某工作流任务的状态/结果。 */
export async function pollWorkflow(workflow: string, taskId: string): Promise<EngineResult> {
  const response = await fetch(
    `/api/music-engine?workflow=${encodeURIComponent(workflow)}&taskId=${encodeURIComponent(taskId)}`,
  )
  return readResult(response)
}
