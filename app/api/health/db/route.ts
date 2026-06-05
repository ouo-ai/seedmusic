import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/** Lightweight DB connectivity check: counts rows in each table. */
export async function GET() {
  try {
    const [tracks, voices, personas] = await Promise.all([
      prisma.track.count(),
      prisma.voice.count(),
      prisma.persona.count(),
    ])
    return NextResponse.json({ ok: true, counts: { tracks, voices, personas } })
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Database connection failed." },
      { status: 500 },
    )
  }
}
