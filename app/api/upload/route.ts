import { NextRequest, NextResponse } from "next/server"

import { createPresignedUpload, isR2Configured } from "@/lib/r2"

export const runtime = "nodejs"

const MAX_SIZE_BYTES = 50 * 1024 * 1024 // 50MB

type UploadRequestBody = {
  filename?: unknown
  contentType?: unknown
  size?: unknown
}

function normalizeContentType(value: unknown): string {
  return typeof value === "string" ? value.split(";")[0].trim().toLowerCase() : ""
}

export async function POST(request: NextRequest) {
  if (!isR2Configured()) {
    return NextResponse.json({ ok: false, error: "Upload storage is not configured." }, { status: 500 })
  }

  let body: UploadRequestBody
  try {
    body = (await request.json()) as UploadRequestBody
  } catch {
    return NextResponse.json({ ok: false, error: "Request body must be valid JSON." }, { status: 400 })
  }

  const contentType = normalizeContentType(body.contentType)
  if (!contentType.startsWith("audio/")) {
    return NextResponse.json({ ok: false, error: "Only audio files are allowed." }, { status: 400 })
  }

  if (typeof body.size === "number" && body.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ ok: false, error: "File exceeds the 50MB limit." }, { status: 413 })
  }

  try {
    const filename = typeof body.filename === "string" ? body.filename : "audio"
    const result = await createPresignedUpload(filename, contentType)
    return NextResponse.json({ ok: true, contentType, ...result })
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to create upload URL." },
      { status: 500 },
    )
  }
}
