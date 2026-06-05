"use client"

import { useCallback, useEffect, useSyncExternalStore } from "react"

import { createResourceStore } from "@/lib/resource-store"
import { createId, nowMs, type Persona, type Voice } from "@/lib/studio-store"

const voiceStore = createResourceStore<Voice>("/api/voices")
const personaStore = createResourceStore<Persona>("/api/personas")
const EMPTY_VOICES: Voice[] = []
const EMPTY_PERSONAS: Persona[] = []

type NewVoice = Omit<Voice, "id" | "createdAt"> & Partial<Pick<Voice, "id" | "createdAt">>
type NewPersona = Omit<Persona, "id" | "createdAt"> & Partial<Pick<Persona, "id" | "createdAt">>

export function useVoices() {
  const voices = useSyncExternalStore(voiceStore.subscribe, voiceStore.get, () => EMPTY_VOICES)

  useEffect(() => {
    voiceStore.ensureLoaded()
  }, [])

  const addVoice = useCallback((voice: NewVoice): Voice => {
    const full: Voice = { ...voice, id: voice.id ?? createId(), createdAt: voice.createdAt ?? nowMs() }
    voiceStore.add(full)
    return full
  }, [])

  const updateVoice = useCallback((id: string, patch: Partial<Voice>) => {
    voiceStore.update(id, patch)
  }, [])

  const removeVoice = useCallback((id: string) => {
    voiceStore.remove(id)
  }, [])

  return { voices, addVoice, updateVoice, removeVoice }
}

export function usePersonas() {
  const personas = useSyncExternalStore(personaStore.subscribe, personaStore.get, () => EMPTY_PERSONAS)

  useEffect(() => {
    personaStore.ensureLoaded()
  }, [])

  const addPersona = useCallback((persona: NewPersona): Persona => {
    const full: Persona = { ...persona, id: persona.id ?? createId(), createdAt: persona.createdAt ?? nowMs() }
    personaStore.add(full)
    return full
  }, [])

  const removePersona = useCallback((id: string) => {
    personaStore.remove(id)
  }, [])

  return { personas, addPersona, removePersona }
}
