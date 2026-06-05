import type { MusicWorkflowId } from "./music-workflows"

/** 本地存储版本号；schema 变更时递增以便迁移/重置。 */
export const STORE_VERSION = 1

export const LIBRARY_KEY = "seedmusic.library.v1"
export const VOICES_KEY = "seedmusic.voices.v1"
export const PERSONAS_KEY = "seedmusic.personas.v1"

export type TrackStatus = "pending" | "ready" | "failed"

export type DerivedAsset = {
  label: string
  url: string
}

/** 曲库中的一首曲目（创作结果或单曲操作产物）。 */
export type LibraryTrack = {
  id: string
  taskId?: string
  audioId?: string
  title: string
  audioUrl?: string
  imageUrl?: string
  model?: string
  workflow: MusicWorkflowId
  tags?: string
  prompt?: string
  duration?: number
  status: TrackStatus
  error?: string
  createdAt: number
  /** wav / midi / mp4 / stems / 封面 等衍生产物链接。 */
  derived?: DerivedAsset[]
}

export type VoiceStatus = "validating" | "phrase-ready" | "generating" | "ready" | "failed"

/** 自定义音色（多步创建流程的本地状态）。 */
export type Voice = {
  id: string
  name: string
  status: VoiceStatus
  /** voice/validate 返回的 taskId（用于取验证短语）。 */
  validateTaskId?: string
  /** 用户需朗读的验证短语。 */
  phrase?: string
  /** voice/generate 返回的 taskId。 */
  generateTaskId?: string
  voiceId?: string
  language?: string
  error?: string
  createdAt: number
}

/** 复用的音乐 Persona（由 generate-persona 产生）。 */
export type Persona = {
  id: string
  name: string
  description?: string
  personaId?: string
  personaModel?: string
  sourceTaskId?: string
  sourceAudioId?: string
  createdAt: number
}

function isBrowser(): boolean {
  return typeof window !== "undefined"
}

export function loadList<T>(key: string): T[] {
  if (!isBrowser()) return []
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as T[]) : []
  } catch {
    return []
  }
}

export function saveList<T>(key: string, value: T[]): void {
  if (!isBrowser()) return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // 配额超限或隐私模式：静默失败，不阻塞 UI。
  }
}

/** 浏览器端唯一 id（crypto.randomUUID 不可用时回退）。 */
export function createId(): string {
  if (isBrowser() && typeof window.crypto?.randomUUID === "function") {
    return window.crypto.randomUUID()
  }
  return `id-${Date.now()}-${Math.floor(Math.random() * 1e9).toString(36)}`
}

export function nowMs(): number {
  return Date.now()
}
