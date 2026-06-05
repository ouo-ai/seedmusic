"use client"

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"

export type PlayerTrack = {
  id: string
  title: string
  audioUrl: string
  imageUrl?: string
  subtitle?: string
}

type PlayerContextValue = {
  current: PlayerTrack | null
  isPlaying: boolean
  currentTime: number
  duration: number
  /** 播放某曲；若与当前同曲则切换播放/暂停。 */
  play: (track: PlayerTrack) => void
  toggle: () => void
  seek: (time: number) => void
}

const PlayerContext = createContext<PlayerContextValue | null>(null)

export function usePlayer(): PlayerContextValue {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider")
  return ctx
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [current, setCurrent] = useState<PlayerTrack | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const play = useCallback(
    (track: PlayerTrack) => {
      if (current?.id === track.id) {
        setIsPlaying((prev) => !prev)
        return
      }
      setCurrent(track)
      setIsPlaying(true)
    },
    [current],
  )

  const toggle = useCallback(() => {
    if (current) setIsPlaying((prev) => !prev)
  }, [current])

  const seek = useCallback((time: number) => {
    const audio = audioRef.current
    if (audio) {
      audio.currentTime = time
      setCurrentTime(time)
    }
  }, [])

  // 切歌：更新 src
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !current) return
    if (audio.src !== current.audioUrl) {
      audio.src = current.audioUrl
      audio.load()
    }
  }, [current])

  // 播放 / 暂停
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !current) return
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false))
    } else {
      audio.pause()
    }
  }, [isPlaying, current])

  return (
    <PlayerContext.Provider value={{ current, isPlaying, currentTime, duration, play, toggle, seek }}>
      {children}
      <audio
        ref={audioRef}
        className="hidden"
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)}
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </PlayerContext.Provider>
  )
}
