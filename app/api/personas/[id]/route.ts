import { NextRequest, NextResponse } from "next/server"

import { getOwnerId } from "@/lib/owner"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const ownerId = await getOwnerId()
  await prisma.persona.deleteMany({ where: { id, ownerId } })
  return NextResponse.json({ ok: true })
}
