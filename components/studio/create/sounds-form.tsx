"use client"

import { useState } from "react"

import { useEngineRunner } from "@/hooks/use-engine-task"
import { SOUND_KEYS, SOUNDS_MODELS } from "@/lib/studio-catalog"

import { CheckboxField } from "../fields/checkbox-field"
import { LyricsField } from "../fields/lyrics-field"
import { RunButton } from "../fields/run-button"
import { SelectField } from "../fields/select-field"
import { TextField } from "../fields/text-field"

export function SoundsForm({ onCreated }: { onCreated: (id: string) => void }) {
  const { run } = useEngineRunner()
  const [prompt, setPrompt] = useState("")
  const [model, setModel] = useState<string>("V5_5")
  const [loop, setLoop] = useState(false)
  const [tempo, setTempo] = useState("")
  const [soundKey, setSoundKey] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const submit = async () => {
    setError("")
    if (!prompt.trim()) return setError("Describe the sound or loop to generate")

    const payload: Record<string, unknown> = {
      workflow: "sounds",
      model,
      prompt: prompt.trim().slice(0, 500),
      soundLoop: loop,
      soundTempo: tempo ? Number(tempo) : undefined,
      soundKey: soundKey || undefined,
      grabLyrics: true,
    }
    setSubmitting(true)
    try {
      const id = await run({
        workflow: "sounds",
        payload,
        pollable: true,
        title: "Sound / Loop",
        model,
        tags: prompt.trim().slice(0, 40),
        prompt: prompt.trim(),
      })
      onCreated(id)
      setPrompt("")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <LyricsField
        label="Sound description"
        value={prompt}
        onChange={setPrompt}
        limit={500}
        rows={4}
        enableAssist={false}
        placeholder="e.g. warm vinyl crackle layered with soft rain, seamless loop"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <CheckboxField label="Loop" checked={loop} onChange={setLoop} description="Generate a seamless loop" />
        <TextField label="BPM" value={tempo} onChange={setTempo} placeholder="Auto" type="number" min={1} max={300} />
        <SelectField label="Key" value={soundKey} onChange={setSoundKey}>
          {SOUND_KEYS.map((item) => (
            <option key={item.value || "auto"} value={item.value}>
              {item.label}
            </option>
          ))}
        </SelectField>
      </div>

      <SelectField label="Model (Sounds supports V5 / V5.5)" value={model} onChange={setModel}>
        {SOUNDS_MODELS.map((version) => (
          <option key={version} value={version}>
            {version}
          </option>
        ))}
      </SelectField>

      {error && <span className="font-sans text-[12px] text-[#8A2D10]">{error}</span>}
      <RunButton onClick={submit} loading={submitting}>
        Generate Sound
      </RunButton>
    </div>
  )
}
