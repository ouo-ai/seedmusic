"use client"

import { useState } from "react"

import { useEngineRunner } from "@/hooks/use-engine-task"
import { usePersonas } from "@/hooks/use-voices"
import { GENRES, type Genre, getPromptLimit, type Mood, MOODS, SONG_MODELS } from "@/lib/studio-catalog"

import { LyricsField } from "../fields/lyrics-field"
import { PillSelector } from "../fields/pill-selector"
import { RunButton } from "../fields/run-button"
import { SelectField } from "../fields/select-field"
import { StyleField } from "../fields/style-field"
import { TextField } from "../fields/text-field"

export function SongForm({ onCreated }: { onCreated: (id: string) => void }) {
  const { run } = useEngineRunner()
  const { personas } = usePersonas()

  const [custom, setCustom] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [style, setStyle] = useState("")
  const [genre, setGenre] = useState<Genre>("Electronic")
  const [mood, setMood] = useState<Mood>("Energetic")
  const [vocals, setVocals] = useState<"Vocals" | "Instrumental">("Vocals")
  const [model, setModel] = useState("V5_5")
  const [title, setTitle] = useState("")
  const [personaId, setPersonaId] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const instrumental = vocals === "Instrumental"
  const limit = getPromptLimit("generate", model)
  const styleText = style.trim() || `${genre}, ${mood}`
  const showLyrics = !custom || !instrumental

  const submit = async () => {
    setError("")
    if (custom) {
      if (!title.trim()) return setError("Custom mode needs a title")
      if (!instrumental && !prompt.trim()) return setError("Add lyrics when vocals are on")
    } else if (!prompt.trim()) {
      return setError("Describe the music you want")
    }

    const persona = personas.find((item) => item.id === personaId)
    const payload: Record<string, unknown> = {
      workflow: "generate",
      model,
      customMode: custom,
      instrumental,
      prompt: prompt.trim() || undefined,
      negativeTags: "low quality, noisy, distorted",
    }
    if (custom) {
      payload.style = styleText
      payload.title = title.trim()
      if (persona?.personaId) {
        payload.personaId = persona.personaId
        payload.personaModel = persona.personaModel || "style_persona"
      }
    }

    setSubmitting(true)
    try {
      const id = await run({
        workflow: "generate",
        payload,
        pollable: true,
        title: title.trim() || "Untitled",
        model,
        tags: custom ? styleText : `${genre}, ${mood}`,
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
      <div className="flex gap-1 rounded-xl bg-[#F0EDE9] p-1">
        {[
          { id: false, label: "Simple" },
          { id: true, label: "Custom" },
        ].map((tab) => (
          <button
            key={tab.label}
            type="button"
            onClick={() => setCustom(tab.id)}
            className={`flex-1 rounded-lg py-1.5 font-sans text-[13px] font-medium transition-colors ${
              custom === tab.id ? "bg-white text-[#2A2420] shadow-sm" : "text-[#857870]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <PillSelector label="Vocals" options={["Vocals", "Instrumental"] as const} value={vocals} onChange={setVocals} />

      {showLyrics && (
        <LyricsField
          label={custom ? "Lyrics" : "Description"}
          value={prompt}
          onChange={setPrompt}
          limit={limit}
          rows={custom ? 7 : 4}
          placeholder={custom ? "Write lyrics, or enter a theme and tap Write with AI" : "Describe the style, scene and mood you want…"}
        />
      )}

      {custom && (
        <>
          <StyleField value={style} onChange={setStyle} placeholder={`Leave blank to use: ${genre}, ${mood}`} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <PillSelector label="Genre" options={GENRES} value={genre} onChange={setGenre} />
            <PillSelector label="Mood" options={MOODS} value={mood} onChange={setMood} />
          </div>
          <TextField label="Title" value={title} onChange={setTitle} placeholder="Name your track" />
          {personas.length > 0 && (
            <SelectField label="Persona (optional)" value={personaId} onChange={setPersonaId}>
              <option value="">None</option>
              {personas.map((persona) => (
                <option key={persona.id} value={persona.id}>
                  {persona.name}
                </option>
              ))}
            </SelectField>
          )}
        </>
      )}

      <SelectField label="Model" value={model} onChange={setModel}>
        {SONG_MODELS.map((version) => (
          <option key={version} value={version}>
            {version}
          </option>
        ))}
      </SelectField>

      {error && <span className="font-sans text-[12px] text-[#8A2D10]">{error}</span>}
      <RunButton onClick={submit} loading={submitting}>
        Generate Song
      </RunButton>
    </div>
  )
}
