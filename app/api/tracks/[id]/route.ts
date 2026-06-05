import { Prisma } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

import { getOwnerId } from "@/lib/owner"
import { prisma } from "@/lib/prisma"
import type { LibraryTrack } from "@/lib/studio-store"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const ownerId = await getOwnerId()
  const body = (await request.json().catch(() => ({}))) as Partial<LibraryTrack>

  const data: Prisma.TrackUpdateInput = {}
  if (body.taskId !== undefined) data.taskId = body.taskId
  if (body.audioId !== undefined) data.audioId = body.audioId
  if (body.title !== undefined) data.title = body.title
  if (body.audioUrl !== undefined) data.audioUrl = body.audioUrl
  if (body.imageUrl !== undefined) data.imageUrl = body.imageUrl
  if (body.model !== undefined) data.model = body.model
  if (body.tags !== undefined) data.tags = body.tags
  if (body.prompt !== undefined) data.prompt = body.prompt
  if (body.duration !== undefined) data.duration = body.duration
  if (body.status !== undefined) data.status = body.status
  if (body.error !== undefined) data.error = body.error
  if (body.derived !== undefined) data.derived = body.derived as unknown as Prisma.InputJsonValue

  await prisma.track.updateMany({ where: { id, ownerId }, data })
  return NextResponse.json({ ok: true })
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const ownerId = await getOwnerId()
  await prisma.track.deleteMany({ where: { id, ownerId } })
  return NextResponse.json({ ok: true })
}
