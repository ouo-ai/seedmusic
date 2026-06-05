export const SUNO_MODEL_VERSIONS = ["V5", "V4_5ALL", "V4_5PLUS", "V4_5", "V4", "V3_5"] as const

export type SunoModelVersion = (typeof SUNO_MODEL_VERSIONS)[number]

export const SUNO_WORKFLOWS = [
  {
    id: "generate",
    label: "Generate",
    group: "Create",
    description: "Prompt-to-song with simple or custom mode.",
    path: "/generate",
    detailPath: "/generate/record-info",
  },
  {
    id: "sounds",
    label: "Sounds",
    group: "Create",
    description: "Loops, sound effects, ambience, tempo, and key control.",
    path: "/generate/sounds",
    detailPath: "/generate/record-info",
  },
  {
    id: "generate-lyrics",
    label: "Generate Lyrics",
    group: "Create",
    description: "Generate structured lyric variations from a prompt.",
    path: "/lyrics",
    detailPath: "/lyrics/record-info",
  },
  {
    id: "boost-style",
    label: "Boost Music Style",
    group: "Create",
    description: "Rewrite a short style idea into richer model-ready tags.",
    path: "/style/generate",
  },
  {
    id: "extend",
    label: "Extend",
    group: "Edit",
    description: "Continue an existing generated track from an audio ID.",
    path: "/generate/extend",
    detailPath: "/generate/record-info",
  },
  {
    id: "replace-section",
    label: "Replace Section",
    group: "Edit",
    description: "Replace a precise time range inside an existing track.",
    path: "/generate/replace-section",
    detailPath: "/generate/record-info",
  },
  {
    id: "upload-extend",
    label: "Upload And Extend Audio",
    group: "Upload",
    description: "Extend a public uploaded audio URL.",
    path: "/generate/upload-extend",
    detailPath: "/generate/record-info",
  },
  {
    id: "upload-cover",
    label: "Upload And Cover Audio",
    group: "Upload",
    description: "Transform an uploaded audio URL into a new style.",
    path: "/generate/upload-cover",
    detailPath: "/generate/record-info",
  },
  {
    id: "add-instrumental",
    label: "Add Instrumental",
    group: "Upload",
    description: "Add instrumental accompaniment to uploaded audio.",
    path: "/generate/add-instrumental",
    detailPath: "/generate/record-info",
  },
  {
    id: "add-vocals",
    label: "Add Vocals",
    group: "Upload",
    description: "Add vocal singing to uploaded audio.",
    path: "/generate/add-vocals",
    detailPath: "/generate/record-info",
  },
  {
    id: "mashup",
    label: "Mashup",
    group: "Upload",
    description: "Blend two uploaded audio URLs into one new track.",
    path: "/generate/mashup",
    detailPath: "/generate/record-info",
  },
  {
    id: "timestamped-lyrics",
    label: "TimeStamped Lyrics",
    group: "Post",
    description: "Retrieve word-level lyric timestamps for a generated audio.",
    path: "/generate/get-timestamped-lyrics",
  },
  {
    id: "cover-generate",
    label: "Cover Generate",
    group: "Post",
    description: "Generate cover artwork for an existing music task.",
    path: "/suno/cover/generate",
    detailPath: "/suno/cover/record-info",
  },
  {
    id: "separate-vocals",
    label: "Separate Vocals",
    group: "Post",
    description: "Split vocals/instrumental or detailed stems.",
    path: "/vocal-removal/generate",
    detailPath: "/vocal-removal/record-info",
  },
  {
    id: "generate-midi",
    label: "Generate Midi From Audio",
    group: "Post",
    description: "Convert separated tracks into MIDI note data.",
    path: "/midi/generate",
    detailPath: "/midi/record-info",
  },
  {
    id: "create-video",
    label: "Create Music Video",
    group: "Post",
    description: "Create an MP4 visualization for a generated track.",
    path: "/mp4/generate",
    detailPath: "/mp4/record-info",
  },
  {
    id: "convert-wav",
    label: "Convert To Wav Format",
    group: "Post",
    description: "Convert generated audio to WAV.",
    path: "/wav/generate",
    detailPath: "/wav/record-info",
  },
  {
    id: "generate-persona",
    label: "Generate Persona",
    group: "Voice",
    description: "Create a reusable music persona from a completed track.",
    path: "/generate/generate-persona",
  },
  {
    id: "voice-validate",
    label: "Voice Validate",
    group: "Voice",
    description: "Submit a source recording to obtain a verification phrase.",
    path: "/voice/validate",
    detailPath: "/voice/validate-info",
  },
  {
    id: "generate-voice",
    label: "Generate Voice",
    group: "Voice",
    description: "Create a custom voice after verification audio is ready.",
    path: "/voice/generate",
    detailPath: "/voice/record-info",
  },
  {
    id: "check-voice",
    label: "Check Voice",
    group: "Voice",
    description: "Check whether a generated custom voice is available.",
    path: "/voice/check-voice",
  },
] as const

