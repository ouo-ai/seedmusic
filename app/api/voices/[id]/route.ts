import { Prisma } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

import { getOwnerId } from "@/lib/owner"
import { prisma } from "@/lib/prisma"
import type { Voice } from "@/lib/studio-store"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const ownerId = await getOwnerId()
  const body = (await request.json().catch(() => ({}))) as Partial<Voice>

  const data: Prisma.VoiceUpdateInput = {}
  if (body.name !== undefined) data.name = body.name
  if (body.status !== undefined) data.status = body.status
  if (body.validateTaskId !== undefined) data.validateTaskId = body.validateTaskId
  if (body.phrase !== undefined) data.phrase = body.phrase
  if (body.generateTaskId !== undefined) data.generateTaskId = body.generateTaskId
  if (body.voiceId !== undefined) data.voiceId = body.voiceId
  if (body.language !== undefined) data.language = body.language
  if (body.error !== undefined) data.error = body.error

  await prisma.voice.updateMany({ where: { id, ownerId }, data })
  return NextResponse.json({ ok: true })
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const ownerId = await getOwnerId()
  await prisma.voice.deleteMany({ where: { id, ownerId } })
  return NextResponse.json({ ok: true })
}
