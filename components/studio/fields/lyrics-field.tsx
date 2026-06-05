"use client"

import { Loader2, Sparkles } from "lucide-react"
import { useState } from "react"

import { runAssist } from "@/lib/music-engine-client"

export function LyricsField({
  label = "Lyrics",
  value,
  onChange,
  placeholder,
  limit,
  rows = 6,
  enableAssist = true,
}: {
  label?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  limit: number
  rows?: number
  enableAssist?: boolean
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const charLeft = limit - value.length

  const writeWithAI = async () => {
    if (!value.trim()) {
      setError("Enter a theme or a few lines first, then let AI write full lyrics")
      return
    }
    setError("")
    setLoading(true)
    try {
      const texts = await runAssist(
        { workflow: "generate-lyrics", prompt: value.trim().slice(0, 200) },
        { pollable: true, workflow: "generate-lyrics" },
      )
      if (texts[0]) onChange(texts[0].slice(0, limit))
      else setError("Couldn't generate lyrics, try again")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="font-sans text-[11px] font-medium uppercase tracking-wide text-[rgba(42,36,32,0.50)]">{label}</span>
        {enableAssist && (
          <button
            type="button"
            onClick={writeWithAI}
            disabled={loading}
            className="flex items-center gap-1 rounded-full border border-[rgba(232,84,26,0.30)] bg-[rgba(232,84,26,0.06)] px-2.5 py-1 font-sans text-[11px] font-medium text-[#E8541A] transition-colors hover:bg-[rgba(232,84,26,0.12)] disabled:opacity-50"
          >
            {loading ? <Loader2 className="size-3 animate-spin" /> : <Sparkles className="size-3" />}
            Write with AI
          </button>
        )}
      </div>
      <div className="relative">
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value.slice(0, limit))}
          rows={rows}
          placeholder={placeholder}
          className="w-full resize-none rounded-xl border border-[rgba(42,36,32,0.14)] bg-[#FAFAF9] px-4 py-3 font-sans text-sm leading-relaxed text-[#2A2420] placeholder:text-[rgba(42,36,32,0.35)] focus:border-[rgba(42,36,32,0.36)] focus:outline-none"
        />
        <span className="absolute bottom-3 right-3 font-mono text-[11px] text-[rgba(42,36,32,0.35)]">{charLeft}</span>
      </div>
      {error && <span className="font-sans text-[11px] text-[#8A2D10]">{error}</span>}
    </div>
  )
}
