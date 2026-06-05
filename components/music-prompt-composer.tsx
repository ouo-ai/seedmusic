"use client"

import { useState } from "react"

type Genre = "Pop" | "Hip-Hop" | "Electronic" | "Rock" | "Jazz" | "Classical" | "Folk" | "R&B"
type Mood = "Energetic" | "Chill" | "Melancholic" | "Uplifting" | "Dark" | "Romantic"
type VocalMode = "Vocals" | "Instrumental"
type Duration = "0:30" | "1:00" | "2:00" | "3:00"

const GENRES: Genre[] = ["Pop", "Hip-Hop", "Electronic", "Rock", "Jazz", "Classical", "Folk", "R&B"]
const MOODS: Mood[] = ["Energetic", "Chill", "Melancholic", "Uplifting", "Dark", "Romantic"]
const DURATIONS: Duration[] = ["0:30", "1:00", "2:00", "3:00"]

const EXAMPLE_PROMPTS = [
  "A driving synthwave track for a late-night city montage, pulsing bass, neon nostalgia",
  "Tender indie folk ballad with fingerpicked acoustic guitar and soft female vocals",
  "High-energy hip-hop beat with punchy 808s and triumphant brass stabs",
  "Cinematic orchestral swell that builds to an emotional peak, no lyrics",
]

// Animated waveform
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

// Pill selector
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

// Mock generated track row
function GeneratedTrack({
  title,
  meta,
  idx,
  playing,
  onToggle,
}: {
  title: string
  meta: string
  idx: number
  playing: boolean
  onToggle: () => void
}) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer transition-colors ${
        playing
          ? "bg-[rgba(26,158,143,0.08)] border border-[rgba(26,158,143,0.22)]"
          : "hover:bg-[rgba(42,36,32,0.04)] border border-transparent"
      }`}
      onClick={onToggle}
    >
      {/* Play/pause */}
      <button
        aria-label={playing ? `Pause ${title}` : `Play ${title}`}
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          playing ? "bg-[#E8541A]" : "bg-[rgba(42,36,32,0.08)] hover:bg-[rgba(42,36,32,0.14)]"
        }`}
      >
        {playing ? (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <rect x="1.5" y="1.5" width="2.5" height="7" rx="1" fill="white" />
            <rect x="6" y="1.5" width="2.5" height="7" rx="1" fill="white" />
          </svg>
        ) : (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2.5 1.5L8.5 5L2.5 8.5V1.5Z" fill="#2A2420" />
          </svg>
        )}
      </button>
      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="text-[#2A2420] text-[13px] font-semibold leading-[18px] font-sans truncate">{title}</div>
        <div className="text-[#857870] text-[11px] font-normal font-sans leading-4">{meta}</div>
      </div>
      {/* Mini waveform / time */}
      {playing ? (
        <div className="flex items-end gap-[2px] h-6">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="w-[2px] rounded-full bg-[#1A9E8F]"
              style={{ height: `${Math.round(6 + Math.abs(Math.sin(i * 0.8)) * 12)}px`, opacity: 0.7 + (i % 3) * 0.1 }}
            />
          ))}
        </div>
      ) : (
        <span className="text-[#857870] text-[11px] font-mono">
          {idx === 0 ? "2:47" : idx === 1 ? "3:05" : "2:31"}
        </span>
      )}
    </div>
  )
}

const RESULT_TRACKS = [
  { title: "Neon Cascade", meta: "Electronic · Instrumental · 130 BPM" },
  { title: "Cascade (Vocal Mix)", meta: "Electronic · Vocals · 130 BPM" },
  { title: "Low-Key Version", meta: "Electronic · Stripped · 95 BPM" },
]

