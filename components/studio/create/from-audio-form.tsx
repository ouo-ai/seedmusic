"use client"

import { useState } from "react"

import { useEngineRunner } from "@/hooks/use-engine-task"
import { FROM_AUDIO_ACTIONS, type FromAudioAction, SONG_MODELS } from "@/lib/studio-catalog"

import { AudioUploader } from "../fields/audio-uploader"
import { LyricsField } from "../fields/lyrics-field"
import { PillSelector } from "../fields/pill-selector"
import { RunButton } from "../fields/run-button"
import { SelectField } from "../fields/select-field"
import { StyleField } from "../fields/style-field"
import { TextField } from "../fields/text-field"

export function FromAudioForm({ onCreated }: { onCreated: (id: string) => void }) {
  const { run } = useEngineRunner()

  const [actionId, setActionId] = useState<FromAudioAction["id"]>("upload-cover")
  const action = FROM_AUDIO_ACTIONS.find((item) => item.id === actionId) as FromAudioAction
  const [url1, setUrl1] = useState("")
  const [url2, setUrl2] = useState("")
  const [custom, setCustom] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [style, setStyle] = useState("")
  const [title, setTitle] = useState("")
  const [vocals, setVocals] = useState<"Vocals" | "Instrumental">("Vocals")
  const [continueAt, setContinueAt] = useState("")
  const [model, setModel] = useState("V5_5")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const instrumental = vocals === "Instrumental"
  const needsPrompt = actionId !== "add-instrumental"
  const showMusical = action.musical // cover / extend / mashup → Simple/Custom + vocals

  const submit = async () => {
    setError("")
    if (!url1.trim()) return setError("Upload audio first")
    if (action.files === 2 && !url2.trim()) return setError("Mashup needs two audio files")
    if (needsPrompt && !prompt.trim()) return setError("Add a description / lyrics")

    const styleText = style.trim() || `${vocals === "Vocals" ? "vocal" : "instrumental"}, polished`
    const payload: Record<string, unknown> = { workflow: actionId, model }

    if (actionId === "mashup") {
      payload.uploadUrlList = [url1.trim(), url2.trim()]
    } else {
      payload.uploadUrl = url1.trim()
    }
    if (showMusical) {
      payload.customMode = custom
      payload.instrumental = instrumental
      payload.prompt = prompt.trim() || undefined
      if (custom) {
        payload.style = styleText
        payload.title = title.trim() || action.label
      }
      if (actionId === "upload-extend" && continueAt) payload.continueAt = Number(continueAt)
    } else if (actionId === "add-instrumental") {
      payload.title = title.trim() || "Instrumental"
      payload.tags = style.trim() || "instrumental, clean"
    } else if (actionId === "add-vocals") {
      payload.prompt = prompt.trim()
      payload.title = title.trim() || "Vocals"
      payload.style = style.trim() || "pop vocal"
    }

    setSubmitting(true)
    try {
      const id = await run({
        workflow: actionId,
        payload,
        pollable: true,
        title: title.trim() || action.label,
        model,
        tags: style.trim(),
        prompt: prompt.trim(),
      })
      onCreated(id)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <span className="font-sans text-[11px] font-medium uppercase tracking-wide text-[rgba(42,36,32,0.50)]">What to do</span>
        <div className="flex flex-wrap gap-1.5">
          {FROM_AUDIO_ACTIONS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActionId(item.id)}
              className={`rounded-full border px-3 py-1 font-sans text-[12px] font-medium transition-colors ${
                actionId === item.id
                  ? "border-[#2A2420] bg-[#2A2420] text-white"
                  : "border-[rgba(42,36,32,0.16)] bg-white text-[#2A2420] hover:border-[rgba(42,36,32,0.36)]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <span className="font-sans text-[11px] text-[#857870]">{action.description}</span>
      </div>

      <AudioUploader label={action.files === 2 ? "Audio 1" : "Upload audio"} value={url1} onChange={setUrl1} />
      {action.files === 2 && <AudioUploader label="Audio 2" value={url2} onChange={setUrl2} />}

      {showMusical && (
        <>
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
        </>
      )}

      {needsPrompt && (
        <LyricsField
          label={actionId === "add-vocals" ? "Lyrics" : "Description"}
          value={prompt}
          onChange={setPrompt}
          limit={3000}
          rows={4}
          enableAssist={actionId === "add-vocals"}
          placeholder={actionId === "add-vocals" ? "Write the lyrics to sing" : "Describe the target style / direction"}
        />
      )}

      {(custom || actionId === "add-instrumental" || actionId === "add-vocals") && (
        <StyleField
          label={actionId === "add-instrumental" ? "Instrumental tags" : "Style / Tags"}
          value={style}
          onChange={setStyle}
        />
      )}

      {(custom || actionId === "add-instrumental" || actionId === "add-vocals") && (
        <TextField label="Title" value={title} onChange={setTitle} placeholder="Name your track" />
      )}

      {actionId === "upload-extend" && (
        <TextField label="Continue from (seconds, optional)" value={continueAt} onChange={setContinueAt} placeholder="60" type="number" min={0} />
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
        {action.label}
      </RunButton>
    </div>
  )
}