export type SunoWorkflowId = (typeof SUNO_WORKFLOWS)[number]["id"]

export type KieSubmitInput = {
  workflow: SunoWorkflowId
  model?: string
  prompt?: string
  style?: string
  title?: string
  content?: string
  customMode?: boolean
  defaultParamFlag?: boolean
  instrumental?: boolean
  negativeTags?: string
  vocalGender?: "m" | "f" | ""
  styleWeight?: number
  weirdnessConstraint?: number
  audioWeight?: number
  personaId?: string
  personaModel?: string
  taskId?: string
  audioId?: string
  uploadUrl?: string
  uploadUrlList?: string[]
  continueAt?: number
  tags?: string
  fullLyrics?: string
  infillStartS?: number
  infillEndS?: number
  separationType?: "separate_vocal" | "split_stem"
  author?: string
  domainName?: string
  name?: string
  description?: string
  vocalStart?: number
  vocalEnd?: number
  voiceUrl?: string
  vocalStartS?: number
  vocalEndS?: number
  language?: string
  verifyUrl?: string
  voiceName?: string
  singerSkillLevel?: "beginner" | "intermediate" | "advanced" | "professional" | ""
  soundLoop?: boolean
  soundTempo?: number
  soundKey?: string
  grabLyrics?: boolean
  callBackUrl?: string
}

export type KieRequestConfig = {
  workflow: (typeof SUNO_WORKFLOWS)[number]
  payload: Record<string, unknown>
}

const MODEL_SET = new Set<string>(SUNO_MODEL_VERSIONS)
const WORKFLOW_MAP = new Map(SUNO_WORKFLOWS.map((workflow) => [workflow.id, workflow]))
const UNSUPPORTED_FIELD_HINTS: Record<string, string> = {
  duration: "KIE Suno does not support a fixed duration request parameter. Exact track length is controlled by the selected model.",
  durationSeconds: "KIE Suno does not support durationSeconds. Use model selection and prompts to influence structure; read the returned duration after generation.",
  targetDuration: "KIE Suno does not support targetDuration. Exact track length is controlled by the selected model.",
  audioDuration: "KIE Suno does not support audioDuration as an input parameter. The output duration is returned in the completed task.",
  songDuration: "KIE Suno does not support songDuration. Exact track length is controlled by the selected model.",
}

function hasText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0
}

function cleanString(value: unknown) {
  return hasText(value) ? value.trim() : undefined
}

function cleanNumber(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value)) return undefined
  return value
}

function cleanRangeNumber(value: unknown, field: string, min: number, max: number) {
  const number = cleanNumber(value)
  if (number === undefined) return undefined
  if (number < min || number > max) {
    throw new Error(`${field} must be between ${min} and ${max}.`)
  }
  return number
}

function cleanPayload(payload: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => {
      if (value === undefined || value === null) return false
      if (typeof value === "string" && value.trim() === "") return false
      if (Array.isArray(value) && value.length === 0) return false
      return true
    }),
  )
}

