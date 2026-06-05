"use client"

import { useMemo, useState } from "react"

import { MUSIC_MODEL_VERSIONS, MUSIC_WORKFLOWS, type MusicWorkflowId } from "@/lib/music-workflows"

type Genre = "Pop" | "Hip-Hop" | "Electronic" | "Rock" | "Jazz" | "Classical" | "Folk" | "R&B"
type Mood = "Energetic" | "Chill" | "Melancholic" | "Uplifting" | "Dark" | "Romantic"
type VocalMode = "Vocals" | "Instrumental"
type Duration = "0:30" | "1:00" | "2:00" | "3:00"
type Phase = "idle" | "submitting" | "created" | "ready" | "error"

type ApiResult = {
  ok?: boolean
  status?: number
  error?: string
  taskId?: string | null
  tracks?: TrackResult[]
  links?: LinkResult[]
}

type LinkResult = {
  label: string
  url: string
}

type TrackResult = {
  id: string
  title: string
  meta: string
  audioUrl?: string
}

const GENRES: Genre[] = ["Pop", "Hip-Hop", "Electronic", "Rock", "Jazz", "Classical", "Folk", "R&B"]
const MOODS: Mood[] = ["Energetic", "Chill", "Melancholic", "Uplifting", "Dark", "Romantic"]
const DURATIONS: Duration[] = ["0:30", "1:00", "2:00", "3:00"]
const POLLABLE_WORKFLOWS = new Set<string>(MUSIC_WORKFLOWS.filter((workflow) => workflow.pollable).map((workflow) => workflow.id))

const EXAMPLE_PROMPTS = [
  "A driving synthwave track for a late-night city montage, pulsing bass, neon nostalgia",
  "Tender indie folk ballad with fingerpicked acoustic guitar and soft female vocals",
  "High-energy hip-hop beat with punchy 808s and triumphant brass stabs",
  "Cinematic orchestral swell that builds to an emotional peak, no lyrics",
]

function LiveWaveform({ isGenerating }: { isGenerating: boolean }) {
  const bars = Array.from({ length: 40 })
  return (
    <div className="flex items-end gap-[2.5px] h-10 px-1" aria-hidden="true">
      {bars.map((_, i) => {
        const seed = Math.sin(i * 1.3) * 0.5 + 0.5
        const height = isGenerating
          ? `${Math.round(12 + seed * 18 + Math.abs(Math.sin(i * 0.5)) * 12)}px`
          : `${4 + (i % 5) * 2}px`
        return (
          <div
            key={i}
            className="w-[3px] rounded-full transition-all"
            style={{
              height,
              backgroundColor: i % 3 === 0 ? "#E8541A" : i % 3 === 1 ? "#1A9E8F" : "#2A2420",
              opacity: isGenerating ? 0.6 + (i % 4) * 0.1 : 0.25,
              transition: isGenerating ? `height ${300 + (i % 5) * 80}ms ease-in-out` : "height 200ms ease",
            }}
          />
        )
      })}
    </div>
  )
}

function PillSelector<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: T[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px] font-medium text-[rgba(42,36,32,0.50)] uppercase tracking-wide font-sans">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`px-3 py-1 rounded-full text-[12px] font-medium font-sans transition-colors border ${
              value === opt
                ? "bg-[#2A2420] text-white border-[#2A2420]"
                : "bg-white text-[#2A2420] border-[rgba(42,36,32,0.16)] hover:border-[rgba(42,36,32,0.36)]"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

function SelectField({
  label,
  value,
  onChange,
  children,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-medium text-[rgba(42,36,32,0.50)] uppercase tracking-wide font-sans">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 rounded-xl border border-[rgba(42,36,32,0.14)] bg-white px-3 text-[#2A2420] text-sm font-sans focus:outline-none focus:border-[rgba(42,36,32,0.36)]"
      >
        {children}
      </select>
    </label>
  )
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  type?: "text" | "number" | "url"
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-medium text-[rgba(42,36,32,0.50)] uppercase tracking-wide font-sans">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-10 rounded-xl border border-[rgba(42,36,32,0.14)] bg-white px-3 text-[#2A2420] text-sm font-sans placeholder:text-[rgba(42,36,32,0.35)] focus:outline-none focus:border-[rgba(42,36,32,0.36)]"
      />
    </label>
  )
}

