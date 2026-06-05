"use client"

import { useState } from "react"

interface FAQItem {
  question: string
  answer: string
}

const FAQ_DATA: FAQItem[] = [
  {
    question: "What is Seed Music and how does it work?",
    answer:
      "Seed Music is an AI music generator landing page with a server-side Kie.ai Suno API integration for prompt-to-song, lyric-to-song, audio upload, voice, stems, MIDI, WAV, and music video workflows.",
  },
  {
    question: "Are Seed Music, Seed-Music, and seedmusic different?",
    answer:
      "No. Seed Music is the primary keyword for this page, while Seed-Music and seedmusic are alternate spellings people may use when searching for the same AI music workflow preview.",
  },
  {
    question: "Can I use Seed Music for commercial projects?",
    answer:
      "Commercial use depends on the generation provider and license terms connected to the final product. Review those terms before using any generated track commercially.",
  },
  {
    question: "What is lyric-to-song mode?",
    answer:
      "Lyric-to-song mode lets you paste written lyrics and plan melody, chord, instrumentation, and vocal directions around them. It is useful for turning a draft hook or verse into a clearer production brief.",
  },
  {
    question: "What does audio reference input do?",
    answer:
      "Audio reference input is presented as a way to document tempo, key, energy, and tonal texture. A final integration should respect the source file and the connected provider's rights policy.",
  },
  {
    question: "What audio formats can I download?",
    answer:
      "Seed Music exposes Kie.ai Suno workflows for generated tracks, WAV conversion, stem separation, MIDI generation, and music video creation. Availability depends on the selected workflow, task status, provider credits, and provider terms.",
  },
  {
    question: "How long does it take to generate a track?",
    answer:
      "Generation time varies by provider, model, duration, queue load, and quality settings. This page does not promise a fixed generation time.",
  },
  {
    question: "Is there a free plan?",
    answer:
      "The public page exposes a studio interface backed by a server-side API key. Final user limits, credits, and billing should follow the Kie.ai account configuration and any product policy you apply.",
  },
  {
    question: "Does Seed Music claim to be an official product?",
    answer:
      "No. Seed Music is an independent AI music generation landing page. It is not an official product of, nor affiliated with, ByteDance, the Seed research team, or any other company unless explicitly stated.",
  },
]

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function FAQSection() {
  const [open, setOpen] = useState<number[]>([])

  const toggle = (i: number) => setOpen((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]))

  return (
    <div className="w-full flex justify-center items-start border-b border-[rgba(42,36,32,0.10)]">
      <div className="flex-1 px-4 md:px-12 py-16 md:py-20 flex flex-col lg:flex-row justify-start items-start gap-6 lg:gap-12">
        {/* Left */}
        <div className="w-full lg:max-w-[320px] flex flex-col justify-center items-start gap-4 lg:py-5 lg:sticky lg:top-8">
          <div className="text-[#2A2420] text-3xl md:text-4xl font-semibold leading-tight font-sans tracking-tight text-balance">
            Frequently asked questions
          </div>
          <div className="text-[#857870] text-base font-normal leading-7 font-sans">
            More questions? Reach us at{" "}
            <span className="text-[#E8541A] font-medium">support@seed.music</span>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-1.5 text-sm text-[#2A2420] font-medium font-sans hover:text-[#E8541A] transition-colors"
          >
            Read full documentation
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2.5 7h9M8 3.5l3.5 3.5L8 10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        {/* Right */}
        <div className="w-full lg:flex-1 flex flex-col">
          {FAQ_DATA.map((item, i) => {
            const isOpen = open.includes(i)
            return (
              <div key={i} className="w-full border-b border-[rgba(42,36,32,0.10)] overflow-hidden">
                <button
                  onClick={() => toggle(i)}
                  className="w-full px-4 py-[18px] flex justify-between items-center gap-4 text-left hover:bg-[rgba(42,36,32,0.02)] transition-colors"
                  aria-expanded={isOpen}
                >
                  <div className="flex-1 text-[#2A2420] text-sm font-medium leading-6 font-sans">{item.question}</div>
                  <ChevronDown className={`w-5 h-5 text-[rgba(42,36,32,0.50)] flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                  <div className="px-4 pb-[18px] text-[#857870] text-sm font-normal leading-6 font-sans">{item.answer}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
