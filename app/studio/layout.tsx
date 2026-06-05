import type { Metadata } from "next"

import { NowPlayingBar } from "@/components/studio/now-playing-bar"
import { PlayerProvider } from "@/components/studio/player-provider"
import { StudioSidebar } from "@/components/studio/studio-sidebar"
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: "SeedMusic Studio",
  description: "Create, edit and manage your AI music.",
}

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <PlayerProvider>
      <div className="flex h-screen flex-col bg-[#F7F5F3]">
        <div className="flex flex-1 overflow-hidden">
          <StudioSidebar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
        <NowPlayingBar />
      </div>
      <Toaster position="top-center" />
    </PlayerProvider>
  )
}
