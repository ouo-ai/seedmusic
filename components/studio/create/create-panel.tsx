"use client"

import { Sparkles } from "lucide-react"
import { useMemo, useState } from "react"

import { useLibrary } from "@/hooks/use-library"
import type { CreateMode } from "@/lib/studio-catalog"
import type { LibraryTrack } from "@/lib/studio-store"

import { TrackCard } from "../track-card"
import { FromAudioForm } from "./from-audio-form"
import { SongForm } from "./song-form"
import { SoundsForm } from "./sounds-form"

const MODES: { id: CreateMode; label: string }[] = [
  { id: "song", label: "Song" },
  { id: "sounds", label: "Sounds / Loop" },
  { id: "from-audio", label: "From Audio" },
]

export function CreatePanel({ initialMode = "song" }: { initialMode?: CreateMode }) {
  const [mode, setMode] = useState<CreateMode>(initialMode)
  const [feedIds, setFeedIds] = useState<string[]>([])
  const { tracks } = useLibrary()

  const feed = useMemo(() => {
    const selectedIds = new Set(feedIds)
    const selectedTaskIds = new Set(
      feedIds
        .map((id) => tracks.find((track) => track.id === id)?.taskId)
        .filter((taskId): taskId is string => Boolean(taskId)),
    )

    return tracks.filter((track): track is LibraryTrack => {
      if (selectedIds.has(track.id)) return true
      return Boolean(track.taskId && selectedTaskIds.has(track.taskId))
    })
  }, [feedIds, tracks])

  const onCreated = (id: string) => setFeedIds((prev) => (prev.includes(id) ? prev : [id, ...prev]))

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row">
      <section className="lg:w-[440px] lg:shrink-0">
        <div className="rounded-2xl border border-[rgba(42,36,32,0.10)] bg-white p-5">
          <div className="mb-5 flex gap-1 rounded-xl bg-[#F0EDE9] p-1">
            {MODES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setMode(item.id)}
                className={`flex-1 rounded-lg py-2 font-sans text-[13px] font-medium transition-colors ${
                  mode === item.id ? "bg-white text-[#2A2420] shadow-sm" : "text-[#857870]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {mode === "song" && <SongForm onCreated={onCreated} />}
          {mode === "sounds" && <SoundsForm onCreated={onCreated} />}
          {mode === "from-audio" && <FromAudioForm onCreated={onCreated} />}
        </div>
      </section>

      <section className="flex-1">
        <h2 className="mb-3 font-sans text-sm font-semibold text-[#2A2420]">This session</h2>
        {feed.length > 0 ? (
          <div className="flex flex-col gap-2">
            {feed.map((track) => (
              <TrackCard key={track.id} track={track} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[rgba(42,36,32,0.16)] bg-white/50 py-16 text-center">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-[#F0EDE9]">
              <Sparkles className="size-5 text-[#857870]" />
            </span>
            <div>
              <div className="font-sans text-sm font-medium text-[#2A2420]">No tracks yet</div>
              <div className="mt-0.5 font-sans text-xs text-[#857870]">Pick a mode and generate — your tracks will show up here</div>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
