"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const MODES = [
  { id: "song", label: "Song", placeholder: "Describe the style, scene and mood you want and let AI compose…" },
  { id: "sounds", label: "Sounds / Loop", placeholder: "Describe a sound effect or a seamless loop to generate…" },
  { id: "from-audio", label: "From Audio", placeholder: "Upload your audio to cover, extend, add backing or mash up…" },
] as const

const BARS = Array.from({ length: 36 })

export function StudioTeaser() {
  const [mode, setMode] = useState<(typeof MODES)[number]["id"]>("song")
  const active = MODES.find((item) => item.id === mode) ?? MODES[0]

  return (
    <div className="flex flex-col gap-5 p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="7" stroke="#2A2420" strokeWidth="1.2" />
            <circle cx="8" cy="8" r="2.5" fill="#E8541A" />
          </svg>
          <span className="font-sans text-sm font-semibold text-[#2A2420]">SeedMusic Studio</span>
          <span className="rounded-full bg-[rgba(26,158,143,0.10)] px-2 py-0.5 font-sans text-[11px] font-medium text-[#1A9E8F]">Live</span>
        </div>
        <span className="hidden font-sans text-xs text-[#857870] sm:inline">Songs · Sounds · Cover · Extend · Stems · Voices · 20+ tools</span>
      </div>

      <div className="flex max-w-sm gap-1 rounded-xl bg-[#F0EDE9] p-1">
        {MODES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setMode(item.id)}
            aria-pressed={mode === item.id}
            className={`flex-1 rounded-lg py-1.5 text-center font-sans text-[12px] font-medium transition-colors ${
              mode === item.id ? "bg-white text-[#2A2420] shadow-sm" : "text-[#857870] hover:text-[#2A2420]"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-[rgba(42,36,32,0.14)] bg-[#FAFAF9] px-4 py-3 font-sans text-sm text-[rgba(42,36,32,0.40)]">
        {active.placeholder}
      </div>

      <div className="flex h-10 items-end gap-[3px]" aria-hidden="true">
        {BARS.map((_, i) => {
          const seed = Math.sin(i * 1.3) * 0.5 + 0.5
          const height = 6 + Math.round(seed * 26)
          return (
            <div
              key={i}
              className="w-[3px] rounded-full"
              style={{
                height: `${height}px`,
                backgroundColor: i % 3 === 0 ? "#E8541A" : i % 3 === 1 ? "#1A9E8F" : "#2A2420",
                opacity: 0.28,
              }}
            />
          )
        })}
      </div>

      <Link
        href={`/studio?mode=${mode}`}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#2A2420] font-sans text-sm font-medium text-white shadow-[0px_2px_8px_rgba(42,36,32,0.18)] transition-colors hover:bg-[#1a1512]"
      >
        Open Studio
        <ArrowRight className="size-4" />
      </Link>
    </div>
  )
}
