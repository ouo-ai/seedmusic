import { Prisma } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

import { getOwnerId } from "@/lib/owner"
import { prisma } from "@/lib/prisma"
import type { DerivedAsset, LibraryTrack } from "@/lib/studio-store"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type TrackRow = Awaited<ReturnType<typeof prisma.track.findMany>>[number]

function serialize(track: TrackRow): LibraryTrack {
  return {
    id: track.id,
    taskId: track.taskId ?? undefined,
    audioId: track.audioId ?? undefined,
    title: track.title,
    audioUrl: track.audioUrl ?? undefined,
    imageUrl: track.imageUrl ?? undefined,
    model: track.model ?? undefined,
    workflow: track.workflow as LibraryTrack["workflow"],
    tags: track.tags ?? undefined,
    prompt: track.prompt ?? undefined,
    duration: track.duration ?? undefined,
    status: track.status as LibraryTrack["status"],
    error: track.error ?? undefined,
    derived: (track.derived as DerivedAsset[] | null) ?? undefined,
    createdAt: track.createdAt.getTime(),
  }
}

export async function GET() {
  const ownerId = await getOwnerId()
  const rows = await prisma.track.findMany({ where: { ownerId }, orderBy: { createdAt: "desc" } })
  return NextResponse.json({ items: rows.map(serialize) })
}

export async function POST(request: NextRequest) {
  const ownerId = await getOwnerId()
  const body = (await request.json().catch(() => ({}))) as Partial<LibraryTrack>
  if (!body.id || !body.title || !body.workflow) {
    return NextResponse.json({ ok: false, error: "Missing id, title or workflow." }, { status: 400 })
  }
  try {
    const row = await prisma.track.create({
      data: {
        id: body.id,
        ownerId,
        title: body.title,
        workflow: body.workflow,
        taskId: body.taskId ?? null,
        audioId: body.audioId ?? null,
        audioUrl: body.audioUrl ?? null,
        imageUrl: body.imageUrl ?? null,
        model: body.model ?? null,
        tags: body.tags ?? null,
        prompt: body.prompt ?? null,
        duration: body.duration ?? null,
        status: body.status ?? "pending",
        error: body.error ?? null,
        derived: body.derived ? (body.derived as unknown as Prisma.InputJsonValue) : Prisma.JsonNull,
        ...(body.createdAt ? { createdAt: new Date(body.createdAt) } : {}),
      },
    })
    return NextResponse.json({ item: serialize(row) })
  } catch {
    // Likely a duplicate id from a retried optimistic write — treat as success.
    return NextResponse.json({ ok: true })
  }
}
