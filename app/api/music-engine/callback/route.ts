import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  await request.json().catch(() => null)
  return NextResponse.json({ ok: true })
}
