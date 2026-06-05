"use client"

import { useState, useEffect } from "react"
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

// Mini waveform illustration for card visuals
function WaveIllustration({ color, bars = 24 }: { color: string; bars?: number }) {
  return (
    <div className="flex items-end gap-[3px] h-16">
      {Array.from({ length: bars }).map((_, i) => {
        const h = Math.round(8 + Math.abs(Math.sin(i * 0.8)) * 32 + Math.abs(Math.cos(i * 0.4)) * 16)
        return (
          <div
            key={i}
            className="w-[4px] rounded-full"
            style={{ height: `${h}px`, backgroundColor: color, opacity: 0.4 + (i % 4) * 0.15 }}
          />
        )
      })}
    </div>
  )
}

// Lyric editor mockup
function LyricMockup() {
  return (
    <div className="w-full rounded-xl bg-[#F7F5F3] border border-[rgba(42,36,32,0.10)] p-4 font-sans text-[12px] leading-6 text-[#2A2420]">
      <div className="text-[rgba(42,36,32,0.40)] text-[11px] uppercase tracking-wide mb-2 font-medium">Lyrics input</div>
      <p className="text-[#2A2420] opacity-80">Verse 1:</p>
      <p className="text-[#2A2420] opacity-60 pl-3">Standing at the edge of the city lights</p>
      <p className="text-[#2A2420] opacity-60 pl-3">Watching memories fade into the night</p>
      <div className="mt-2 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#E8541A] animate-pulse" />
        <span className="text-[11px] text-[#E8541A] font-medium">Composing arrangement...</span>
      </div>
    </div>
  )
}

