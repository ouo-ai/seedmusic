"use client"

import { useCallback, useEffect, useSyncExternalStore } from "react"

import { createResourceStore } from "@/lib/resource-store"
import { createId, type LibraryTrack, nowMs } from "@/lib/studio-store"

const store = createResourceStore<LibraryTrack>("/api/tracks")
const EMPTY: LibraryTrack[] = []

export type NewTrack = Omit<LibraryTrack, "id" | "createdAt"> & Partial<Pick<LibraryTrack, "id" | "createdAt">>

export function useLibrary() {
  const tracks = useSyncExternalStore(store.subscribe, store.get, () => EMPTY)

  useEffect(() => {
    store.ensureLoaded()
  }, [])

  const addTrack = useCallback((track: NewTrack): LibraryTrack => {
    const full: LibraryTrack = { ...track, id: track.id ?? createId(), createdAt: track.createdAt ?? nowMs() }
    store.add(full)
    return full
  }, [])

  const updateTrack = useCallback((id: string, patch: Partial<LibraryTrack>) => {
    store.update(id, patch)
  }, [])

  const removeTrack = useCallback((id: string) => {
    store.remove(id)
  }, [])

  return { tracks, addTrack, updateTrack, removeTrack }
}
