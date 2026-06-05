"use client"

import { useCallback, useSyncExternalStore } from "react"

import { createListStore } from "@/lib/list-store"
import { createId, LIBRARY_KEY, type LibraryTrack, nowMs } from "@/lib/studio-store"

const store = createListStore<LibraryTrack>(LIBRARY_KEY)
const EMPTY: LibraryTrack[] = []

export type NewTrack = Omit<LibraryTrack, "id" | "createdAt"> & Partial<Pick<LibraryTrack, "id" | "createdAt">>

export function useLibrary() {
  const tracks = useSyncExternalStore(store.subscribe, store.get, () => EMPTY)

  const addTrack = useCallback((track: NewTrack): LibraryTrack => {
    const full: LibraryTrack = { ...track, id: track.id ?? createId(), createdAt: track.createdAt ?? nowMs() }
    store.set((prev) => [full, ...prev.filter((item) => item.id !== full.id)])
    return full
  }, [])

  const updateTrack = useCallback((id: string, patch: Partial<LibraryTrack>) => {
    store.set((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }, [])

  const removeTrack = useCallback((id: string) => {
    store.set((prev) => prev.filter((item) => item.id !== id))
  }, [])

  return { tracks, addTrack, updateTrack, removeTrack }
}
