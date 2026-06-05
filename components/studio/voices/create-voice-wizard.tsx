"use client"

import { CheckCircle2, Loader2 } from "lucide-react"
import { useState } from "react"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useVoices } from "@/hooks/use-voices"
import { pollWorkflow, submitWorkflow } from "@/lib/music-engine-client"
import { SINGER_SKILL_LEVELS, VOICE_LANGUAGES } from "@/lib/studio-catalog"

import { AudioUploader } from "../fields/audio-uploader"
import { RunButton } from "../fields/run-button"
import { SelectField } from "../fields/select-field"
import { TextField } from "../fields/text-field"

type Step = "input" | "working" | "phrase" | "done" | "error"

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function CreateVoiceWizard({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { addVoice, updateVoice } = useVoices()
  const [step, setStep] = useState<Step>("input")
  const [error, setError] = useState("")

  const [name, setName] = useState("")
  const [sourceUrl, setSourceUrl] = useState("")
  const [start, setStart] = useState("0")
  const [end, setEnd] = useState("30")
  const [language, setLanguage] = useState("en")
  const [skill, setSkill] = useState<string>("beginner")

  const [phrase, setPhrase] = useState("")
  const [recordUrl, setRecordUrl] = useState("")
  const [voiceLocalId, setVoiceLocalId] = useState<string | null>(null)
  const [validateTaskId, setValidateTaskId] = useState("")

  const reset = () => {
    setStep("input")
    setError("")
    setName("")
    setSourceUrl("")
    setStart("0")
    setEnd("30")
    setLanguage("en")
    setSkill("beginner")
    setPhrase("")
    setRecordUrl("")
    setVoiceLocalId(null)
    setValidateTaskId("")
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) reset()
    onOpenChange(next)
  }

  const startValidate = async () => {
    setError("")
    if (!name.trim()) return setError("Name your voice")
    if (!sourceUrl) return setError("Upload a source recording first")
    const s = Number(start)
    const e = Number(end)
    if (Number.isNaN(s) || Number.isNaN(e) || e <= s) return setError("Enter valid vocal start/end seconds (end must be greater)")

    const voice = addVoice({ name: name.trim(), status: "validating", language })
    setVoiceLocalId(voice.id)
    setStep("working")
    try {
      const result = await submitWorkflow({ workflow: "voice-validate", voiceUrl: sourceUrl, vocalStartS: s, vocalEndS: e, language })
      if (!result.ok || !result.taskId) throw new Error(result.error || "Submission failed")
      setValidateTaskId(result.taskId)
      updateVoice(voice.id, { validateTaskId: result.taskId })

      let phraseText = ""
      let attempts = 0
      while (attempts < 40) {
        attempts += 1
        await delay(4000)
        const polled = await pollWorkflow("voice-validate", result.taskId)
        if (polled.phrase) {
          phraseText = polled.phrase
          break
        }
        if (polled.state === "failed") throw new Error(polled.error || "Phrase generation failed")
      }
      if (!phraseText) throw new Error("Phrase generation timed out, try again")

      setPhrase(phraseText)
      updateVoice(voice.id, { status: "phrase-ready", phrase: phraseText })
      setStep("phrase")
    } catch (err) {
      updateVoice(voice.id, { status: "failed", error: err instanceof Error ? err.message : "Failed" })
      setError(err instanceof Error ? err.message : "Failed")
      setStep("error")
    }
  }

  const startGenerate = async () => {
    setError("")
    if (!recordUrl) return setError("Upload your recording of the phrase")
    setStep("working")
    try {
      const result = await submitWorkflow({
        workflow: "generate-voice",
        taskId: validateTaskId,
        verifyUrl: recordUrl,
        voiceName: name.trim(),
        singerSkillLevel: skill,
      })
      if (!result.ok || !result.taskId) throw new Error(result.error || "Submission failed")
      if (voiceLocalId) updateVoice(voiceLocalId, { status: "generating", generateTaskId: result.taskId })

      let voiceId = ""
      let attempts = 0
      while (attempts < 60) {
        attempts += 1
        await delay(5000)
        const polled = await pollWorkflow("generate-voice", result.taskId)
        if (polled.voiceId) {
          voiceId = polled.voiceId
          break
        }
        if (polled.state === "failed") throw new Error(polled.error || "Voice generation failed")
      }
      if (voiceLocalId) updateVoice(voiceLocalId, voiceId ? { status: "ready", voiceId } : { status: "generating" })
      setStep("done")
    } catch (err) {
      if (voiceLocalId) updateVoice(voiceLocalId, { status: "failed", error: err instanceof Error ? err.message : "Failed" })
      setError(err instanceof Error ? err.message : "Failed")
      setStep("error")
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="border-[rgba(42,36,32,0.12)] bg-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#2A2420]">Create custom voice</DialogTitle>
          <DialogDescription className="text-[#857870]">Upload audio → read the phrase → generate your own voice.</DialogDescription>
        </DialogHeader>

        {step === "input" && (
          <div className="flex flex-col gap-3 py-1">
            <TextField label="Voice name" value={name} onChange={setName} placeholder="e.g. My voice" />
            <AudioUploader label="Source recording (singing / speaking clip)" value={sourceUrl} onChange={setSourceUrl} />
            <div className="grid grid-cols-2 gap-3">
              <TextField label="Vocal start (s)" value={start} onChange={setStart} type="number" min={0} />
              <TextField label="Vocal end (s)" value={end} onChange={setEnd} type="number" min={0} />
            </div>
            <SelectField label="Language" value={language} onChange={setLanguage}>
              {VOICE_LANGUAGES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </SelectField>
            <SelectField label="Singing level" value={skill} onChange={setSkill}>
              {SINGER_SKILL_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </SelectField>
            {error && <span className="font-sans text-[12px] text-[#8A2D10]">{error}</span>}
            <RunButton onClick={startValidate}>Get verification phrase</RunButton>
          </div>
        )}

        {step === "working" && (
          <div className="flex flex-col items-center gap-2 py-10 text-[#857870]">
            <Loader2 className="size-6 animate-spin text-[#E8541A]" />
            <span className="font-sans text-sm">Working, please wait…</span>
          </div>
        )}

        {step === "phrase" && (
          <div className="flex flex-col gap-3 py-1">
            <div className="rounded-xl border border-[rgba(26,158,143,0.25)] bg-[rgba(26,158,143,0.06)] px-4 py-3">
              <div className="font-sans text-[11px] uppercase tracking-wide text-[#1A6E66]">Read this phrase aloud and record it</div>
              <div className="mt-1 font-sans text-sm font-medium text-[#2A2420]">{phrase}</div>
            </div>
            <AudioUploader label="Upload your recording" value={recordUrl} onChange={setRecordUrl} />
            {error && <span className="font-sans text-[12px] text-[#8A2D10]">{error}</span>}
            <RunButton onClick={startGenerate}>Generate voice</RunButton>
          </div>
        )}

        {step === "done" && (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <CheckCircle2 className="size-8 text-[#1A9E8F]" />
            <div className="font-sans text-sm font-medium text-[#2A2420]">Voice submitted</div>
            <div className="font-sans text-xs text-[#857870]">Track its status in Voices; once ready you can use it when creating.</div>
            <button
              type="button"
              onClick={() => handleOpenChange(false)}
              className="mt-2 h-9 rounded-lg bg-[#2A2420] px-4 font-sans text-sm font-medium text-white hover:bg-[#1a1512]"
            >
              Done
            </button>
          </div>
        )}

        {step === "error" && (
          <div className="flex flex-col gap-3 py-6 text-center">
            <span className="font-sans text-sm text-[#8A2D10]">{error || "Something went wrong"}</span>
            <button
              type="button"
              onClick={() => setStep("input")}
              className="mx-auto h-9 rounded-lg border border-[rgba(42,36,32,0.16)] bg-white px-4 font-sans text-sm text-[#2A2420] hover:bg-[#F0EDE9]"
            >
              Start over
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
