"use client"

import { Loader2, Sparkles } from "lucide-react"
import { useState } from "react"

import { runAssist } from "@/lib/music-engine-client"

export function StyleField({
  label = "Style / Tags",
  value,
  onChange,
  placeholder = "Electronic, cinematic, upbeat",
}: {
  label?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const enhance = async () => {
    if (!value.trim()) {
      setError("Enter a style idea first, then enhance")
      return
    }
    setError("")
    setLoading(true)
    try {
      const texts = await runAssist({ workflow: "boost-style", content: value.trim() }, { pollable: false, workflow: "boost-style" })
      if (texts[0]) onChange(texts[0])
      else setError("Couldn't enhance, try again")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Enhance failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="font-sans text-[11px] font-medium uppercase tracking-wide text-[rgba(42,36,32,0.50)]">{label}</span>
        <button
          type="button"
          onClick={enhance}
          disabled={loading}
          className="flex items-center gap-1 rounded-full border border-[rgba(232,84,26,0.30)] bg-[rgba(232,84,26,0.06)] px-2.5 py-1 font-sans text-[11px] font-medium text-[#E8541A] transition-colors hover:bg-[rgba(232,84,26,0.12)] disabled:opacity-50"
        >
          {loading ? <Loader2 className="size-3 animate-spin" /> : <Sparkles className="size-3" />}
          Enhance
        </button>
      </div>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-10 rounded-xl border border-[rgba(42,36,32,0.14)] bg-white px-3 font-sans text-sm text-[#2A2420] placeholder:text-[rgba(42,36,32,0.35)] focus:border-[rgba(42,36,32,0.36)] focus:outline-none"
      />
      {error && <span className="font-sans text-[11px] text-[#8A2D10]">{error}</span>}
    </div>
  )
}
