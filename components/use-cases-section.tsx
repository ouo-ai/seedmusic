import type React from "react"

function Badge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="px-[14px] py-[6px] bg-white shadow-[0px_0px_0px_4px_rgba(42,36,32,0.05)] overflow-hidden rounded-[90px] flex justify-start items-center gap-[8px] border border-[rgba(42,36,32,0.10)]">
      <div className="w-[14px] h-[14px] relative overflow-hidden flex items-center justify-center">{icon}</div>
      <div className="text-center flex justify-center flex-col text-[#2A2420] text-xs font-medium leading-3 font-sans">{text}</div>
    </div>
  )
}

function PromptExampleCard({
  label,
  prompt,
  tags,
  accent,
}: {
  label: string
  prompt: string
  tags: string[]
  accent: string
}) {
  return (
    <div className="flex flex-col gap-3 p-5 bg-white rounded-2xl border border-[rgba(42,36,32,0.08)] shadow-[0px_1px_3px_rgba(42,36,32,0.06)] hover:shadow-[0px_4px_16px_rgba(42,36,32,0.08)] transition-shadow">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: `${accent}22` }}>
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accent }} />
        </div>
        <span className="text-[11px] font-semibold text-[rgba(42,36,32,0.50)] uppercase tracking-wide font-sans">{label}</span>
      </div>
      <p className="text-[#2A2420] text-sm font-normal leading-6 font-sans italic">&ldquo;{prompt}&rdquo;</p>
      <div className="flex flex-wrap gap-1.5 mt-auto">
        {tags.map((t) => (
          <span
            key={t}
            className="px-2 py-0.5 text-[11px] font-medium rounded-full font-sans"
            style={{ backgroundColor: `${accent}12`, color: accent }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

function UseCaseCard({
  icon,
  title,
  body,
  accent,
}: {
  icon: React.ReactNode
  title: string
  body: string
  accent: string
}) {
  return (
    <div className="flex flex-col gap-3 p-6 rounded-2xl border border-[rgba(42,36,32,0.08)] bg-white shadow-[0px_1px_3px_rgba(42,36,32,0.04)]">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: `${accent}18` }}
      >
        {icon}
      </div>
      <div className="text-[#2A2420] text-base font-semibold font-sans">{title}</div>
      <div className="text-[#857870] text-sm font-normal leading-6 font-sans">{body}</div>
    </div>
  )
}

const PROMPT_EXAMPLES = [
  {
    label: "Content creator",
    prompt: "Upbeat background track for a travel vlog montage — summery, no lyrics, acoustic guitar and light percussion",
    tags: ["Acoustic", "Instrumental", "1:30"],
    accent: "#E8541A",
  },
  {
    label: "Brand marketer",
    prompt: "30-second jingle for a tech product launch — modern, energetic, builds to a triumphant finish",
    tags: ["Electronic", "Jingle", "0:30"],
    accent: "#1A9E8F",
  },
  {
    label: "Indie artist",
    prompt: "Verse 1: 'Chasing shadows down the hall' — write me a melancholic indie-pop song in Dm",
    tags: ["Lyric input", "Indie Pop", "Dm"],
    accent: "#2A2420",
  },
  {
    label: "Game developer",
    prompt: "Looping dungeon ambience — dark orchestral, subtle tension, no clear melody to avoid fatigue",
    tags: ["Orchestral", "Loop", "Dark"],
    accent: "#E8A44A",
  },
  {
    label: "Podcast producer",
    prompt: "Calm, minimal intro music — soft piano, 15 seconds, fades gracefully",
    tags: ["Piano", "Instrumental", "0:15"],
    accent: "#4A7C8E",
  },
  {
    label: "Music team",
    prompt: "Reference this track tempo and energy but produce an original R&B version with male vocals",
    tags: ["Audio reference", "R&B", "Vocals"],
    accent: "#9E6B1A",
  },
]

const USE_CASES = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 2v14M3.5 6.5l5.5 5.5 5.5-5.5" stroke="#E8541A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Content & social",
    body: "Plan background music for videos, reels, and podcasts with a clear mood, tempo, and usage-rights checklist.",
    accent: "#E8541A",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="4" width="14" height="10" rx="2" stroke="#1A9E8F" strokeWidth="1.6" fill="none" />
        <path d="M6 8h6M6 11h4" stroke="#1A9E8F" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
    title: "Brand & advertising",
    body: "Draft jingle, brand anthem, and ad-score directions before moving into final generation or production.",
    accent: "#1A9E8F",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7" stroke="#2A2420" strokeWidth="1.6" fill="none" />
        <path d="M6.5 9l2 2 3.5-3.5" stroke="#2A2420" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Independent artists",
    body: "Draft instrumental directions, experiment with genre fusions, and organize lyric-to-song ideas before production.",
    accent: "#2A2420",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M3 9l6-6 6 6M5 7v8h8V7" stroke="#E8A44A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    ),
    title: "Games & interactive",
    body: "Plan adaptive soundtrack beds and ambient loop requirements for the audio engine or provider you connect.",
    accent: "#E8A44A",
  },
]

export default function UseCasesSection() {
  return (
    <div className="w-full border-b border-[rgba(42,36,32,0.10)] flex flex-col">
      {/* Use cases header */}
      <div className="self-stretch px-6 md:px-24 py-12 md:py-16 border-b border-[rgba(42,36,32,0.10)] flex justify-center items-center">
        <div className="w-full max-w-[586px] flex flex-col justify-start items-center gap-4 text-center">
          <Badge
            icon={
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1v10M2 6l4-4 4 4" stroke="#2A2420" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
            text="Use cases"
          />
          <div className="text-[#2A2420] text-3xl md:text-5xl font-semibold leading-tight md:leading-[60px] font-sans tracking-tight text-balance">
            Built for every creative context
          </div>
          <div className="text-[#857870] text-base font-normal leading-7 font-sans">
            Seed Music AI fits into creator, marketing, and music production planning workflows with plain-language controls.
          </div>
        </div>
      </div>

      {/* Use case grid */}
      <div className="px-6 md:px-12 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {USE_CASES.map((uc) => (
          <UseCaseCard key={uc.title} {...uc} />
        ))}
      </div>

      {/* Prompt examples */}
      <div className="border-t border-[rgba(42,36,32,0.10)] px-6 md:px-12 py-10 md:py-12 flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <div className="text-[#2A2420] text-xl font-semibold font-sans">Prompt examples</div>
          <div className="text-[#857870] text-sm font-normal leading-6 font-sans">
            Real Seed Music input examples to try in the composer above.
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROMPT_EXAMPLES.map((ex) => (
            <PromptExampleCard key={ex.label} {...ex} />
          ))}
        </div>
      </div>
    </div>
  )
}
