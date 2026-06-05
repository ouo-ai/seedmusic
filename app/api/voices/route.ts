import { NextRequest, NextResponse } from "next/server"

import { getOwnerId } from "@/lib/owner"
import { prisma } from "@/lib/prisma"
import type { Voice, VoiceStatus } from "@/lib/studio-store"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type VoiceRow = Awaited<ReturnType<typeof prisma.voice.findMany>>[number]

function serialize(voice: VoiceRow): Voice {
  return {
    id: voice.id,
    name: voice.name,
    status: voice.status as VoiceStatus,
    validateTaskId: voice.validateTaskId ?? undefined,
    phrase: voice.phrase ?? undefined,
    generateTaskId: voice.generateTaskId ?? undefined,
    voiceId: voice.voiceId ?? undefined,
    language: voice.language ?? undefined,
    error: voice.error ?? undefined,
    createdAt: voice.createdAt.getTime(),
  }
}

export async function GET() {
  const ownerId = await getOwnerId()
  const rows = await prisma.voice.findMany({ where: { ownerId }, orderBy: { createdAt: "desc" } })
  return NextResponse.json({ items: rows.map(serialize) })
}

export async function POST(request: NextRequest) {
  const ownerId = await getOwnerId()
  const body = (await request.json().catch(() => ({}))) as Partial<Voice>
  if (!body.id || !body.name) {
    return NextResponse.json({ ok: false, error: "Missing id or name." }, { status: 400 })
  }
  try {
    const row = await prisma.voice.create({
      data: {
        id: body.id,
        ownerId,
        name: body.name,
        status: body.status ?? "validating",
        validateTaskId: body.validateTaskId ?? null,
        phrase: body.phrase ?? null,
        generateTaskId: body.generateTaskId ?? null,
        voiceId: body.voiceId ?? null,
        language: body.language ?? null,
        error: body.error ?? null,
        ...(body.createdAt ? { createdAt: new Date(body.createdAt) } : {}),
      },
    })
    return NextResponse.json({ item: serialize(row) })
  } catch {
    return NextResponse.json({ ok: true })
  }
}