export default function MusicPromptComposer() {
  const [prompt, setPrompt] = useState("")
  const [genre, setGenre] = useState<Genre>("Electronic")
  const [mood, setMood] = useState<Mood>("Energetic")
  const [vocals, setVocals] = useState<VocalMode>("Instrumental")
  const [duration, setDuration] = useState<Duration>("2:00")
  const [phase, setPhase] = useState<"idle" | "generating" | "done">("idle")
  const [playingTrack, setPlayingTrack] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<"prompt" | "lyrics" | "reference">("prompt")

  const handleGenerate = () => {
    if (phase === "generating") return
    setPhase("generating")
    setPlayingTrack(null)
    setTimeout(() => setPhase("done"), 2800)
  }

  const handleExample = (ex: string) => setPrompt(ex)

  const charLeft = 280 - prompt.length

  return (
    <div className="flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[rgba(42,36,32,0.08)]">
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="7" stroke="#2A2420" strokeWidth="1.2" fill="none" />
            <circle cx="8" cy="8" r="2.5" fill="#E8541A" />
          </svg>
          <span className="text-[#2A2420] text-sm font-semibold font-sans">SeedMusic Studio</span>
          <span className="px-2 py-0.5 bg-[rgba(232,84,26,0.10)] text-[#E8541A] text-[11px] font-medium rounded-full font-sans">Demo preview</span>
        </div>
        <div className="flex items-center gap-2 text-[rgba(42,36,32,0.50)] text-xs font-sans">
          <span className="hidden sm:inline">No account needed</span>
          <div className="w-1.5 h-1.5 rounded-full bg-[#1A9E8F]" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* ── LEFT: INPUT PANEL ──────────────────── */}
        <div className="flex-1 md:border-r border-[rgba(42,36,32,0.08)] flex flex-col">
          {/* Mode tabs */}
          <div className="flex border-b border-[rgba(42,36,32,0.08)]">
            {(["prompt", "lyrics", "reference"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-[12px] font-medium font-sans capitalize transition-colors border-b-2 ${
                  activeTab === tab
                    ? "text-[#2A2420] border-[#E8541A]"
                    : "text-[rgba(42,36,32,0.50)] border-transparent hover:text-[#2A2420]"
                }`}
              >
                {tab === "prompt" ? "Text prompt" : tab === "lyrics" ? "Lyrics to song" : "Audio reference"}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-4 p-5">
            {/* Textarea */}
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value.slice(0, 280))}
                placeholder={
                  activeTab === "prompt"
                    ? "Describe your track: style, instruments, mood, tempo, story..."
                    : activeTab === "lyrics"
                    ? "Paste your lyrics here and Seed Music will map the music direction..."
                    : "Describe what you want — then upload a reference audio below..."
                }
                rows={4}
                className="w-full resize-none rounded-xl border border-[rgba(42,36,32,0.14)] bg-[#FAFAF9] px-4 py-3 text-[#2A2420] text-sm font-sans placeholder:text-[rgba(42,36,32,0.35)] focus:outline-none focus:border-[rgba(42,36,32,0.36)] leading-relaxed"
              />
              <div className="absolute bottom-3 right-3 text-[11px] font-mono text-[rgba(42,36,32,0.35)]">
                {charLeft}
              </div>
            </div>

            {/* Example prompts */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-medium text-[rgba(42,36,32,0.50)] uppercase tracking-wide font-sans">Try an example</span>
              <div className="flex flex-wrap gap-1.5">
                {EXAMPLE_PROMPTS.slice(0, 2).map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => handleExample(ex)}
                    className="px-3 py-1.5 bg-[#F0EDE9] hover:bg-[#E8E3DC] text-[#2A2420] text-[11px] font-medium rounded-lg font-sans transition-colors text-left max-w-[260px] truncate border border-[rgba(42,36,32,0.08)]"
                  >
                    {ex.slice(0, 52)}...
                  </button>
                ))}
              </div>
            </div>

            {/* Controls grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PillSelector label="Genre" options={GENRES} value={genre} onChange={setGenre} />
              <PillSelector label="Mood" options={MOODS} value={mood} onChange={setMood} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <PillSelector label="Vocals" options={["Vocals", "Instrumental"] as VocalMode[]} value={vocals} onChange={setVocals} />
              <PillSelector label="Duration" options={DURATIONS} value={duration} onChange={setDuration} />
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={phase === "generating"}
              className={`w-full h-11 rounded-xl flex items-center justify-center gap-2 font-sans font-medium text-sm transition-all ${
                phase === "generating"
                  ? "bg-[rgba(42,36,32,0.08)] text-[rgba(42,36,32,0.40)] cursor-not-allowed"
                  : "bg-[#2A2420] text-white hover:bg-[#1a1512] shadow-[0px_2px_8px_rgba(42,36,32,0.18)]"
              }`}
            >
              {phase === "generating" ? (
                <>
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="5.5" stroke="rgba(42,36,32,0.3)" strokeWidth="2" />
                    <path d="M7 1.5A5.5 5.5 0 0 1 12.5 7" stroke="#E8541A" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Previewing...
                </>
              ) : phase === "done" ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Preview again
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 1v12M1 7h12" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                  Preview with Seed Music AI
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── RIGHT: OUTPUT PANEL ─────────────────── */}
        <div className="flex-1 flex flex-col">
          {/* Waveform area */}
          <div className="px-5 py-4 border-b border-[rgba(42,36,32,0.08)] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[rgba(42,36,32,0.50)] uppercase tracking-wide font-sans">
                {phase === "idle" ? "Output preview" : phase === "generating" ? "Previewing..." : "Preview tracks"}
              </span>
              {phase === "done" && (
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1A9E8F]" />
                  <span className="text-[11px] text-[#1A9E8F] font-medium font-sans">3 variations</span>
                </div>
              )}
            </div>
            <div className="w-full bg-[#F0EDE9] rounded-xl overflow-hidden flex items-center justify-center" style={{ height: "80px" }}>
              {phase === "idle" ? (
                <span className="text-[rgba(42,36,32,0.30)] text-sm font-sans">Set your controls and preview</span>
              ) : (
                <LiveWaveform isGenerating={phase === "generating"} />
              )}
            </div>
          </div>

          {/* Track list */}
          <div className="flex-1 p-4 flex flex-col gap-1">
            {phase === "idle" && (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 py-6 text-center">
                <div className="w-12 h-12 rounded-2xl bg-[#F0EDE9] flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="9" stroke="#857870" strokeWidth="1.5" fill="none" />
                    <path d="M7 10l2.5 2.5L14 7" stroke="#857870" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <div className="text-[#2A2420] text-sm font-medium font-sans">No previews yet</div>
                  <div className="text-[rgba(42,36,32,0.50)] text-xs font-sans mt-0.5">Configure and preview sample results</div>
                </div>
              </div>
            )}

            {phase === "generating" && (
              <div className="flex-1 flex flex-col items-center justify-center gap-2 py-6">
                {[0.4, 0.7, 0.55].map((w, i) => (
                  <div key={i} className="w-full h-12 bg-[#F0EDE9] rounded-xl animate-pulse" style={{ opacity: w }} />
                ))}
              </div>
            )}

            {phase === "done" &&
              RESULT_TRACKS.map((track, idx) => (
                <GeneratedTrack
                  key={idx}
                  title={track.title}
                  meta={track.meta}
                  idx={idx}
                  playing={playingTrack === idx}
                  onToggle={() => setPlayingTrack((p) => (p === idx ? null : idx))}
                />
              ))}
          </div>

          {/* Download / export strip */}
          {phase === "done" && (
            <div className="px-5 py-3 border-t border-[rgba(42,36,32,0.08)] flex items-center justify-between">
              <span className="text-[11px] text-[rgba(42,36,32,0.45)] font-sans">Demo — sign in to download tracks</span>
              <button className="px-3 py-1.5 bg-white border border-[rgba(42,36,32,0.16)] rounded-lg text-[12px] font-medium text-[#2A2420] font-sans hover:bg-[#F0EDE9] transition-colors">
                Sign up to export
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
