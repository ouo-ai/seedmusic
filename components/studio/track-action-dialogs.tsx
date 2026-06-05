"use client"

import { useState } from "react"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { useTrackActions } from "@/hooks/use-track-actions"
import type { LibraryTrack } from "@/lib/studio-store"

import { TextField } from "./fields/text-field"

type Actions = ReturnType<typeof useTrackActions>

type DialogProps = {
  track: LibraryTrack
  actions: Actions
  open: boolean
  onOpenChange: (open: boolean) => void
}

function ActionDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmLabel = "Submit",
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  onConfirm: () => void
  confirmLabel?: string
  children: React.ReactNode
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-[rgba(42,36,32,0.12)] bg-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#2A2420]">{title}</DialogTitle>
          {description && <DialogDescription className="text-[#857870]">{description}</DialogDescription>}
        </DialogHeader>
        <div className="flex flex-col gap-3 py-1">{children}</div>
        <DialogFooter>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-9 rounded-lg border border-[rgba(42,36,32,0.16)] bg-white px-4 font-sans text-sm text-[#2A2420] transition-colors hover:bg-[#F0EDE9]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-9 rounded-lg bg-[#2A2420] px-4 font-sans text-sm font-medium text-white transition-colors hover:bg-[#1a1512]"
          >
            {confirmLabel}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function ExtendDialog({ track, actions, open, onOpenChange }: DialogProps) {
  const [continueAt, setContinueAt] = useState("")
  const confirm = () => {
    void actions.runNewTrack(
      track,
      "extend",
      { defaultParamFlag: true, continueAt: continueAt ? Number(continueAt) : undefined },
      `Extend · ${track.title}`,
    )
    onOpenChange(false)
  }
  return (
    <ActionDialog open={open} onOpenChange={onOpenChange} title="Extend" description="Continue in the original style." onConfirm={confirm} confirmLabel="Extend">
      <TextField label="Start from (seconds, optional)" value={continueAt} onChange={setContinueAt} placeholder="Auto if blank" type="number" min={0} />
    </ActionDialog>
  )
}

export function ReplaceSectionDialog({ track, actions, open, onOpenChange }: DialogProps) {
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
  const [prompt, setPrompt] = useState("")
  const [tags, setTags] = useState(track.tags ?? "")
  const [title, setTitle] = useState(track.title)
  const [error, setError] = useState("")

  const confirm = () => {
    const s = Number(start)
    const e = Number(end)
    if (!start || !end || Number.isNaN(s) || Number.isNaN(e) || e <= s) return setError("Enter valid start/end seconds (end must be greater)")
    if (!prompt.trim() || !tags.trim() || !title.trim()) return setError("Fill in new lyrics, style tags and title")
    void actions.runNewTrack(
      track,
      "replace-section",
      { prompt: prompt.trim(), tags: tags.trim(), title: title.trim(), fullLyrics: prompt.trim(), infillStartS: s, infillEndS: e },
      `Replace · ${track.title}`,
    )
    onOpenChange(false)
  }

  return (
    <ActionDialog open={open} onOpenChange={onOpenChange} title="Replace Section" description="Rewrite a specific time range." onConfirm={confirm} confirmLabel="Replace">
      <div className="grid grid-cols-2 gap-3">
        <TextField label="Start (s)" value={start} onChange={setStart} placeholder="20" type="number" min={0} />
        <TextField label="End (s)" value={end} onChange={setEnd} placeholder="40" type="number" min={0} />
      </div>
      <label className="flex flex-col gap-1.5">
        <span className="font-sans text-[11px] font-medium uppercase tracking-wide text-[rgba(42,36,32,0.50)]">New lyrics</span>
        <textarea
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          rows={4}
          placeholder="What this section should sing"
          className="resize-none rounded-xl border border-[rgba(42,36,32,0.14)] bg-[#FAFAF9] px-3 py-2 font-sans text-sm text-[#2A2420] focus:border-[rgba(42,36,32,0.36)] focus:outline-none"
        />
      </label>
      <TextField label="Style / Tags" value={tags} onChange={setTags} placeholder="pop, energetic" />
      <TextField label="Title" value={title} onChange={setTitle} placeholder="Title" />
      {error && <span className="font-sans text-[12px] text-[#8A2D10]">{error}</span>}
    </ActionDialog>
  )
}

export function SeparateVocalsDialog({ track, actions, open, onOpenChange }: DialogProps) {
  const [type, setType] = useState<"separate_vocal" | "split_stem">("separate_vocal")
  const confirm = () => {
    void actions.runDerived(track, "separate-vocals", { separationType: type })
    onOpenChange(false)
  }
  return (
    <ActionDialog open={open} onOpenChange={onOpenChange} title="Separate Stems" description="Export separate audio tracks (stems)." onConfirm={confirm} confirmLabel="Separate">
      <div className="flex flex-col gap-2">
        {[
          { id: "separate_vocal" as const, label: "Vocals + Instrumental", desc: "Split into vocal and instrumental" },
          { id: "split_stem" as const, label: "Full stems", desc: "Split into drums / bass / vocals etc." },
        ].map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setType(option.id)}
            className={`flex flex-col items-start rounded-xl border px-3 py-2.5 text-left transition-colors ${
              type === option.id ? "border-[#2A2420] bg-[#2A2420]/[0.04]" : "border-[rgba(42,36,32,0.14)] bg-white hover:border-[rgba(42,36,32,0.36)]"
            }`}
          >
            <span className="font-sans text-[13px] font-medium text-[#2A2420]">{option.label}</span>
            <span className="font-sans text-[11px] text-[#857870]">{option.desc}</span>
          </button>
        ))}
      </div>
    </ActionDialog>
  )
}

export function PersonaDialog({ track, actions, open, onOpenChange }: DialogProps) {
  const [name, setName] = useState(track.title)
  const [description, setDescription] = useState("")
  const [style, setStyle] = useState(track.tags ?? "")
  const [error, setError] = useState("")

  const confirm = () => {
    if (!name.trim() || !description.trim()) return setError("Fill in name and description")
    void actions.runPersona(track, { name: name.trim(), description: description.trim(), style: style.trim() || undefined })
    onOpenChange(false)
  }

  return (
    <ActionDialog open={open} onOpenChange={onOpenChange} title="Save as Persona" description="Extract a reusable style you can pick when creating." onConfirm={confirm} confirmLabel="Create">
      <TextField label="Name" value={name} onChange={setName} placeholder="e.g. Warm electronic female voice" />
      <label className="flex flex-col gap-1.5">
        <span className="font-sans text-[11px] font-medium uppercase tracking-wide text-[rgba(42,36,32,0.50)]">Description</span>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={3}
          placeholder="What defines this persona"
          className="resize-none rounded-xl border border-[rgba(42,36,32,0.14)] bg-[#FAFAF9] px-3 py-2 font-sans text-sm text-[#2A2420] focus:border-[rgba(42,36,32,0.36)] focus:outline-none"
        />
      </label>
      <TextField label="Style tag (optional)" value={style} onChange={setStyle} placeholder="Electronic Pop" />
      {error && <span className="font-sans text-[12px] text-[#8A2D10]">{error}</span>}
    </ActionDialog>
  )
}
