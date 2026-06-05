"use client"

import { Mic2, Plus, Trash2, User } from "lucide-react"
import { useState } from "react"

import { usePersonas, useVoices } from "@/hooks/use-voices"
import type { VoiceStatus } from "@/lib/studio-store"

import { CreateVoiceWizard } from "./create-voice-wizard"

const VOICE_STATUS: Record<VoiceStatus, { label: string; className: string }> = {
  validating: { label: "Analyzing", className: "bg-[rgba(42,36,32,0.08)] text-[#857870]" },
  "phrase-ready": { label: "Read phrase", className: "bg-[rgba(232,84,26,0.10)] text-[#E8541A]" },
  generating: { label: "Generating", className: "bg-[rgba(42,36,32,0.08)] text-[#857870]" },
  ready: { label: "Ready", className: "bg-[rgba(26,158,143,0.12)] text-[#1A6E66]" },
  failed: { label: "Failed", className: "bg-[rgba(232,84,26,0.10)] text-[#8A2D10]" },
}

function SectionEmpty({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[rgba(42,36,32,0.16)] bg-white/50 py-12 text-center">
      <span className="flex size-10 items-center justify-center rounded-xl bg-[#F0EDE9]">{icon}</span>
      <span className="font-sans text-xs text-[#857870]">{text}</span>
    </div>
  )
}

export function VoicesView() {
  const { voices, removeVoice } = useVoices()
  const { personas, removePersona } = usePersonas()
  const [wizardOpen, setWizardOpen] = useState(false)

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-sans text-xl font-semibold text-[#2A2420]">Voices</h1>
        <button
          type="button"
          onClick={() => setWizardOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#2A2420] px-3.5 py-2 font-sans text-[13px] font-medium text-white transition-colors hover:bg-[#1a1512]"
        >
          <Plus className="size-4" />
          Create voice
        </button>
      </div>

      <section className="mb-8">
        <h2 className="mb-3 font-sans text-sm font-semibold text-[#2A2420]">My voices</h2>
        {voices.length > 0 ? (
          <div className="grid gap-2 sm:grid-cols-2">
            {voices.map((voice) => {
              const status = VOICE_STATUS[voice.status]
              return (
                <div key={voice.id} className="flex items-center gap-3 rounded-xl border border-[rgba(42,36,32,0.10)] bg-white p-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#F0EDE9]">
                    <Mic2 className="size-5 text-[#857870]" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-sans text-[13px] font-semibold text-[#2A2420]">{voice.name}</div>
                    <span className={`mt-1 inline-block rounded-full px-2 py-0.5 font-sans text-[10px] font-medium ${status.className}`}>
                      {status.label}
                    </span>
                  </div>
                  <button type="button" onClick={() => removeVoice(voice.id)} aria-label="Delete" className="text-[#857870] hover:text-[#8A2D10]">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              )
            })}
          </div>
        ) : (
          <SectionEmpty icon={<Mic2 className="size-5 text-[#857870]" />} text="No custom voices yet — create one in the top right" />
        )}
      </section>

      <section>
        <h2 className="mb-3 font-sans text-sm font-semibold text-[#2A2420]">Personas</h2>
        {personas.length > 0 ? (
          <div className="grid gap-2 sm:grid-cols-2">
            {personas.map((persona) => (
              <div key={persona.id} className="flex items-center gap-3 rounded-xl border border-[rgba(42,36,32,0.10)] bg-white p-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#F0EDE9]">
                  <User className="size-5 text-[#857870]" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-sans text-[13px] font-semibold text-[#2A2420]">{persona.name}</div>
                  {persona.description && <div className="truncate font-sans text-[11px] text-[#857870]">{persona.description}</div>}
                </div>
                <button type="button" onClick={() => removePersona(persona.id)} aria-label="Delete" className="text-[#857870] hover:text-[#8A2D10]">
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <SectionEmpty icon={<User className="size-5 text-[#857870]" />} text="Save a track as a Persona from the Library to reuse it" />
        )}
      </section>

      <CreateVoiceWizard open={wizardOpen} onOpenChange={setWizardOpen} />
    </div>
  )
}
