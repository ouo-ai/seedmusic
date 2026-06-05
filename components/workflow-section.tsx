import type React from "react"

function Badge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="px-[14px] py-[6px] bg-white shadow-[0px_0px_0px_4px_rgba(42,36,32,0.05)] overflow-hidden rounded-[90px] flex justify-start items-center gap-[8px] border border-[rgba(42,36,32,0.10)]">
      <div className="w-[14px] h-[14px] relative overflow-hidden flex items-center justify-center">{icon}</div>
      <div className="text-center flex justify-center flex-col text-[#2A2420] text-xs font-medium leading-3 font-sans">
        {text}
      </div>
    </div>
  )
}

function StepCard({
  step,
  title,
  description,
  accent,
  detail,
}: {
  step: string
  title: string
  description: string
  accent: string
  detail: React.ReactNode
}) {
  return (
    <div className="flex-1 min-w-[240px] flex flex-col gap-4 p-6 bg-white rounded-2xl border border-[rgba(42,36,32,0.08)] shadow-[0px_1px_3px_rgba(42,36,32,0.06)]">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-sans text-white"
        style={{ backgroundColor: accent }}
      >
        {step}
      </div>
      <div>
        <div className="text-[#2A2420] text-base font-semibold font-sans mb-1">{title}</div>
        <div className="text-[#857870] text-sm font-normal leading-6 font-sans">{description}</div>
      </div>
      <div className="mt-auto">{detail}</div>
    </div>
  )
}

// Mini prompt chip
function PromptChip({ text }: { text: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F0EDE9] rounded-lg text-[12px] font-medium text-[#2A2420] font-sans border border-[rgba(42,36,32,0.08)]">
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path d="M1.5 5h7M5 1.5L8.5 5 5 8.5" stroke="#E8541A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {text}
    </div>
  )
}

// Mini waveform
function MiniWave({ color }: { color: string }) {
  return (
    <div className="flex items-end gap-[2px] h-8">
      {Array.from({ length: 22 }).map((_, i) => (
        <div
          key={i}
          className="w-[3px] rounded-full"
          style={{
            height: `${Math.round(8 + Math.abs(Math.sin(i * 0.9)) * 18)}px`,
            backgroundColor: color,
            opacity: 0.5 + (i % 3) * 0.15,
          }}
        />
      ))}
    </div>
  )
}

// Mini track export row
function ExportRow({ label, format }: { label: string; format: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-[rgba(42,36,32,0.06)] last:border-0">
      <span className="text-[12px] text-[#2A2420] font-medium font-sans">{label}</span>
      <span className="text-[11px] text-[#1A9E8F] font-semibold font-sans uppercase tracking-wide">{format}</span>
    </div>
  )
}

const STEPS = [
  {
    step: "1",
    title: "Describe your sound",
    description:
      "Write a text prompt, paste lyrics, or set a mood and genre. Even a single sentence is enough to frame a useful music direction.",
    accent: "#E8541A",
    detail: (
      <div className="flex flex-wrap gap-1.5">
        <PromptChip text="Late night drive" />
        <PromptChip text="Synthwave" />
        <PromptChip text="No vocals" />
      </div>
    ),
  },
  {
    step: "2",
    title: "Generate & compare",
    description:
      "Generate multiple arrangement directions and compare tempo, vocal, and instrumentation choices before committing.",
    accent: "#1A9E8F",
    detail: <MiniWave color="#1A9E8F" />,
  },
  {
    step: "3",
    title: "Refine & export",
    description:
      "Adjust tempo, key, or instrumentation notes, then prepare export requirements for the production workflow you connect.",
    accent: "#2A2420",
    detail: (
      <div className="rounded-lg bg-[#F7F5F3] border border-[rgba(42,36,32,0.08)] px-3 py-2">
        <ExportRow label="Stereo mix" format="WAV" />
        <ExportRow label="Stems pack" format="ZIP" />
        <ExportRow label="MIDI export" format="MID" />
      </div>
    ),
  },
]

export default function WorkflowSection() {
  return (
    <div className="w-full border-b border-[rgba(42,36,32,0.10)] flex flex-col justify-center items-center">
      {/* Header */}
      <div className="self-stretch px-6 md:px-24 py-12 md:py-16 border-b border-[rgba(42,36,32,0.10)] flex justify-center items-center">
        <div className="w-full max-w-[586px] flex flex-col justify-start items-center gap-4 text-center">
          <Badge
            icon={
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6h8M6 2l4 4-4 4" stroke="#2A2420" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
            text="How it works"
          />
          <div className="text-[#2A2420] text-3xl md:text-5xl font-semibold leading-tight md:leading-[60px] font-sans tracking-tight text-balance">
            Brief to track in three steps
          </div>
          <div className="text-[#857870] text-base font-normal leading-7 font-sans">
            Seed Music AI organizes the composition process so you can move from idea to a clear, review-ready music direction.
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="self-stretch px-6 md:px-12 py-10 md:py-14 flex flex-col md:flex-row gap-5 md:gap-6">
        {STEPS.map((s) => (
          <StepCard key={s.step} {...s} />
        ))}
      </div>

      {/* Feature comparison strip */}
      <div className="self-stretch border-t border-[rgba(42,36,32,0.10)] px-6 md:px-12 py-8 flex flex-col gap-6">
        <div className="text-[#2A2420] text-xl font-semibold font-sans text-center">Seed Music vs traditional workflow</div>
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm font-sans border-collapse">
            <thead>
              <tr className="border-b border-[rgba(42,36,32,0.10)]">
                <th className="text-left py-3 pr-4 text-[rgba(42,36,32,0.50)] font-medium text-[13px]">Task</th>
                <th className="py-3 px-4 text-center text-[#E8541A] font-semibold text-[13px]">Seed Music AI</th>
                <th className="py-3 px-4 text-center text-[rgba(42,36,32,0.50)] font-medium text-[13px]">Traditional studio</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["First track direction", "Prompt-led brief", "Manual briefing"],
                ["Iterate a variation", "Adjust controls", "Rewrite notes"],
                ["Change genre or mood", "Switch style inputs", "Reframe the session"],
                ["Plan export needs", "Checklist included", "Separate handoff"],
                ["No music theory needed", "Plain-language inputs", "Often technical"],
              ].map(([task, ai, trad], i) => (
                <tr key={i} className="border-b border-[rgba(42,36,32,0.06)] last:border-0">
                  <td className="py-3 pr-4 text-[#2A2420] font-medium text-[13px]">{task}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-[#1A9E8F] font-semibold text-[13px]">{ai}</span>
                  </td>
                  <td className="py-3 px-4 text-center text-[rgba(42,36,32,0.50)] text-[13px]">{trad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
