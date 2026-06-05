import { NextRequest, NextResponse } from "next/server"

import {
  SUNO_MODEL_VERSIONS,
  SUNO_WORKFLOWS,
  buildKieSubmitRequest,
  extractTaskId,
  getKieDetailPath,
  getSunoWorkflow,
} from "@/lib/kie-suno"

export const runtime = "nodejs"

const KIE_API_BASE = "https://api.kie.ai/api/v1"

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

function siteUrlFromRequest(request: NextRequest) {
  return process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin
}

async function readKieResponse(response: Response) {
  const text = await response.text()
  try {
    return text ? JSON.parse(text) : null
  } catch {
    return { raw: text.slice(0, 1000) }
  }
}

async function callKie(path: string, init: RequestInit) {
  const apiKey = process.env.KIE_AI_API_KEY
  if (!apiKey) {
    return json({ ok: false, error: "KIE_AI_API_KEY is not configured on the server." }, 500)
  }

  const response = await fetch(`${KIE_API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    cache: "no-store",
  })
  const data = await readKieResponse(response)
  return json({ ok: response.ok, status: response.status, data }, response.ok ? 200 : response.status)
}

export async function GET(request: NextRequest) {
  const workflow = request.nextUrl.searchParams.get("workflow")
  const taskId = request.nextUrl.searchParams.get("taskId")

  if (!workflow || !taskId) {
    return json({
      ok: true,
      models: SUNO_MODEL_VERSIONS,
      workflows: SUNO_WORKFLOWS,
    })
  }

  const detailPath = getKieDetailPath(workflow)
  if (!detailPath) {
    return json({ ok: false, error: `Workflow ${workflow} does not expose a polling endpoint.` }, 400)
  }

  return callKie(`${detailPath}?taskId=${encodeURIComponent(taskId)}`, { method: "GET" })
}

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return json({ ok: false, error: "Request body must be valid JSON." }, 400)
  }

  try {
    const config = buildKieSubmitRequest(body as never, siteUrlFromRequest(request))
    const response = await callKie(config.workflow.path, {
      method: "POST",
      body: JSON.stringify(config.payload),
    })
    const result = await response.json()
    return json(
      {
        ...result,
        workflow: getSunoWorkflow(config.workflow.id),
        taskId: extractTaskId(result.data),
      },
      response.status,
    )
  } catch (error) {
    return json({ ok: false, error: error instanceof Error ? error.message : "Invalid Kie.ai request." }, 400)
  }
}