function requireFields(payload: Record<string, unknown>, fields: string[]) {
  const missing = fields.filter((field) => {
    const value = payload[field]
    return value === undefined || value === null || (typeof value === "string" && value.trim() === "")
  })
  if (missing.length > 0) {
    throw new Error(`Missing required field${missing.length > 1 ? "s" : ""}: ${missing.join(", ")}`)
  }
}

function rejectKnownUnsupportedFields(input: KieSubmitInput) {
  if (!input || typeof input !== "object" || Array.isArray(input)) return

  const record = input as Record<string, unknown>
  const unsupported = Object.keys(UNSUPPORTED_FIELD_HINTS).filter((field) => {
    const value = record[field]
    return value !== undefined && value !== null && !(typeof value === "string" && value.trim() === "")
  })

  if (unsupported.length === 0) return

  const details = unsupported.map((field) => `${field}: ${UNSUPPORTED_FIELD_HINTS[field]}`).join(" ")
  throw new Error(`Unsupported KIE Suno parameter${unsupported.length > 1 ? "s" : ""}. ${details}`)
}

function callbackUrl(input: KieSubmitInput, siteUrl: string) {
  if (cleanString(input.callBackUrl)) return cleanString(input.callBackUrl)
  return new URL("/api/music-engine/callback", siteUrl).toString()
}

function baseMusicPayload(input: KieSubmitInput, siteUrl: string) {
  const model = MODEL_SET.has(String(input.model)) ? input.model : "V5"
  return cleanPayload({
    prompt: cleanString(input.prompt),
    customMode: input.customMode ?? true,
    instrumental: input.instrumental ?? false,
    model,
    callBackUrl: callbackUrl(input, siteUrl),
    style: cleanString(input.style),
    title: cleanString(input.title),
    negativeTags: cleanString(input.negativeTags),
    vocalGender: cleanString(input.vocalGender),
    styleWeight: cleanRangeNumber(input.styleWeight, "styleWeight", 0, 1),
    weirdnessConstraint: cleanRangeNumber(input.weirdnessConstraint, "weirdnessConstraint", 0, 1),
    audioWeight: cleanRangeNumber(input.audioWeight, "audioWeight", 0, 1),
    personaId: cleanString(input.personaId),
    personaModel: cleanString(input.personaModel),
  })
}

export function getSunoWorkflow(id: string) {
  return WORKFLOW_MAP.get(id as SunoWorkflowId)
}

