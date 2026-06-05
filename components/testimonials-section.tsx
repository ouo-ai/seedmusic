"use client"

import { useState, useEffect } from "react"
import type React from "react"

function Badge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="px-[14px] py-[6px] bg-white shadow-[0px_0px_0px_4px_rgba(42,36,32,0.05)] overflow-hidden rounded-[90px] flex justify-start items-center gap-[8px] border border-[rgba(42,36,32,0.10)]">
      <div className="w-[14px] h-[14px] relative overflow-hidden flex items-center justify-center">{icon}</div>
      <div className="text-center flex justify-center flex-col text-[#2A2420] text-xs font-medium leading-3 font-sans">{text}</div>
    </div>
  )
}

function ScenarioMark({ count = 5 }: { count?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill="#E8541A">
          <path d="M7 1l1.6 3.2 3.5.5-2.55 2.5.6 3.5L7 9.1l-3.15 1.6.6-3.5L2 4.7l3.5-.5z" />
        </svg>
      ))}
    </div>
  )
}

const TESTIMONIALS = [
  {
    quote:
      "A product video team can turn a short creative brief into a structured music direction with mood, tempo, instrumentation, and reference notes.",
    name: "Video production",
    role: "Background tracks for launch edits",
    avatar: "VP",
    color: "#E8541A",
  },
  {
    quote:
      "A brand studio can compare several sonic directions before involving a composer, producer, or final generation provider.",
    name: "Brand studio",
    role: "Campaign music direction",
    avatar: "BS",
    color: "#1A9E8F",
  },
  {
    quote:
      "A songwriter can paste a verse, pick a style, and organize melody, vocal, and arrangement notes before production.",
    name: "Songwriter",
    role: "Lyric-to-song planning",
    avatar: "SW",
    color: "#2A2420",
  },
]

export default function TestimonialsSection() {
  const [active, setActive] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setActive((prev) => (prev + 1) % TESTIMONIALS.length)
        setFading(false)
      }, 300)
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  const navigate = (idx: number) => {
    setFading(true)
    setTimeout(() => {
      setActive(idx)
      setFading(false)
    }, 200)
  }

  const t = TESTIMONIALS[active]

  return (
    <div className="w-full border-b border-[rgba(42,36,32,0.10)] flex flex-col justify-center items-center">
      {/* Header */}
      <div className="self-stretch px-6 md:px-24 py-12 md:py-16 border-b border-[rgba(42,36,32,0.10)] flex justify-center items-center">
        <div className="w-full max-w-[586px] flex flex-col items-center gap-4 text-center">
          <Badge
            icon={
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1l1.4 2.8 3.1.45-2.25 2.2.53 3.1L6 8.1l-2.78 1.46.53-3.1L1.5 4.25l3.1-.45z" fill="#E8541A" />
              </svg>
            }
            text="Workflow scenarios"
          />
          <div className="text-[#2A2420] text-3xl md:text-5xl font-semibold leading-tight md:leading-[60px] font-sans tracking-tight text-balance">
            Where Seed Music fits
          </div>
          <div className="text-[#857870] text-base font-normal leading-7 font-sans">
            Practical AI music workflows for creators, marketers, and music teams.
          </div>
        </div>
      </div>

      {/* Testimonial */}
      <div className="self-stretch px-4 md:px-12 overflow-hidden flex justify-start items-center bg-[#F7F5F3] border-b border-[rgba(42,36,32,0.10)]">
        <div className="flex-1 py-12 md:py-16 flex flex-col md:flex-row justify-center items-start gap-8 md:gap-12">
          {/* Avatar */}
          <div
            className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center flex-shrink-0 text-white text-xl font-bold font-sans transition-all duration-500"
            style={{
              backgroundColor: t.color,
              opacity: fading ? 0 : 1,
              transform: fading ? "scale(0.95)" : "scale(1)",
            }}
          >
            {t.avatar}
          </div>

          {/* Content */}
          <div
            className="flex-1 flex flex-col gap-4 transition-all duration-500"
            style={{ opacity: fading ? 0 : 1, filter: fading ? "blur(4px)" : "blur(0px)" }}
          >
            <ScenarioMark />
            <p className="text-[#2A2420] text-xl md:text-2xl lg:text-[28px] font-normal leading-[1.45] font-serif text-balance">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div>
              <div className="text-[#2A2420] text-base font-semibold leading-6 font-sans">{t.name}</div>
              <div className="text-[#857870] text-sm font-normal leading-5 font-sans">{t.role}</div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex md:flex-col justify-start items-center gap-3 pt-1">
            <button
              onClick={() => navigate((active - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
              className="w-9 h-9 shadow-[0px_1px_2px_rgba(42,36,32,0.10)] overflow-hidden rounded-full border border-[rgba(42,36,32,0.14)] flex justify-center items-center hover:bg-white transition-colors"
              aria-label="Previous testimonial"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8l4-4" stroke="#2A2420" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="flex md:flex-col gap-1.5">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => navigate(i)}
                  className="rounded-full transition-all"
                  style={{
                    width: active === i ? "20px" : "6px",
                    height: "6px",
                    backgroundColor: active === i ? "#E8541A" : "rgba(42,36,32,0.20)",
                  }}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => navigate((active + 1) % TESTIMONIALS.length)}
              className="w-9 h-9 shadow-[0px_1px_2px_rgba(42,36,32,0.10)] overflow-hidden rounded-full border border-[rgba(42,36,32,0.14)] flex justify-center items-center hover:bg-white transition-colors"
              aria-label="Next testimonial"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 12l4-4-4-4" stroke="#2A2420" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
