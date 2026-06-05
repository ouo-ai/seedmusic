"use client"

import { useCallback, useState } from "react"

export type UploadStatus = "idle" | "uploading" | "done" | "error"

export type UploadState = {
  status: UploadStatus
  progress: number
  url?: string
  filename?: string
  error?: string
}

type PresignResponse = {
  ok?: boolean
  error?: string
  uploadUrl?: string
  publicUrl?: string
  contentType?: string
}

/** 单文件 R2 预签名直传：先取预签名 PUT，再用 XHR 直传（带进度）。 */
export function useR2Upload() {
  const [state, setState] = useState<UploadState>({ status: "idle", progress: 0 })

  const reset = useCallback(() => setState({ status: "idle", progress: 0 }), [])

  const upload = useCallback(async (file: File): Promise<string> => {
    setState({ status: "uploading", progress: 0, filename: file.name })

    const contentType = file.type || "audio/mpeg"
    const presignRes = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: file.name, contentType, size: file.size }),
    })
    const presign = (await presignRes.json().catch(() => ({}))) as PresignResponse
    if (!presignRes.ok || !presign.ok || !presign.uploadUrl || !presign.publicUrl) {
      const message = presign.error || "Upload init failed"
      setState({ status: "error", progress: 0, filename: file.name, error: message })
      throw new Error(message)
    }

    try {
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open("PUT", presign.uploadUrl as string)
        xhr.setRequestHeader("Content-Type", presign.contentType || contentType)
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            setState((prev) => ({ ...prev, progress: Math.round((event.loaded / event.total) * 100) }))
          }
        }
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve()
          else reject(new Error(`Upload failed (HTTP ${xhr.status})`))
        }
        xhr.onerror = () => reject(new Error("Upload network error — check the R2 bucket CORS config"))
        xhr.send(file)
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed"
      setState({ status: "error", progress: 0, filename: file.name, error: message })
      throw error
    }

    const url = presign.publicUrl
    setState({ status: "done", progress: 100, url, filename: file.name })
    return url
  }, [])

  return { state, upload, reset }
}
