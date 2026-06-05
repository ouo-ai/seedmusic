"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import DocumentationSection from "../components/documentation-section"
import TestimonialsSection from "../components/testimonials-section"
import FAQSection from "../components/faq-section"
import PricingSection from "../components/pricing-section"
import CTASection from "../components/cta-section"
import FooterSection from "../components/footer-section"
import { StudioTeaser } from "../components/studio-teaser"
import WorkflowSection from "../components/workflow-section"
import UseCasesSection from "../components/use-cases-section"

// Reusable Badge
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

// Feature card below hero
function FeatureCard({
  title,
  description,
  isActive,
  progress,
  onClick,
}: {
  title: string
  description: string
  isActive: boolean
  progress: number
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 px-5 py-5 md:py-6 flex flex-col gap-2 text-left border-b md:border-b-0 md:border-r border-[rgba(42,36,32,0.10)] last:border-0 transition-colors duration-200 ${
        isActive ? "bg-white" : "hover:bg-[rgba(42,36,32,0.02)]"
      }`}
    >
      {/* Progress bar */}
      <div className="w-full h-[2px] bg-[rgba(42,36,32,0.08)] rounded-full overflow-hidden mb-1">
        <div
          className="h-full bg-[#E8541A] rounded-full transition-none"
          style={{ width: isActive ? `${progress}%` : "0%" }}
        />
      </div>
      <div className="text-[#2A2420] text-sm font-semibold leading-5 font-sans">{title}</div>
      <div className="text-[#857870] text-[13px] font-normal leading-[20px] font-sans">{description}</div>
    </button>
  )
}

const HERO_CARDS = [
  {
    title: "Prompt to music",
    description: "Describe the vibe in plain text and shape a track-ready brief.",
  },
  {
    title: "Lyric to song",
    description: "Paste lyrics, choose a style, and preview arrangement directions.",
  },
  {
    title: "Reference & refine",
    description: "Use reference audio notes to guide tempo, mood, and production style.",
  },
]

// Animated waveform bars
function Waveform({ isPlaying }: { isPlaying: boolean }) {
  const bars = Array.from({ length: 32 })
  return (
    <div className="flex items-end gap-[2px] h-8">
      {bars.map((_, i) => {
        const baseH = 8 + ((i * 7 + 3) % 20)
        return (
          <div
            key={i}
            className="w-[3px] rounded-full bg-[#1A9E8F] transition-all duration-300"
            style={{
              height: isPlaying ? `${Math.round(baseH + Math.sin(i * 0.7) * 8 + 8)}px` : `${6 + (i % 4) * 2}px`,
              opacity: isPlaying ? 0.7 + (i % 3) * 0.1 : 0.3,
              animationDelay: `${i * 40}ms`,
            }}
          />
        )
      })}
    </div>
  )
}

// Mock generated track row
function TrackRow({
  title,
  genre,
  duration,
  isPlaying,
  onToggle,
}: {
  title: string
  genre: string
  duration: string
  isPlaying: boolean
  onToggle: () => void
}) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${
        isPlaying ? "bg-[rgba(26,158,143,0.08)] border border-[rgba(26,158,143,0.20)]" : "hover:bg-[rgba(42,36,32,0.04)] border border-transparent"
      }`}
      onClick={onToggle}
    >
      <button
        aria-label={isPlaying ? `Pause ${title}` : `Play ${title}`}
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
          isPlaying ? "bg-[#E8541A]" : "bg-[rgba(42,36,32,0.08)] hover:bg-[rgba(42,36,32,0.14)]"
        }`}
      >
        {isPlaying ? (
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
      <div className="flex-1 min-w-0">
        <div className="text-[#2A2420] text-[13px] font-medium leading-[18px] font-sans truncate">{title}</div>
        <div className="text-[#857870] text-[11px] font-normal leading-4 font-sans">{genre}</div>
      </div>
      {isPlaying ? (
        <Waveform isPlaying={isPlaying} />
      ) : (
        <div className="text-[#857870] text-[11px] font-mono">{duration}</div>
      )}
    </div>
  )
}

const MOCK_TRACKS = [
  { title: "Midnight City Drive", genre: "Synthwave · Instrumental", duration: "2:47" },
  { title: "Golden Hour (Verse 1)", genre: "Pop · Vocals · Female", duration: "3:12" },
  { title: "Hollow Ground", genre: "Indie Folk · Acoustic Guitar", duration: "2:58" },
]

// Social proof stat cards
function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex-1 min-w-[140px] px-6 py-5 flex flex-col gap-1 border-r border-[rgba(42,36,32,0.10)] last:border-0">
      <div className="text-[#2A2420] text-3xl md:text-4xl font-semibold font-serif leading-tight">{value}</div>
      <div className="text-[#857870] text-sm font-normal leading-5 font-sans">{label}</div>
    </div>
  )
}

export default function LandingPage() {
  const [activeCard, setActiveCard] = useState(0)
  const [progress, setProgress] = useState(0)
  const [playingTrack, setPlayingTrack] = useState<number | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    const interval = setInterval(() => {
      if (!mountedRef.current) return
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveCard((c) => (c + 1) % HERO_CARDS.length)
          return 0
        }
        return prev + 2
      })
    }, 100)
    return () => {
      clearInterval(interval)
      mountedRef.current = false
    }
  }, [])

  const handleCardClick = (index: number) => {
    setActiveCard(index)
    setProgress(0)
  }

  const toggleTrack = (idx: number) => {
    setPlayingTrack((prev) => (prev === idx ? null : idx))
  }

  return (
    <div className="w-full min-h-screen relative bg-[#F7F5F3] overflow-x-hidden flex flex-col justify-start items-center">
      <div className="relative flex flex-col justify-start items-center w-full">
        <div className="w-full max-w-none px-4 sm:px-6 md:px-8 lg:px-0 lg:max-w-[1060px] lg:w-[1060px] relative flex flex-col justify-start items-start">
          {/* Vertical guide lines */}
          <div className="w-[1px] h-full absolute left-4 sm:left-6 md:left-8 lg:left-0 top-0 bg-[rgba(42,36,32,0.10)] shadow-[1px_0px_0px_white] z-0" />
          <div className="w-[1px] h-full absolute right-4 sm:right-6 md:right-8 lg:right-0 top-0 bg-[rgba(42,36,32,0.10)] shadow-[1px_0px_0px_white] z-0" />

          <div className="self-stretch pt-[9px] overflow-hidden border-b border-[rgba(42,36,32,0.08)] flex flex-col justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-[66px] relative z-10">

            {/* ── NAV ─────────────────────────────────── */}
            <div className="w-full h-12 sm:h-14 md:h-16 lg:h-[84px] absolute left-0 top-0 flex justify-center items-center z-20 px-6 sm:px-8 md:px-12 lg:px-0">
              <div className="w-full h-0 absolute left-0 top-6 sm:top-7 md:top-8 lg:top-[42px] border-t border-[rgba(42,36,32,0.10)] shadow-[0px_1px_0px_white]" />
              <div className="w-full max-w-[calc(100%-32px)] sm:max-w-[calc(100%-48px)] md:max-w-[calc(100%-64px)] lg:max-w-[700px] lg:w-[700px] h-10 sm:h-11 md:h-12 py-1.5 sm:py-2 px-3 sm:px-4 pr-2 sm:pr-3 bg-[#F7F5F3] backdrop-blur-sm shadow-[0px_0px_0px_2px_white] overflow-hidden rounded-[50px] flex justify-between items-center relative z-30">
                <div className="flex justify-center items-center gap-1">
                  {/* SeedMusic logotype */}
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <circle cx="9" cy="9" r="8" fill="#2A2420" />
                    <circle cx="9" cy="9" r="3" fill="#E8541A" />
                    <rect x="8.3" y="1" width="1.4" height="4" rx="0.7" fill="#2A2420" />
                    <rect x="8.3" y="13" width="1.4" height="4" rx="0.7" fill="#2A2420" />
                    <rect x="1" y="8.3" width="4" height="1.4" rx="0.7" fill="#2A2420" />
                    <rect x="13" y="8.3" width="4" height="1.4" rx="0.7" fill="#2A2420" />
                  </svg>
                  <div className="flex flex-col justify-center text-[#2A2420] text-sm sm:text-base md:text-lg font-semibold leading-5 font-sans ml-1">
                    SeedMusic
                  </div>
                  <div className="pl-4 sm:pl-5 hidden sm:flex flex-row gap-3 md:gap-4 items-center">
                    {["Features", "Pricing", "FAQ"].map((item) => (
                      <div
                        key={item}
                        className="flex flex-col justify-center text-[rgba(42,36,32,0.70)] text-xs md:text-[13px] font-medium leading-[14px] font-sans cursor-pointer hover:text-[#2A2420] transition-colors"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-3 md:px-[14px] py-1 sm:py-[6px] bg-white shadow-[0px_1px_2px_rgba(42,36,32,0.12)] overflow-hidden rounded-full flex justify-center items-center cursor-pointer">
                    <div className="text-[#2A2420] text-xs md:text-[13px] font-medium leading-5 font-sans">Sign in</div>
                  </div>
                  <div className="px-3 md:px-[14px] py-1 sm:py-[6px] bg-[#2A2420] shadow-[0px_0px_0px_2px_rgba(255,255,255,0.10)_inset] overflow-hidden rounded-full flex justify-center items-center cursor-pointer">
                    <div className="text-white text-xs md:text-[13px] font-medium leading-5 font-sans whitespace-nowrap">Preview</div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── HERO ─────────────────────────────────── */}
            <div className="pt-16 sm:pt-20 md:pt-24 lg:pt-[216px] pb-8 sm:pb-12 md:pb-16 flex flex-col justify-start items-center px-2 sm:px-4 md:px-8 lg:px-0 w-full">
              <div className="w-full max-w-[860px] flex flex-col justify-center items-center gap-4 md:gap-6">

                {/* Badge */}
                <Badge
                  icon={
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <circle cx="6" cy="6" r="2.5" fill="#E8541A" />
                      <circle cx="6" cy="6" r="5" stroke="#E8541A" strokeWidth="1" fill="none" />
                    </svg>
                  }
                  text="AI Music Generator"
                />

                {/* H1 */}
                <h1 className="w-full max-w-[860px] text-center text-[#2A2420] text-[26px] xs:text-[32px] sm:text-[44px] md:text-[60px] lg:text-[76px] font-normal leading-[1.1] font-serif text-balance px-2 sm:px-4 md:px-0">
                  Seed Music turns prompts<br className="hidden sm:block" /> into track-ready drafts
                </h1>

                {/* Subheading */}
                <p className="w-full max-w-[520px] text-center text-[rgba(42,36,32,0.70)] text-sm sm:text-base md:text-lg leading-relaxed font-sans font-normal text-pretty px-4 md:px-0">
                  Seed Music shows a polished AI music workflow for prompts, lyrics, and style references. Seed-Music and seedmusic creators can use it to shape track-ready briefs.
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap justify-center items-center gap-3 mt-2">
                  <Link href="/studio" className="h-10 sm:h-11 px-7 sm:px-9 py-2 bg-[#2A2420] shadow-[0px_0px_0px_2.5px_rgba(255,255,255,0.08)_inset] overflow-hidden rounded-full flex justify-center items-center cursor-pointer hover:bg-[#1a1512] transition-colors">
                    <span className="text-white text-sm font-medium leading-5 font-sans">Open studio preview</span>
                  </Link>
                  <div className="h-10 sm:h-11 px-7 sm:px-9 py-2 bg-white border border-[rgba(42,36,32,0.14)] shadow-[0px_1px_2px_rgba(42,36,32,0.06)] overflow-hidden rounded-full flex justify-center items-center cursor-pointer hover:bg-[#f0ede9] transition-colors">
                    <span className="text-[#2A2420] text-sm font-medium leading-5 font-sans">See prompt examples</span>
                  </div>
                </div>
              </div>

              {/* ── MUSIC PROMPT COMPOSER ──────────────── */}
              <div className="w-full max-w-[960px] mt-10 sm:mt-14 md:mt-16 px-2 sm:px-4 md:px-0 relative z-10">
                <div className="w-full bg-white border border-[rgba(42,36,32,0.10)] shadow-[0px_1px_3px_rgba(42,36,32,0.08),0px_8px_32px_rgba(42,36,32,0.06)] rounded-2xl overflow-hidden">
                  <StudioTeaser />
                </div>
              </div>

              {/* Decorative pattern behind composer */}
              <div className="absolute top-[232px] sm:top-[248px] md:top-[264px] lg:top-[320px] left-1/2 transform -translate-x-1/2 z-0 pointer-events-none">
                <img
                  src="/mask-group-pattern.svg"
                  alt=""
                  className="w-[936px] sm:w-[1404px] md:w-[2106px] lg:w-[2808px] h-auto opacity-20"
                  style={{ filter: "hue-rotate(160deg) saturate(0.4) brightness(1.4)" }}
                />
              </div>

              {/* ── FEATURE CARDS ─────────────────────── */}
              <div className="self-stretch border-t border-[#E0DEDB] border-b border-[#E0DEDB] mt-10 flex justify-center items-start">
                <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
                  <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
                    {Array.from({ length: 50 }).map((_, i) => (
                      <div key={i} className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(42,36,32,0.07)] outline-offset-[-0.25px]" />
                    ))}
                  </div>
                </div>
                <div className="flex-1 flex flex-col md:flex-row justify-center items-stretch gap-0">
                  {HERO_CARDS.map((card, i) => (
                    <FeatureCard
                      key={i}
                      title={card.title}
                      description={card.description}
                      isActive={activeCard === i}
                      progress={activeCard === i ? progress : 0}
                      onClick={() => handleCardClick(i)}
                    />
                  ))}
                </div>
                <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
                  <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
                    {Array.from({ length: 50 }).map((_, i) => (
                      <div key={i} className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(42,36,32,0.07)] outline-offset-[-0.25px]" />
                    ))}
                  </div>
                </div>
              </div>

              {/* ── SOCIAL PROOF STATS ──────────────────── */}
              <div className="w-full border-b border-[rgba(42,36,32,0.10)]">
                <div className="self-stretch px-4 sm:px-6 md:px-24 py-8 sm:py-12 border-b border-[rgba(42,36,32,0.10)] flex justify-center items-center">
                  <div className="w-full max-w-[580px] flex flex-col justify-start items-center gap-3 text-center">
                    <Badge
                      icon={
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M6 1l1.4 2.8 3.1.45-2.25 2.2.53 3.1L6 8.1l-2.78 1.46.53-3.1L1.5 4.25l3.1-.45z" fill="#E8541A" />
                        </svg>
                      }
                      text="Designed for creators"
                    />
                    <div className="text-[#2A2420] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight font-sans tracking-tight">
                      Music briefs shaped for creators
                    </div>
                    <div className="text-[#857870] text-sm sm:text-base font-normal leading-6 font-sans">
                      Seed Music AI helps solo producers, brand studios, and content teams map a music idea into prompts, arrangements, and review-ready track directions.
                    </div>
                  </div>
                </div>

                {/* Stat strip */}
                <div className="self-stretch border-t border-[rgba(42,36,32,0.10)] flex justify-center items-start">
                  <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
                    <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
                      {Array.from({ length: 50 }).map((_, i) => (
                        <div key={i} className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(42,36,32,0.07)] outline-offset-[-0.25px]" />
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 flex flex-wrap border-l border-r border-[rgba(42,36,32,0.10)]">
                    <StatCard value="Prompt" label="plain-language song briefs" />
                    <StatCard value="Lyrics" label="verse and hook direction" />
                    <StatCard value="Reference" label="tempo, mood, and texture notes" />
                    <StatCard value="Refine" label="variation and export planning" />
                  </div>

                  <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
                    <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
                      {Array.from({ length: 50 }).map((_, i) => (
                        <div key={i} className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(42,36,32,0.07)] outline-offset-[-0.25px]" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ── DOWNSTREAM SECTIONS ─────────────────── */}
          <div className="self-stretch flex flex-col">
            <DocumentationSection />
            <WorkflowSection />
            <UseCasesSection />
            <TestimonialsSection />
            <PricingSection />
            <FAQSection />
            <CTASection />
            <FooterSection />
          </div>
        </div>
      </div>
    </div>
  )
}
