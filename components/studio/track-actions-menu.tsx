"use client"

import { Loader2, MoreHorizontal } from "lucide-react"
import { useState } from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTrackActions } from "@/hooks/use-track-actions"
import { TRACK_ACTIONS, type TrackActionId } from "@/lib/studio-catalog"
import type { LibraryTrack } from "@/lib/studio-store"

import { ExtendDialog, PersonaDialog, ReplaceSectionDialog, SeparateVocalsDialog } from "./track-action-dialogs"

export function TrackActionsMenu({ track }: { track: LibraryTrack }) {
  const actions = useTrackActions()
  const [dialog, setDialog] = useState<TrackActionId | null>(null)

  const hasMidiSource = Boolean(track.derived?.some((asset) => asset.taskId && asset.label.startsWith("Stems")))
  const isDisabled = (id: TrackActionId, needsAudioId: boolean) => {
    if (needsAudioId && !track.audioId) return true
    if (id === "generate-midi") return !hasMidiSource
    return false
  }

  const handle = (id: TrackActionId, kind: "one-click" | "dialog") => {
    if (kind === "dialog") {
      setDialog(id)
      return
    }
    if (id === "timestamped-lyrics") void actions.runSimple(track, id)
    else void actions.runDerived(track, id)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="More actions"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-[#857870] transition-colors hover:bg-[#F0EDE9] hover:text-[#2A2420]"
          >
            {actions.busy ? <Loader2 className="size-4 animate-spin" /> : <MoreHorizontal className="size-4" />}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {TRACK_ACTIONS.map((action) => (
            <DropdownMenuItem
              key={action.id}
              disabled={isDisabled(action.id, action.needsAudioId)}
              onSelect={() => handle(action.id, action.kind)}
              title={action.id === "generate-midi" && !hasMidiSource ? "Separate stems before generating MIDI" : undefined}
              className="cursor-pointer disabled:cursor-not-allowed"
            >
              {action.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <ExtendDialog track={track} actions={actions} open={dialog === "extend"} onOpenChange={(open) => setDialog(open ? "extend" : null)} />
      <ReplaceSectionDialog
        track={track}
        actions={actions}
        open={dialog === "replace-section"}
        onOpenChange={(open) => setDialog(open ? "replace-section" : null)}
      />
      <SeparateVocalsDialog
        track={track}
        actions={actions}
        open={dialog === "separate-vocals"}
        onOpenChange={(open) => setDialog(open ? "separate-vocals" : null)}
      />
      <PersonaDialog
        track={track}
        actions={actions}
        open={dialog === "generate-persona"}
        onOpenChange={(open) => setDialog(open ? "generate-persona" : null)}
      />
    </>
  )
}