// Style reference mockup
function StyleReferenceMockup() {
  return (
    <div className="w-full rounded-xl bg-[#F7F5F3] border border-[rgba(42,36,32,0.10)] p-4 font-sans">
      <div className="text-[rgba(42,36,32,0.40)] text-[11px] uppercase tracking-wide mb-3 font-medium">Reference analysis</div>
      <div className="flex flex-col gap-2">
        {[
          { label: "Tempo", value: "118 BPM", pct: 62 },
          { label: "Key", value: "A Minor", pct: 45 },
          { label: "Energy", value: "Medium-High", pct: 76 },
        ].map(({ label, value, pct }) => (
          <div key={label} className="flex flex-col gap-0.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-[rgba(42,36,32,0.60)] font-medium">{label}</span>
              <span className="text-[#2A2420] font-semibold">{value}</span>
            </div>
            <div className="w-full h-1 bg-[rgba(42,36,32,0.08)] rounded-full overflow-hidden">
              <div className="h-full bg-[#1A9E8F] rounded-full" style={{ width: `${pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const CARDS = [
  {
    title: "Prompt to music",
    description:
      "Describe any sound in plain language: mood, genre, instruments, tempo, and scene. Seed Music turns those details into a structured music brief.",
    visual: <WaveIllustration color="#E8541A" bars={28} />,
    tag: "Text → Audio",
    tagColor: "#E8541A",
  },
  {
    title: "Lyric to song",
    description:
      "Paste your own lyrics, pick a genre and vocal style, and plan melody, chord, and production directions around your words.",
    visual: <LyricMockup />,
    tag: "Lyrics → Full track",
    tagColor: "#1A9E8F",
  },
  {
    title: "Style & reference control",
    description:
      "Describe or attach reference notes to guide tempo, key, energy, and production texture without claiming to copy the source material.",
    visual: <StyleReferenceMockup />,
    tag: "Audio reference",
    tagColor: "#2A2420",
  },
]

export default function DocumentationSection() {
  const [activeCard, setActiveCard] = useState(0)
  const [animationKey, setAnimationKey] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % CARDS.length)
      setAnimationKey((prev) => prev + 1)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleCardClick = (index: number) => {
    setActiveCard(index)
    setAnimationKey((prev) => prev + 1)
  }

  return (
    <div className="w-full border-b border-[rgba(42,36,32,0.10)] flex flex-col justify-center items-center">
      {/* Header */}
      <div className="self-stretch px-6 md:px-24 py-12 md:py-16 border-b border-[rgba(42,36,32,0.10)] flex justify-center items-center gap-6">
        <div className="w-full max-w-[586px] px-6 py-5 overflow-hidden rounded-lg flex flex-col justify-start items-center gap-4">
          <Badge
            icon={
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="5" stroke="#2A2420" strokeWidth="1.2" fill="none" />
                <path d="M4 6h4M6 4v4" stroke="#2A2420" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            }
            text="Core workflows"
          />
          <div className="self-stretch text-center text-[#2A2420] text-3xl md:text-5xl font-semibold leading-tight md:leading-[60px] font-sans tracking-tight text-balance">
            Every music idea, one studio preview
          </div>
          <div className="self-stretch text-center text-[#857870] text-base font-normal leading-7 font-sans">
            From a single sentence to a track brief, Seed Music helps organize prompts, lyrics, references, and style choices before final production.
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="self-stretch px-4 md:px-9 overflow-hidden flex justify-start items-center">
        <div className="flex-1 py-8 md:py-11 flex flex-col md:flex-row justify-start items-center gap-6 md:gap-12">
          {/* Left: cards */}
          <div className="w-full md:w-auto md:max-w-[400px] flex flex-col justify-center items-center gap-3 order-2 md:order-1">
            {CARDS.map((card, index) => {
              const isActive = index === activeCard
              return (
                <div
                  key={index}
                  onClick={() => handleCardClick(index)}
                  className={`w-full overflow-hidden flex flex-col justify-start items-start transition-all duration-300 cursor-pointer rounded-xl ${
                    isActive
                      ? "bg-white shadow-[0px_0px_0px_1px_rgba(42,36,32,0.10),0px_4px_16px_rgba(42,36,32,0.06)]"
                      : "border border-[rgba(42,36,32,0.08)] hover:border-[rgba(42,36,32,0.16)]"
                  }`}
                >
                  <div className={`w-full h-0.5 bg-[rgba(42,36,32,0.06)] overflow-hidden ${isActive ? "opacity-100" : "opacity-0"}`}>
                    <div
                      key={animationKey}
                      className="h-0.5 animate-[progressBar_5s_linear_forwards] will-change-transform"
                      style={{ backgroundColor: card.tagColor }}
                    />
                  </div>
                  <div className="px-5 py-4 w-full flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2 py-0.5 text-[10px] font-semibold rounded-full font-sans"
                        style={{
                          backgroundColor: `${card.tagColor}18`,
                          color: card.tagColor,
                        }}
                      >
                        {card.tag}
                      </span>
                    </div>
                    <div className="text-[#2A2420] text-sm font-semibold leading-6 font-sans">{card.title}</div>
                    <div className="text-[#857870] text-[13px] font-normal leading-[22px] font-sans">{card.description}</div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right: visual */}
          <div className="w-full md:flex-1 rounded-2xl overflow-hidden flex flex-col justify-center items-center order-1 md:order-2">
            <div className="w-full md:w-full h-[280px] md:h-[420px] bg-white shadow-[0px_0px_0px_1px_rgba(42,36,32,0.08)] overflow-hidden rounded-2xl flex flex-col justify-center items-center p-6 gap-6 transition-all duration-500">
              <div
                className="w-full"
                style={{
                  opacity: 1,
                  transition: "opacity 0.4s ease",
                }}
              >
                {CARDS[activeCard].visual}
              </div>
              <div className="w-full">
                <div className="text-[#2A2420] text-base font-semibold font-sans mb-1">{CARDS[activeCard].title}</div>
                <div className="text-[#857870] text-[13px] font-normal leading-5 font-sans">{CARDS[activeCard].description}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progressBar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0%); }
        }
      `}</style>
    </div>
  )
}
