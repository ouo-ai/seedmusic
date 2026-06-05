import { NextRequest, NextResponse } from "next/server"

import { getOwnerId } from "@/lib/owner"
import { prisma } from "@/lib/prisma"
import type { Persona } from "@/lib/studio-store"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type PersonaRow = Awaited<ReturnType<typeof prisma.persona.findMany>>[number]

function serialize(persona: PersonaRow): Persona {
  return {
    id: persona.id,
    name: persona.name,
    description: persona.description ?? undefined,
    personaId: persona.personaId ?? undefined,
    personaModel: persona.personaModel ?? undefined,
    sourceTaskId: persona.sourceTaskId ?? undefined,
    sourceAudioId: persona.sourceAudioId ?? undefined,
    createdAt: persona.createdAt.getTime(),
  }
}

export async function GET() {
  const ownerId = await getOwnerId()
  const rows = await prisma.persona.findMany({ where: { ownerId }, orderBy: { createdAt: "desc" } })
  return NextResponse.json({ items: rows.map(serialize) })
}

export async function POST(request: NextRequest) {
  const ownerId = await getOwnerId()
  const body = (await request.json().catch(() => ({}))) as Partial<Persona>
  if (!body.id || !body.name) {
    return NextResponse.json({ ok: false, error: "Missing id or name." }, { status: 400 })
  }
  try {
    const row = await prisma.persona.create({
      data: {
        id: body.id,
        ownerId,
        name: body.name,
        description: body.description ?? null,
        personaId: body.personaId ?? null,
        personaModel: body.personaModel ?? null,
        sourceTaskId: body.sourceTaskId ?? null,
        sourceAudioId: body.sourceAudioId ?? null,
        ...(body.createdAt ? { createdAt: new Date(body.createdAt) } : {}),
      },
    })
    return NextResponse.json({ item: serialize(row) })
  } catch {
    return NextResponse.json({ ok: true })
  }
}
