import { MUSIC_MODEL_VERSIONS, type MusicWorkflowId } from "./music-workflows"

/**
 * Studio UI metadata catalog: maps Kie workflows to user scenarios rather than
 * API groupings, so components stay data-driven instead of hardcoding workflows.
 */

export type CreateMode = "song" | "sounds" | "from-audio"

export type Genre = "Pop" | "Hip-Hop" | "Electronic" | "Rock" | "Jazz" | "Classical" | "Folk" | "R&B"
export type Mood = "Energetic" | "Chill" | "Melancholic" | "Uplifting" | "Dark" | "Romantic"

export const GENRES: Genre[] = ["Pop", "Hip-Hop", "Electronic", "Rock", "Jazz", "Classical", "Folk", "R&B"]
export const MOODS: Mood[] = ["Energetic", "Chill", "Melancholic", "Uplifting", "Dark", "Romantic"]

/** All model versions (available to Song and other general workflows). */
export const SONG_MODELS = MUSIC_MODEL_VERSIONS
/** Sounds only supports V5 / V5_5 (official constraint). */
export const SOUNDS_MODELS = ["V5_5", "V5"] as const

const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"] as const

/** 24 keys (12 major + 12 minor) + auto; used by the Sounds soundKey field. */
export const SOUND_KEYS: { value: string; label: string }[] = [
  { value: "", label: "Auto" },
  ...NOTES.map((note) => ({ value: note, label: `${note} major` })),
  ...NOTES.map((note) => ({ value: `${note}m`, label: `${note} minor` })),
]

export const EXAMPLE_PROMPTS = [
  "A driving synthwave track for a late-night city montage, pulsing bass, neon nostalgia",
  "Tender indie folk ballad with fingerpicked acoustic guitar and soft female vocals",
  "High-energy hip-hop beat with punchy 808s and triumphant brass stabs",
  "Cinematic orchestral swell that builds to an emotional peak, no lyrics",
]

/** "Create from audio" sub-actions (all require an R2 upload). */
export type FromAudioAction = {
  id: Extract<MusicWorkflowId, "upload-cover" | "upload-extend" | "add-instrumental" | "add-vocals" | "mashup">
  label: string
  description: string
  files: 1 | 2
  /** Whether it offers full musical params (Simple/Custom + style + vocals). */
  musical: boolean
}

export const FROM_AUDIO_ACTIONS: FromAudioAction[] = [
  { id: "upload-cover", label: "Cover", description: "Restyle your uploaded audio into a new vibe", files: 1, musical: true },
  { id: "upload-extend", label: "Extend", description: "Continue on from your uploaded audio", files: 1, musical: true },
  { id: "add-instrumental", label: "Add Instrumental", description: "Generate backing for a vocal-only track", files: 1, musical: false },
  { id: "add-vocals", label: "Add Vocals", description: "Add singing to an instrumental track", files: 1, musical: false },
  { id: "mashup", label: "Mashup", description: "Blend two tracks into one new song", files: 2, musical: true },
]

/** Single-track actions (operate on an existing track, auto-fill taskId/audioId). */
export type TrackActionId = Extract<
  MusicWorkflowId,
  | "extend"
  | "replace-section"
  | "separate-vocals"
  | "generate-midi"
  | "create-video"
  | "convert-wav"
  | "cover-generate"
  | "timestamped-lyrics"
  | "generate-persona"
>

export type TrackAction = {
  id: TrackActionId
  label: string
  description: string
  kind: "one-click" | "dialog"
  needsAudioId: boolean
}

export const TRACK_ACTIONS: TrackAction[] = [
  { id: "extend", label: "Extend", description: "Continue after a chosen point", kind: "dialog", needsAudioId: true },
  { id: "replace-section", label: "Replace Section", description: "Rewrite a time range", kind: "dialog", needsAudioId: true },
  { id: "separate-vocals", label: "Separate Stems", description: "Export vocal / instrumental stems", kind: "dialog", needsAudioId: true },
  { id: "convert-wav", label: "Export WAV", description: "Convert to high-quality WAV", kind: "one-click", needsAudioId: true },
  { id: "create-video", label: "Make Video", description: "Generate an MP4 visualizer", kind: "one-click", needsAudioId: true },
  { id: "generate-midi", label: "Generate MIDI", description: "Extract MIDI notes from audio", kind: "one-click", needsAudioId: false },
  { id: "cover-generate", label: "Cover Art", description: "Generate cover artwork", kind: "one-click", needsAudioId: false },
  { id: "timestamped-lyrics", label: "Lyric Timestamps", description: "Get word-level timestamps (karaoke)", kind: "one-click", needsAudioId: true },
  { id: "generate-persona", label: "Save as Persona", description: "Extract a reusable persona", kind: "dialog", needsAudioId: true },
]

/** Official prompt character limits by model/mode. */
export function getPromptLimit(workflowId: MusicWorkflowId, model: string): number {
  if (workflowId === "sounds") return 500
  if (workflowId === "generate-lyrics") return 200
  if (workflowId === "boost-style") return 3000
  if (workflowId === "generate" && (model === "V3_5" || model === "V4")) return 3000
  return 5000
}

export const VOICE_LANGUAGES: { value: string; label: string }[] = [
  { value: "en", label: "English" },
  { value: "zh", label: "Chinese" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "pt", label: "Portuguese" },
  { value: "de", label: "German" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "hi", label: "Hindi" },
  { value: "ru", label: "Russian" },
]

export const SINGER_SKILL_LEVELS = ["beginner", "intermediate", "advanced", "professional"] as const