function extractTaskId(result: ApiResult | null) {
  if (!result) return ""
  if (typeof result.taskId === "string") return result.taskId
  return ""
}

function extractTracks(result: ApiResult | null): TrackResult[] {
  return result?.tracks || []
}

export default function MusicPromptComposer() {
  const [prompt, setPrompt] = useState("")
  const [genre, setGenre] = useState<Genre>("Electronic")
  const [mood, setMood] = useState<Mood>("Energetic")
  const [vocals, setVocals] = useState<VocalMode>("Instrumental")
  const [duration, setDuration] = useState<Duration>("2:00")
  const [workflowId, setWorkflowId] = useState<MusicWorkflowId>("generate")
  const [model, setModel] = useState("V5_5")
  const [title, setTitle] = useState("Seed Music draft")
  const [style, setStyle] = useState("Electronic, energetic, polished, cinematic")
  const [uploadUrl, setUploadUrl] = useState("")
  const [secondUploadUrl, setSecondUploadUrl] = useState("")
  const [taskId, setTaskId] = useState("")
  const [audioId, setAudioId] = useState("")
  const [continueAt, setContinueAt] = useState("")
  const [phase, setPhase] = useState<Phase>("idle")
  const [result, setResult] = useState<ApiResult | null>(null)
  const [error, setError] = useState("")
  const [playingTrack, setPlayingTrack] = useState<number | null>(null)

  const workflow = useMemo(() => MUSIC_WORKFLOWS.find((item) => item.id === workflowId) || MUSIC_WORKFLOWS[0], [workflowId])
  const charLeft = 5000 - prompt.length
  const tracks = extractTracks(result)
  const links = (result?.links || []).filter((link) => !tracks.some((track) => track.audioUrl === link.url)).slice(0, 5)
  const activeTaskId = taskId || extractTaskId(result)
  const canPoll = POLLABLE_WORKFLOWS.has(workflowId) && Boolean(activeTaskId)
  const needsUpload = ["upload-extend", "upload-cover", "add-instrumental", "add-vocals", "mashup", "generate-voice"].includes(workflowId)
  const needsTask = [
    "extend",
    "replace-section",
    "timestamped-lyrics",
    "cover-generate",
    "separate-vocals",
    "generate-midi",
    "create-video",
    "convert-wav",
    "generate-persona",
    "generate-voice",
    "check-voice",
  ].includes(workflowId)
  const needsAudioId = [
    "extend",
    "replace-section",
    "timestamped-lyrics",
    "separate-vocals",
    "generate-midi",
    "create-video",
    "convert-wav",
    "generate-persona",
  ].includes(workflowId)

  const handleExample = (example: string) => setPrompt(example)

  const buildPayload = () => {
    const styleText = style.trim() || `${genre}, ${mood}, ${vocals}`
    const uploadUrlList = [uploadUrl, secondUploadUrl].filter((url) => url.trim())
    return {
      workflow: workflowId,
      model,
      prompt: prompt.trim(),
      customMode: true,
      defaultParamFlag: true,
      instrumental: vocals === "Instrumental",
      style: styleText,
      tags: styleText,
      title: title.trim() || "Seed Music draft",
      negativeTags: "low quality, noisy, distorted",
      uploadUrl,
      uploadUrlList,
      taskId: activeTaskId,
      audioId,
      content: styleText,
      continueAt: continueAt ? Number(continueAt) : undefined,
      infillStartS: 20,
      infillEndS: 40,
      separationType: "separate_vocal",
      author: "Seed Music",
      domainName: "seed.music",
      name: title,
      description: prompt,
      verifyUrl: uploadUrl,
      voiceName: title,
      singerSkillLevel: "beginner",
      soundLoop: duration === "0:30",
      grabLyrics: true,
    }
  }

  const submitWorkflow = async () => {
    if (phase === "submitting") return
    setPhase("submitting")
    setError("")
    setPlayingTrack(null)

    try {
      const response = await fetch("/api/music-engine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      })
      const data = (await response.json()) as ApiResult
      setResult(data)
      const createdTaskId = extractTaskId(data)
      if (createdTaskId) setTaskId(createdTaskId)
      if (!response.ok || data.ok === false) {
        throw new Error(data.error || `Music engine returned HTTP ${response.status}`)
      }
      setPhase(createdTaskId ? "created" : "ready")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Music engine request failed.")
      setPhase("error")
    }
  }

  const checkStatus = async () => {
    if (!canPoll || phase === "submitting") return
    setPhase("submitting")
    setError("")
    try {
      const response = await fetch(`/api/music-engine?workflow=${encodeURIComponent(workflowId)}&taskId=${encodeURIComponent(activeTaskId)}`)
      const data = (await response.json()) as ApiResult
      setResult(data)
      if (!response.ok || data.ok === false) {
        throw new Error(data.error || `Music engine returned HTTP ${response.status}`)
      }
      setPhase("ready")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Music engine status request failed.")
      setPhase("error")
    }
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-5 py-3 border-b border-[rgba(42,36,32,0.08)]">
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="7" stroke="#2A2420" strokeWidth="1.2" fill="none" />
            <circle cx="8" cy="8" r="2.5" fill="#E8541A" />
          </svg>
          <span className="text-[#2A2420] text-sm font-semibold font-sans">SeedMusic Studio</span>
          <span className="px-2 py-0.5 bg-[rgba(26,158,143,0.10)] text-[#1A9E8F] text-[11px] font-medium rounded-full font-sans">Live music engine</span>
        </div>
        <div className="flex items-center gap-2 text-[rgba(42,36,32,0.50)] text-xs font-sans">
          <span className="hidden sm:inline">{workflow.group}</span>
          <div className="w-1.5 h-1.5 rounded-full bg-[#1A9E8F]" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="flex-1 md:border-r border-[rgba(42,36,32,0.08)] flex flex-col">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 border-b border-[rgba(42,36,32,0.08)]">
            <SelectField label="Model Type" value={workflowId} onChange={(value) => setWorkflowId(value as MusicWorkflowId)}>
              {["Create", "Edit", "Upload", "Post", "Voice"].map((group) => (
                <optgroup key={group} label={group}>
                  {MUSIC_WORKFLOWS.filter((item) => item.group === group).map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </SelectField>
            <SelectField label="Model Version" value={model} onChange={setModel}>
              {MUSIC_MODEL_VERSIONS.map((version) => (
                <option key={version} value={version}>
                  {version}
                </option>
              ))}
            </SelectField>
          </div>

          <div className="flex flex-col gap-4 p-5">
            <div className="rounded-xl bg-[rgba(26,158,143,0.07)] border border-[rgba(26,158,143,0.18)] px-4 py-3">
              <div className="text-[#2A2420] text-sm font-semibold font-sans">{workflow.label}</div>
              <div className="text-[#857870] text-xs leading-5 font-sans mt-0.5">{workflow.description}</div>
            </div>

            <div className="relative">
              <textarea
                value={prompt}
                onChange={(event) => setPrompt(event.target.value.slice(0, 5000))}
                placeholder="Describe the music, lyrics, edit, voice, or post-processing request for the selected workflow..."
                rows={5}
                className="w-full resize-none rounded-xl border border-[rgba(42,36,32,0.14)] bg-[#FAFAF9] px-4 py-3 text-[#2A2420] text-sm font-sans placeholder:text-[rgba(42,36,32,0.35)] focus:outline-none focus:border-[rgba(42,36,32,0.36)] leading-relaxed"
              />
              <div className="absolute bottom-3 right-3 text-[11px] font-mono text-[rgba(42,36,32,0.35)]">{charLeft}</div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-medium text-[rgba(42,36,32,0.50)] uppercase tracking-wide font-sans">Try an example</span>
              <div className="flex flex-wrap gap-1.5">
                {EXAMPLE_PROMPTS.slice(0, 2).map((example) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => handleExample(example)}
                    className="px-3 py-1.5 bg-[#F0EDE9] hover:bg-[#E8E3DC] text-[#2A2420] text-[11px] font-medium rounded-lg font-sans transition-colors text-left max-w-[260px] truncate border border-[rgba(42,36,32,0.08)]"
                  >
                    {example.slice(0, 52)}...
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField label="Title" value={title} onChange={setTitle} placeholder="Seed Music draft" />
              <TextField label="Style / Tags" value={style} onChange={setStyle} placeholder="Electronic, cinematic, upbeat" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PillSelector label="Genre" options={GENRES} value={genre} onChange={setGenre} />
              <PillSelector label="Mood" options={MOODS} value={mood} onChange={setMood} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <PillSelector label="Vocals" options={["Vocals", "Instrumental"] as VocalMode[]} value={vocals} onChange={setVocals} />
              <PillSelector label="Duration" options={DURATIONS} value={duration} onChange={setDuration} />
            </div>

            {(needsUpload || workflowId === "mashup") && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextField label={workflowId === "generate-voice" ? "Verify Audio URL" : "Upload URL"} value={uploadUrl} onChange={setUploadUrl} placeholder="https://..." type="url" />
                {workflowId === "mashup" ? (
                  <TextField label="Second Upload URL" value={secondUploadUrl} onChange={setSecondUploadUrl} placeholder="https://..." type="url" />
                ) : (
                  <TextField label="Continue At" value={continueAt} onChange={setContinueAt} placeholder="60" type="number" />
                )}
              </div>
            )}

            {(needsTask || needsAudioId) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {needsTask && <TextField label="Task ID" value={taskId} onChange={setTaskId} placeholder="Task ID" />}
                {needsAudioId && <TextField label="Audio ID" value={audioId} onChange={setAudioId} placeholder="Generated audio id" />}
              </div>
            )}

            <button
              type="button"
              onClick={submitWorkflow}
              disabled={phase === "submitting"}
              className={`w-full h-11 rounded-xl flex items-center justify-center gap-2 font-sans font-medium text-sm transition-all ${
                phase === "submitting"
                  ? "bg-[rgba(42,36,32,0.08)] text-[rgba(42,36,32,0.40)] cursor-not-allowed"
                  : "bg-[#2A2420] text-white hover:bg-[#1a1512] shadow-[0px_2px_8px_rgba(42,36,32,0.18)]"
              }`}
            >
              {phase === "submitting" ? (
                <>
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="5.5" stroke="rgba(42,36,32,0.3)" strokeWidth="2" />
                    <path d="M7 1.5A5.5 5.5 0 0 1 12.5 7" stroke="#E8541A" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Sending to music engine...
                </>
              ) : (
                "Run Seed Music workflow"
              )}
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="px-5 py-4 border-b border-[rgba(42,36,32,0.08)] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[rgba(42,36,32,0.50)] uppercase tracking-wide font-sans">
                {phase === "idle" ? "Studio output" : phase === "submitting" ? "Processing" : phase === "error" ? "Error" : "Seed Music result"}
              </span>
              {activeTaskId && (
                <button
                  type="button"
                  onClick={checkStatus}
                  disabled={!canPoll || phase === "submitting"}
                  className="px-3 py-1.5 bg-white border border-[rgba(42,36,32,0.16)] rounded-lg text-[12px] font-medium text-[#2A2420] font-sans hover:bg-[#F0EDE9] transition-colors disabled:opacity-40"
                >
                  Check status
                </button>
              )}
            </div>
            <div className="w-full bg-[#F0EDE9] rounded-xl overflow-hidden flex items-center justify-center" style={{ height: "80px" }}>
              {phase === "idle" ? (
                <span className="text-[rgba(42,36,32,0.30)] text-sm font-sans">Choose a model type and submit</span>
              ) : (
                <LiveWaveform isGenerating={phase === "submitting"} />
              )}
            </div>
          </div>

          <div className="flex-1 p-4 flex flex-col gap-3">
            {error && (
              <div className="rounded-xl border border-[rgba(232,84,26,0.25)] bg-[rgba(232,84,26,0.08)] px-4 py-3 text-[#8A2D10] text-sm font-sans">
                {error}
              </div>
            )}

            {activeTaskId && (
              <div className="rounded-xl border border-[rgba(42,36,32,0.10)] bg-white px-4 py-3">
                <div className="text-[11px] text-[rgba(42,36,32,0.45)] uppercase tracking-wide font-sans">Task ID</div>
                <div className="text-[#2A2420] text-xs font-mono break-all mt-1">{activeTaskId}</div>
              </div>
            )}

            {tracks.length > 0 &&
              tracks.map((track, index) => (
                <div key={track.id} className="rounded-xl border border-[rgba(42,36,32,0.10)] bg-white px-4 py-3 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => setPlayingTrack((current) => (current === index ? null : index))}
                    className="flex items-center gap-3 text-left"
                  >
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center ${playingTrack === index ? "bg-[#E8541A]" : "bg-[rgba(42,36,32,0.08)]"}`}>
                      <span className="text-[10px] font-mono text-[#2A2420]">{index + 1}</span>
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-[#2A2420] text-[13px] font-semibold leading-[18px] font-sans truncate">{track.title}</span>
                      <span className="block text-[#857870] text-[11px] font-normal font-sans leading-4 truncate">{track.meta || workflow.label}</span>
                    </span>
                  </button>
                  {track.audioUrl && <audio className="w-full h-8" src={track.audioUrl} controls preload="none" />}
                </div>
              ))}

            {links.length > 0 && (
              <div className="rounded-xl border border-[rgba(42,36,32,0.10)] bg-white px-4 py-3">
                <div className="text-[11px] text-[rgba(42,36,32,0.45)] uppercase tracking-wide font-sans mb-2">Returned URLs</div>
                <div className="flex flex-col gap-1.5">
                  {links.map((link) => (
                    <a key={`${link.label}-${link.url}`} href={link.url} target="_blank" rel="noreferrer" className="text-[#1A6E66] text-xs font-sans underline underline-offset-2 break-all">
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {!result && !error && (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 py-6 text-center">
                <div className="w-12 h-12 rounded-2xl bg-[#F0EDE9] flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="9" stroke="#857870" strokeWidth="1.5" fill="none" />
                    <path d="M7 10l2.5 2.5L14 7" stroke="#857870" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <div className="text-[#2A2420] text-sm font-medium font-sans">No task yet</div>
                  <div className="text-[rgba(42,36,32,0.50)] text-xs font-sans mt-0.5">Submit a Seed Music workflow to start</div>
                </div>
              </div>
            )}

            {result && tracks.length === 0 && links.length === 0 && !error && (
              <div className="rounded-xl border border-[rgba(42,36,32,0.10)] bg-[#FAFAF9] px-4 py-3 text-[#857870] text-xs leading-5 font-sans">
                Task submitted. Use the status button to check for generated media.
              </div>
            )}
          </div>

          <div className="px-5 py-3 border-t border-[rgba(42,36,32,0.08)]">
            <span className="text-[11px] text-[rgba(42,36,32,0.45)] font-sans">
              Music tasks may need polling after creation. Usage rights, credits, and moderation rules apply.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
