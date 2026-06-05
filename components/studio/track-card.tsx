"use client"

import { AlertCircle, Download, Loader2, Music2, Pause, Play } from "lucide-react"

import { isDownloadableMediaUrl } from "@/lib/media-links"
import type { LibraryTrack } from "@/lib/studio-store"

import { usePlayer } from "./player-provider"
import { TrackActionsMenu } from "./track-actions-menu"

export function TrackCard({ track }: { track: LibraryTrack }) {
  const { current, isPlaying, play } = usePlayer()
  const isCurrent = current?.id === track.id
  const playing = isCurrent && isPlaying
  const canPlay = track.status === "ready" && Boolean(track.audioUrl)
  const hasActions = track.status === "ready" && Boolean(track.taskId)
  const derived = (track.derived ?? []).filter((asset) => isDownloadableMediaUrl(asset.url))

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-[rgba(42,36,32,0.10)] bg-white p-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={!canPlay}
          onClick={() =>
            track.audioUrl &&
            play({ id: track.id, title: track.title, audioUrl: track.audioUrl, imageUrl: track.imageUrl, subtitle: track.tags })
          }
          className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#F0EDE9] disabled:cursor-not-allowed"
        >
          {track.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={track.imageUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <Music2 className="size-5 text-[#857870]" />
          )}
          {canPlay && (
            <span className="absolute inset-0 flex items-center justify-center bg-black/25 text-white">
              {playing ? <Pause className="size-4" fill="currentColor" /> : <Play className="size-4" fill="currentColor" />}
            </span>
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="truncate font-sans text-[13px] font-semibold text-[#2A2420]">{track.title}</div>
          <div className="mt-0.5 truncate font-sans text-[11px] text-[#857870]">
            {track.status === "pending" ? (
              <span className="inline-flex items-center gap-1">
                <Loader2 className="size-3 animate-spin" /> Generating…
              </span>
            ) : track.status === "failed" ? (
              <span className="inline-flex items-center gap-1 text-[#8A2D10]">
                <AlertCircle className="size-3" /> {track.error || "Generation failed"}
              </span>
            ) : (
              track.tags || track.model || "Ready"
            )}
          </div>
        </div>

        {hasActions && <TrackActionsMenu track={track} />}
      </div>

      {derived.length > 0 && (
        <div className="flex flex-wrap gap-1.5 border-t border-[rgba(42,36,32,0.08)] pt-2">
          {derived.map((asset, index) => (
            <a
              key={`${asset.label}-${index}`}
              href={asset.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-full border border-[rgba(42,36,32,0.14)] bg-[#FAFAF9] px-2.5 py-1 font-sans text-[11px] font-medium text-[#2A2420] transition-colors hover:bg-[#F0EDE9]"
            >
              <Download className="size-3" />
              {asset.label}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
