import { CreatePanel } from "@/components/studio/create/create-panel"
import type { CreateMode } from "@/lib/studio-catalog"

const VALID_MODES: CreateMode[] = ["song", "sounds", "from-audio"]

export default async function StudioCreatePage({ searchParams }: { searchParams: Promise<{ mode?: string }> }) {
  const { mode } = await searchParams
  const initialMode = VALID_MODES.includes(mode as CreateMode) ? (mode as CreateMode) : "song"
  return <CreatePanel initialMode={initialMode} />
}
