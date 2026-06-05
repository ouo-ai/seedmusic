"use client"

import { useState } from "react"

function CheckIcon({ color }: { color: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M10 3L4.5 8.5L2 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function PricingSection() {
  const [billing, setBilling] = useState<"monthly" | "annually">("annually")

  const pricing = {
    free: { monthly: 0, annually: 0 },
    creator: { monthly: 18, annually: 14 },
    studio: { monthly: 49, annually: 39 },
  }

  return (
    <div className="w-full flex flex-col justify-center items-center gap-2">
      {/* Header */}
      <div className="self-stretch px-6 md:px-24 py-12 md:py-16 border-b border-[rgba(42,36,32,0.10)] flex justify-center items-center gap-6">
        <div className="w-full max-w-[586px] px-6 py-5 overflow-hidden rounded-lg flex flex-col justify-start items-center gap-4">
          <div className="px-[14px] py-[6px] bg-white shadow-[0px_0px_0px_4px_rgba(42,36,32,0.05)] overflow-hidden rounded-[90px] flex justify-start items-center gap-[8px] border border-[rgba(42,36,32,0.10)]">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1V11M8.5 3H4.75C4.286 3 3.841 3.184 3.513 3.513C3.184 3.841 3 4.286 3 4.75C3 5.214 3.184 5.659 3.513 5.987C3.841 6.316 4.286 6.5 4.75 6.5H7.25C7.714 6.5 8.159 6.684 8.487 7.013C8.816 7.341 9 7.786 9 8.25C9 8.714 8.816 9.159 8.487 9.487C8.159 9.816 7.714 10 7.25 10H3.5" stroke="#2A2420" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="text-[#2A2420] text-xs font-medium leading-3 font-sans">Plans & Pricing</div>
          </div>
          <div className="self-stretch text-center text-[#2A2420] text-3xl md:text-5xl font-semibold leading-tight md:leading-[60px] font-sans tracking-tight text-balance">
            Simple, transparent pricing
          </div>
          <div className="self-stretch text-center text-[#857870] text-base font-normal leading-7 font-sans">
            Explore the Seed Music studio now. Usage limits, credits, and rights should match your account and product terms.
          </div>
        </div>
      </div>

      {/* Toggle */}
      <div className="self-stretch px-6 md:px-16 py-9 relative flex justify-center items-center gap-4">
        <div className="w-full max-w-[1060px] h-0 absolute left-1/2 transform -translate-x-1/2 top-[63px] border-t border-[rgba(42,36,32,0.10)] z-0" />
        <div className="p-3 relative bg-[rgba(42,36,32,0.03)] border border-[rgba(42,36,32,0.05)] flex justify-center items-center rounded-lg z-20 before:absolute before:inset-0 before:bg-white before:opacity-60 before:rounded-lg before:-z-10">
          <div className="p-[2px] bg-[rgba(42,36,32,0.10)] shadow-[0px_1px_0px_white] rounded-[99px] border-[0.5px] border-[rgba(42,36,32,0.08)] flex justify-center items-center gap-[2px] relative">
            <div
              className={`absolute top-[2px] w-[calc(50%-1px)] h-[calc(100%-4px)] bg-white shadow-[0px_2px_4px_rgba(0,0,0,0.08)] rounded-[99px] transition-all duration-300 ease-in-out ${
                billing === "annually" ? "left-[2px]" : "right-[2px]"
              }`}
            />
            {(["annually", "monthly"] as const).map((period) => (
              <button
                key={period}
                onClick={() => setBilling(period)}
                className="px-4 py-1 rounded-[99px] flex justify-center items-center gap-2 transition-colors duration-300 relative z-10 flex-1"
              >
                <div className={`text-[13px] font-medium leading-5 font-sans transition-colors duration-300 flex items-center gap-1.5 ${billing === period ? "text-[#2A2420]" : "text-[#6B7280]"}`}>
                  {period === "annually" ? "Annually" : "Monthly"}
                  {period === "annually" && (
                    <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-[rgba(232,84,26,0.12)] text-[#E8541A] rounded-full">
                      Save 20%
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
          {[["5px", "5.25px"], ["right-[5px]", "5.25px"], ["5px", "bottom-[5.25px]"], ["right-[5px]", "bottom-[5.25px]"]].map((_, i) => (
            <div key={i} className={`w-[3px] h-[3px] absolute bg-[rgba(42,36,32,0.10)] rounded-[99px] ${i === 0 ? "left-[5px] top-[5.25px]" : i === 1 ? "right-[5px] top-[5.25px]" : i === 2 ? "left-[5px] bottom-[5.25px]" : "right-[5px] bottom-[5.25px]"}`} />
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="self-stretch border-b border-t border-[rgba(42,36,32,0.10)] flex justify-center items-center">
        <div className="flex justify-center items-start w-full">
          <div className="w-12 self-stretch relative overflow-hidden hidden md:block">
            <div className="w-[162px] left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
              {Array.from({ length: 200 }).map((_, i) => (
                <div key={i} className="self-stretch h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(42,36,32,0.06)] outline-offset-[-0.25px]" />
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col md:flex-row justify-center items-stretch gap-0">
            {/* Free */}
            <div className="flex-1 self-stretch px-6 py-5 border border-[rgba(42,36,32,0.10)] overflow-hidden flex flex-col justify-start items-start gap-10 bg-[rgba(255,255,255,0)]">
              <div className="self-stretch flex flex-col gap-8">
                <div className="flex flex-col gap-1.5">
                  <div className="text-[#2A2420] text-lg font-semibold leading-7 font-sans">Free</div>
                  <div className="text-[rgba(42,36,32,0.60)] text-sm font-normal leading-5 font-sans max-w-[240px]">
                    Explore Seed Music AI workflows through the live studio.
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-[#2A2420] text-5xl font-medium leading-[60px] font-serif">$0</div>
                  <div className="text-[#857870] text-sm font-medium font-sans">forever free</div>
                </div>
                <div className="self-stretch px-4 py-[10px] relative bg-[#2A2420] shadow-[0px_2px_4px_rgba(42,36,32,0.12)] overflow-hidden rounded-[99px] flex justify-center items-center cursor-pointer hover:bg-[#1a1512] transition-colors">
                  <div className="text-[#FBFAF9] text-[13px] font-medium leading-5 font-sans">Open preview</div>
                </div>
              </div>
              <div className="self-stretch flex flex-col gap-2">
                {["Prompt composer preview", "Lyric and reference modes", "Genre and mood controls", "Mock browser playback", "Launch checklist"].map((f) => (
                  <div key={f} className="flex justify-start items-center gap-3">
                    <div className="w-4 h-4 flex items-center justify-center"><CheckIcon color="#9CA3AF" /></div>
                    <div className="text-[rgba(42,36,32,0.70)] text-[12.5px] font-normal leading-5 font-sans">{f}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Creator (featured) */}
            <div className="flex-1 self-stretch px-6 py-5 bg-[#2A2420] border border-[rgba(42,36,32,0.12)] overflow-hidden flex flex-col justify-start items-start gap-10">
              <div className="self-stretch flex flex-col gap-8">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <div className="text-[#FBFAF9] text-lg font-semibold leading-7 font-sans">Creator</div>
                    <span className="px-2 py-0.5 bg-[rgba(232,84,26,0.20)] text-[#E8A080] text-[10px] font-semibold rounded-full font-sans">Popular</span>
                  </div>
                  <div className="text-[#B2AEA9] text-sm font-normal leading-5 font-sans max-w-[240px]">
                    For independent creators planning a real AI music workflow.
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="relative h-[60px] flex items-center text-[#F0EFEE] text-5xl font-medium leading-[60px] font-serif">
                    <span className="invisible">${pricing.creator[billing]}</span>
                    {(["annually", "monthly"] as const).map((p) => (
                      <span
                        key={p}
                        className="absolute inset-0 flex items-center transition-all duration-500"
                        style={{
                          opacity: billing === p ? 1 : 0,
                          transform: `scale(${billing === p ? 1 : 0.8})`,
                          filter: `blur(${billing === p ? 0 : 4}px)`,
                        }}
                        aria-hidden={billing !== p}
                      >
                        ${pricing.creator[p]}
                      </span>
                    ))}
                  </div>
                  <div className="text-[#D2C6BF] text-sm font-medium font-sans">
                    per {billing === "monthly" ? "month" : "year"}, per user
                  </div>
                </div>
                <div className="self-stretch px-4 py-[10px] relative bg-[#FBFAF9] shadow-[0px_2px_4px_rgba(42,36,32,0.12)] overflow-hidden rounded-[99px] flex justify-center items-center cursor-pointer hover:bg-white transition-colors">
                  <div className="text-[#2A2420] text-[13px] font-medium leading-5 font-sans">Plan launch</div>
                </div>
              </div>
              <div className="self-stretch flex flex-col gap-2">
                {[
                  "Prompt and lyric workflow planning",
                  "Reference-audio requirement notes",
                  "Full genre, mood, and style controls",
                  "Vocal and instrumental modes",
                  "Export format checklist",
                  "Usage-rights review prompts",
                  "Production integration notes",
                  "Email handoff",
                ].map((f) => (
                  <div key={f} className="flex justify-start items-center gap-3">
                    <div className="w-4 h-4 flex items-center justify-center"><CheckIcon color="#E8541A" /></div>
                    <div className="text-[#F0EFEE] text-[12.5px] font-normal leading-5 font-sans">{f}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Studio */}
            <div className="flex-1 self-stretch px-6 py-5 bg-white border border-[rgba(42,36,32,0.10)] overflow-hidden flex flex-col justify-start items-start gap-10">
              <div className="self-stretch flex flex-col gap-8">
                <div className="flex flex-col gap-1.5">
                  <div className="text-[#2A2420] text-lg font-semibold leading-7 font-sans">Studio</div>
                  <div className="text-[rgba(42,36,32,0.60)] text-sm font-normal leading-5 font-sans max-w-[240px]">
                    For agencies and music teams preparing a production launch.
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="relative h-[60px] flex items-center text-[#2A2420] text-5xl font-medium leading-[60px] font-serif">
                    <span className="invisible">${pricing.studio[billing]}</span>
                    {(["annually", "monthly"] as const).map((p) => (
                      <span
                        key={p}
                        className="absolute inset-0 flex items-center transition-all duration-500"
                        style={{
                          opacity: billing === p ? 1 : 0,
                          transform: `scale(${billing === p ? 1 : 0.8})`,
                          filter: `blur(${billing === p ? 0 : 4}px)`,
                        }}
                        aria-hidden={billing !== p}
                      >
                        ${pricing.studio[p]}
                      </span>
                    ))}
                  </div>
                  <div className="text-[#857870] text-sm font-medium font-sans">
                    per {billing === "monthly" ? "month" : "year"}, per seat
                  </div>
                </div>
                <div className="self-stretch px-4 py-[10px] relative bg-[#2A2420] shadow-[0px_2px_4px_rgba(42,36,32,0.12)] overflow-hidden rounded-[99px] flex justify-center items-center cursor-pointer hover:bg-[#1a1512] transition-colors">
                  <div className="text-[#FBFAF9] text-[13px] font-medium leading-5 font-sans">Contact sales</div>
                </div>
              </div>
              <div className="self-stretch flex flex-col gap-2">
                {[
                  "Everything in Creator",
                  "Team review workspace planning",
                  "Stems and MIDI export requirements",
                  "Lyric-to-song workflow mapping",
                  "Brand and campaign prompt sets",
                  "Integration brief",
                  "Dedicated launch support",
                  "Custom terms review",
                ].map((f) => (
                  <div key={f} className="flex justify-start items-center gap-3">
                    <div className="w-4 h-4 flex items-center justify-center"><CheckIcon color="#1A9E8F" /></div>
                    <div className="text-[rgba(42,36,32,0.80)] text-[12.5px] font-normal leading-5 font-sans">{f}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-12 self-stretch relative overflow-hidden hidden md:block">
            <div className="w-[162px] left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
              {Array.from({ length: 200 }).map((_, i) => (
                <div key={i} className="self-stretch h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(42,36,32,0.06)] outline-offset-[-0.25px]" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="self-stretch px-6 py-4 flex justify-center">
        <p className="text-center text-[rgba(42,36,32,0.40)] text-[11px] font-sans leading-5 max-w-[640px]">
          Seed Music is an independent AI music generation landing page. Pricing and plan limits shown here are positioning placeholders until billing, user accounts, and usage policies are finalized.
        </p>
      </div>
    </div>
  )
}