export function buildKieSubmitRequest(input: KieSubmitInput, siteUrl: string): KieRequestConfig {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("Request body must be an object.")
  }

  rejectKnownUnsupportedFields(input)

  const workflow = getSunoWorkflow(input.workflow)
  if (!workflow) {
    throw new Error(`Unsupported workflow: ${input.workflow}`)
  }

  let payload: Record<string, unknown>

  switch (workflow.id) {
    case "generate":
      payload = baseMusicPayload(input, siteUrl)
      requireFields(payload, ["prompt", "model"])
      break
    case "sounds":
      payload = cleanPayload({
        prompt: cleanString(input.prompt),
        model: MODEL_SET.has(String(input.model)) ? input.model : "V5",
        callBackUrl: callbackUrl(input, siteUrl),
        soundLoop: input.soundLoop ?? false,
        soundTempo: cleanRangeNumber(input.soundTempo, "soundTempo", 1, 300),
        soundKey: cleanString(input.soundKey),
        grabLyrics: input.grabLyrics ?? true,
      })
      requireFields(payload, ["prompt", "model"])
      break
    case "generate-lyrics":
      payload = cleanPayload({ prompt: cleanString(input.prompt), callBackUrl: callbackUrl(input, siteUrl) })
      requireFields(payload, ["prompt"])
      break
    case "boost-style":
      payload = cleanPayload({ content: cleanString(input.content) || cleanString(input.style) || cleanString(input.prompt) })
      requireFields(payload, ["content"])
      break
    case "extend":
      payload = cleanPayload({
        ...baseMusicPayload(input, siteUrl),
        audioId: cleanString(input.audioId),
        defaultParamFlag: input.defaultParamFlag ?? true,
        continueAt: cleanNumber(input.continueAt),
      })
      requireFields(payload, input.defaultParamFlag === false ? ["audioId"] : ["audioId", "prompt", "style", "title"])
      break
    case "upload-extend":
      payload = cleanPayload({
        ...baseMusicPayload(input, siteUrl),
        uploadUrl: cleanString(input.uploadUrl),
        defaultParamFlag: input.defaultParamFlag ?? true,
        continueAt: cleanNumber(input.continueAt),
      })
      requireFields(payload, ["uploadUrl", "prompt"])
      break
    case "upload-cover":
      payload = cleanPayload({ ...baseMusicPayload(input, siteUrl), uploadUrl: cleanString(input.uploadUrl) })
      requireFields(payload, ["uploadUrl", "prompt"])
      break
    case "add-instrumental":
      payload = cleanPayload({
        uploadUrl: cleanString(input.uploadUrl),
        title: cleanString(input.title),
        tags: cleanString(input.tags) || cleanString(input.style),
        negativeTags: cleanString(input.negativeTags),
        callBackUrl: callbackUrl(input, siteUrl),
        model: MODEL_SET.has(String(input.model)) ? input.model : "V5",
        vocalGender: cleanString(input.vocalGender),
        styleWeight: cleanRangeNumber(input.styleWeight, "styleWeight", 0, 1),
        weirdnessConstraint: cleanRangeNumber(input.weirdnessConstraint, "weirdnessConstraint", 0, 1),
        audioWeight: cleanRangeNumber(input.audioWeight, "audioWeight", 0, 1),
      })
      requireFields(payload, ["uploadUrl", "title", "tags"])
      break
    case "add-vocals":
      payload = cleanPayload({
        prompt: cleanString(input.prompt),
        title: cleanString(input.title),
        negativeTags: cleanString(input.negativeTags),
        style: cleanString(input.style),
        uploadUrl: cleanString(input.uploadUrl),
        callBackUrl: callbackUrl(input, siteUrl),
        model: MODEL_SET.has(String(input.model)) ? input.model : "V5",
        vocalGender: cleanString(input.vocalGender),
        styleWeight: cleanRangeNumber(input.styleWeight, "styleWeight", 0, 1),
        weirdnessConstraint: cleanRangeNumber(input.weirdnessConstraint, "weirdnessConstraint", 0, 1),
        audioWeight: cleanRangeNumber(input.audioWeight, "audioWeight", 0, 1),
      })
      requireFields(payload, ["uploadUrl", "prompt", "title", "style"])
      break
    case "mashup":
      payload = cleanPayload({
        ...baseMusicPayload(input, siteUrl),
        uploadUrlList: Array.isArray(input.uploadUrlList) ? input.uploadUrlList.filter(hasText).map((url) => url.trim()) : [],
      })
      requireFields(payload, ["uploadUrlList", "prompt"])
      if (!Array.isArray(payload.uploadUrlList) || payload.uploadUrlList.length !== 2) {
        throw new Error("Mashup requires exactly two upload URLs.")
      }
      break
    case "replace-section":
      payload = cleanPayload({
        taskId: cleanString(input.taskId),
        audioId: cleanString(input.audioId),
        prompt: cleanString(input.prompt),
        tags: cleanString(input.tags) || cleanString(input.style),
        title: cleanString(input.title),
        negativeTags: cleanString(input.negativeTags),
        infillStartS: cleanNumber(input.infillStartS),
        infillEndS: cleanNumber(input.infillEndS),
        fullLyrics: cleanString(input.fullLyrics),
        callBackUrl: callbackUrl(input, siteUrl),
      })
      requireFields(payload, ["taskId", "audioId", "prompt", "tags", "title", "infillStartS", "infillEndS"])
      break
    case "timestamped-lyrics":
      payload = cleanPayload({ taskId: cleanString(input.taskId), audioId: cleanString(input.audioId) })
      requireFields(payload, ["taskId", "audioId"])
      break
    case "cover-generate":
      payload = cleanPayload({ taskId: cleanString(input.taskId), callBackUrl: callbackUrl(input, siteUrl) })
      requireFields(payload, ["taskId"])
      break
    case "separate-vocals":
      payload = cleanPayload({
        taskId: cleanString(input.taskId),
        audioId: cleanString(input.audioId),
        callBackUrl: callbackUrl(input, siteUrl),
        type: input.separationType || "separate_vocal",
      })
      requireFields(payload, ["taskId", "audioId", "type"])
      break
    case "generate-midi":
      payload = cleanPayload({
        taskId: cleanString(input.taskId),
        audioId: cleanString(input.audioId),
        callBackUrl: callbackUrl(input, siteUrl),
      })
      requireFields(payload, ["taskId"])
      break
    case "create-video":
      payload = cleanPayload({
        taskId: cleanString(input.taskId),
        audioId: cleanString(input.audioId),
        callBackUrl: callbackUrl(input, siteUrl),
        author: cleanString(input.author) || "Seed Music",
        domainName: cleanString(input.domainName) || "seed.music",
      })
      requireFields(payload, ["taskId", "audioId"])
      break
    case "convert-wav":
      payload = cleanPayload({
        taskId: cleanString(input.taskId),
        audioId: cleanString(input.audioId),
        callBackUrl: callbackUrl(input, siteUrl),
      })
      requireFields(payload, ["taskId", "audioId"])
      break
    case "generate-persona":
      payload = cleanPayload({
        taskId: cleanString(input.taskId),
        audioId: cleanString(input.audioId),
        name: cleanString(input.name) || cleanString(input.title),
        description: cleanString(input.description) || cleanString(input.prompt),
        vocalStart: cleanNumber(input.vocalStart),
        vocalEnd: cleanNumber(input.vocalEnd),
        style: cleanString(input.style),
      })
      requireFields(payload, ["taskId", "audioId", "name", "description"])
      break
    case "voice-validate":
      payload = cleanPayload({
        voiceUrl: cleanString(input.voiceUrl) || cleanString(input.uploadUrl),
        vocalStartS: cleanNumber(input.vocalStartS),
        vocalEndS: cleanNumber(input.vocalEndS),
        language: cleanString(input.language),
        callBackUrl: callbackUrl(input, siteUrl),
      })
      requireFields(payload, ["voiceUrl", "vocalStartS", "vocalEndS"])
      break
    case "generate-voice":
      payload = cleanPayload({
        taskId: cleanString(input.taskId),
        verifyUrl: cleanString(input.verifyUrl) || cleanString(input.uploadUrl),
        voiceName: cleanString(input.voiceName) || cleanString(input.name) || cleanString(input.title),
        description: cleanString(input.description) || cleanString(input.prompt),
        style: cleanString(input.style),
        callBackUrl: callbackUrl(input, siteUrl),
        singerSkillLevel: cleanString(input.singerSkillLevel) || "beginner",
      })
      requireFields(payload, ["taskId", "verifyUrl"])
      break
    case "check-voice":
      payload = cleanPayload({ task_id: cleanString(input.taskId) })
      requireFields(payload, ["task_id"])
      break
    default:
      workflow satisfies never
      throw new Error("Unsupported workflow.")
  }

  return { workflow, payload }
}

export function getKieDetailPath(workflowId: string) {
  const workflow = getSunoWorkflow(workflowId)
  return workflow && "detailPath" in workflow ? workflow.detailPath : undefined
}

export function extractTaskId(data: unknown) {
  return findTaskId(data)
}

const TASK_ID_FIELDS = new Set(["taskId", "task_id"])

function findTaskId(value: unknown, depth = 0): string | null {
  if (!value || depth > 4) return null

  if (Array.isArray(value)) {
    for (const item of value) {
      const taskId = findTaskId(item, depth + 1)
      if (taskId) return taskId
    }
    return null
  }

  if (typeof value !== "object") return null

  for (const [key, nested] of Object.entries(value)) {
    if (TASK_ID_FIELDS.has(key) && typeof nested === "string" && nested.trim()) {
      return nested.trim()
    }
  }

  for (const nested of Object.values(value)) {
    const taskId = findTaskId(nested, depth + 1)
    if (taskId) return taskId
  }

  return null
}
