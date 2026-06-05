"use client"

import { Disc3, Search } from "lucide-react"
import { useMemo, useState } from "react"

import { useLibrary } from "@/hooks/use-library"

import { TrackCard } from "../track-card"

export function LibraryView() {
  const { tracks } = useLibrary()
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    if (!keyword) return tracks
    return tracks.filter((track) => `${track.title} ${track.tags ?? ""} ${track.model ?? ""}`.toLowerCase().includes(keyword))
  }, [query, tracks])

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-sans text-xl font-semibold text-[#2A2420]">Library</h1>
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#857870]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search title / style / model"
            className="h-10 w-full rounded-xl border border-[rgba(42,36,32,0.14)] bg-white pl-9 pr-3 font-sans text-sm text-[#2A2420] placeholder:text-[rgba(42,36,32,0.35)] focus:border-[rgba(42,36,32,0.36)] focus:outline-none"
          />
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-2 sm:grid-cols-2">
          {filtered.map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[rgba(42,36,32,0.16)] bg-white/50 py-20 text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-[#F0EDE9]">
            <Disc3 className="size-5 text-[#857870]" />
          </span>
          <div>
            <div className="font-sans text-sm font-medium text-[#2A2420]">{tracks.length === 0 ? "Your library is empty" : "No matching tracks"}</div>
            <div className="mt-0.5 font-sans text-xs text-[#857870]">
              {tracks.length === 0 ? "Generate your first track from the Create page" : "Try a different keyword"}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
