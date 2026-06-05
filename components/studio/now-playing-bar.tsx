"use client"

import { Music2, Pause, Play } from "lucide-react"

import { usePlayer } from "./player-provider"

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00"
  const minutes = Math.floor(seconds / 60)
  const rest = Math.floor(seconds % 60)
  return `${minutes}:${String(rest).padStart(2, "0")}`
}

export function NowPlayingBar() {
  const { current, isPlaying, currentTime, duration, toggle, seek } = usePlayer()

  return (
    <div className="flex h-[72px] shrink-0 items-center gap-4 border-t border-[rgba(42,36,32,0.10)] bg-white px-4">
      {current ? (
        <>
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#F0EDE9]">
              {current.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={current.imageUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <Music2 className="size-5 text-[#857870]" />
              )}
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-semibold text-[#2A2420]">{current.title}</span>
              {current.subtitle && <span className="truncate text-xs text-[#857870]">{current.subtitle}</span>}
            </span>
          </div>

          <button
            type="button"
            onClick={toggle}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#2A2420] text-white transition-colors hover:bg-[#1a1512]"
          >
            {isPlaying ? <Pause className="size-4" fill="currentColor" /> : <Play className="size-4" fill="currentColor" />}
          </button>

          <div className="hidden flex-[2] items-center gap-2 sm:flex">
            <span className="w-9 text-right text-[11px] tabular-nums text-[#857870]">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={Math.min(currentTime, duration || 0)}
              onChange={(event) => seek(Number(event.target.value))}
              className="h-1 flex-1 cursor-pointer accent-[#E8541A]"
              aria-label="Seek"
            />
            <span className="w-9 text-[11px] tabular-nums text-[#857870]">{formatTime(duration)}</span>
          </div>
        </>
      ) : (
        <div className="flex items-center gap-2 text-sm text-[rgba(42,36,32,0.40)]">
          <Music2 className="size-4" />
          Nothing playing yet
        </div>
      )}
    </div>
  )
}
