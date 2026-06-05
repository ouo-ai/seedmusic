"use client"

import { useCallback, useSyncExternalStore } from "react"

import { createListStore } from "@/lib/list-store"
import { createId, nowMs, PERSONAS_KEY, type Persona, type Voice, VOICES_KEY } from "@/lib/studio-store"

const voiceStore = createListStore<Voice>(VOICES_KEY)
const personaStore = createListStore<Persona>(PERSONAS_KEY)
const EMPTY_VOICES: Voice[] = []
const EMPTY_PERSONAS: Persona[] = []

type NewVoice = Omit<Voice, "id" | "createdAt"> & Partial<Pick<Voice, "id" | "createdAt">>
type NewPersona = Omit<Persona, "id" | "createdAt"> & Partial<Pick<Persona, "id" | "createdAt">>

export function useVoices() {
  const voices = useSyncExternalStore(voiceStore.subscribe, voiceStore.get, () => EMPTY_VOICES)

  const addVoice = useCallback((voice: NewVoice): Voice => {
    const full: Voice = { ...voice, id: voice.id ?? createId(), createdAt: voice.createdAt ?? nowMs() }
    voiceStore.set((prev) => [full, ...prev.filter((item) => item.id !== full.id)])
    return full
  }, [])

  const updateVoice = useCallback((id: string, patch: Partial<Voice>) => {
    voiceStore.set((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }, [])

  const removeVoice = useCallback((id: string) => {
    voiceStore.set((prev) => prev.filter((item) => item.id !== id))
  }, [])

  return { voices, addVoice, updateVoice, removeVoice }
}

export function usePersonas() {
  const personas = useSyncExternalStore(personaStore.subscribe, personaStore.get, () => EMPTY_PERSONAS)

  const addPersona = useCallback((persona: NewPersona): Persona => {
    const full: Persona = { ...persona, id: persona.id ?? createId(), createdAt: persona.createdAt ?? nowMs() }
    personaStore.set((prev) => [full, ...prev.filter((item) => item.id !== full.id)])
    return full
  }, [])

  const removePersona = useCallback((id: string) => {
    personaStore.set((prev) => prev.filter((item) => item.id !== id))
  }, [])

  return { personas, addPersona, removePersona }
}
