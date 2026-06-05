"use client"

import { Loader2, Music2, UploadCloud, X } from "lucide-react"
import { useRef, useState } from "react"

import { useR2Upload } from "@/hooks/use-r2-upload"

export function AudioUploader({
  label,
  value,
  onChange,
  hint = "Drop an audio file or click to choose (≤50MB, ≤8 min)",
}: {
  label?: string
  value: string
  onChange: (url: string) => void
  hint?: string
}) {
  const { state, upload, reset } = useR2Upload()
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  const handleFile = async (file?: File | null) => {
    if (!file) return
    try {
      const url = await upload(file)
      onChange(url)
    } catch {
      // error is surfaced via state.error below
    }
  }

  const clear = () => {
    onChange("")
    reset()
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <span className="font-sans text-[11px] font-medium uppercase tracking-wide text-[rgba(42,36,32,0.50)]">{label}</span>
      )}

      {value && state.status !== "uploading" ? (
        <div className="flex flex-col gap-2 rounded-xl border border-[rgba(26,158,143,0.30)] bg-[rgba(26,158,143,0.06)] px-3 py-2.5">
          <div className="flex items-center gap-2">
            <Music2 className="size-4 shrink-0 text-[#1A9E8F]" />
            <span className="min-w-0 flex-1 truncate font-sans text-[12px] text-[#2A2420]">{state.filename || "Uploaded audio"}</span>
            <button type="button" onClick={clear} aria-label="Remove" className="text-[#857870] hover:text-[#2A2420]">
              <X className="size-4" />
            </button>
          </div>
          <audio src={value} controls preload="none" className="h-8 w-full" />
        </div>
      ) : state.status === "uploading" ? (
        <div className="flex flex-col gap-2 rounded-xl border border-[rgba(42,36,32,0.14)] bg-white px-3 py-3">
          <div className="flex items-center gap-2 font-sans text-[12px] text-[#2A2420]">
            <Loader2 className="size-4 animate-spin text-[#E8541A]" />
            Uploading {state.progress}%
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#F0EDE9]">
            <div className="h-full rounded-full bg-[#E8541A] transition-all" style={{ width: `${state.progress}%` }} />
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(event) => {
            event.preventDefault()
            setDragOver(false)
            handleFile(event.dataTransfer.files?.[0])
          }}
          className={`flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-6 text-center transition-colors ${
            dragOver
              ? "border-[#E8541A] bg-[rgba(232,84,26,0.05)]"
              : "border-[rgba(42,36,32,0.22)] bg-[#FAFAF9] hover:border-[rgba(42,36,32,0.40)]"
          }`}
        >
          <UploadCloud className="size-6 text-[#857870]" strokeWidth={1.6} />
          <span className="font-sans text-[12px] text-[#857870]">{hint}</span>
        </button>
      )}

      {state.status === "error" && state.error && (
        <span className="font-sans text-[11px] text-[#8A2D10]">{state.error}</span>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={(event) => handleFile(event.target.files?.[0])}
      />
    </div>
  )
}
