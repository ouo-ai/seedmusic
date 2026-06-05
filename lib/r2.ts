import { randomUUID } from "node:crypto"

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const R2_ENDPOINT = process.env.R2_ENDPOINT
const R2_BUCKET = process.env.R2_BUCKET
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY
const R2_PUBLIC_BASE_URL = process.env.R2_PUBLIC_BASE_URL

export type PresignedUpload = {
  uploadUrl: string
  publicUrl: string
  key: string
}

/** 是否已配置 R2 凭证（缺任一项则上传端点返回未配置错误）。 */
export function isR2Configured(): boolean {
  return Boolean(R2_ENDPOINT && R2_BUCKET && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_PUBLIC_BASE_URL)
}

let cachedClient: S3Client | null = null

function getClient(): S3Client {
  if (!isR2Configured()) {
    throw new Error("R2 storage is not configured.")
  }
  if (!cachedClient) {
    cachedClient = new S3Client({
      region: "auto",
      endpoint: R2_ENDPOINT,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID as string,
        secretAccessKey: R2_SECRET_ACCESS_KEY as string,
      },
    })
  }
  return cachedClient
}

function sanitizeFilename(filename: string): string {
  const base = (filename || "audio").trim().toLowerCase()
  const cleaned = base
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
  return cleaned.slice(-80) || "audio"
}

/** 生成对象 key：uploads/YYYY/MM/<uuid>-<safeName>，避免碰撞且可读。 */
export function buildObjectKey(filename: string): string {
  const now = new Date()
  const yyyy = String(now.getUTCFullYear())
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0")
  return `uploads/${yyyy}/${mm}/${randomUUID()}-${sanitizeFilename(filename)}`
}

/** 由 key 拼出公开可访问 URL（喂给 Kie 的 uploadUrl/voiceUrl）。 */
export function buildPublicUrl(key: string): string {
  const base = (R2_PUBLIC_BASE_URL as string).replace(/\/$/, "")
  return `${base}/${key}`
}

/** 为浏览器直传生成预签名 PUT URL，同时返回最终公开 URL。 */
export async function createPresignedUpload(
  filename: string,
  contentType: string,
  expiresIn = 600,
): Promise<PresignedUpload> {
  const key = buildObjectKey(filename)
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    ContentType: contentType,
  })
  const uploadUrl = await getSignedUrl(getClient(), command, { expiresIn })
  return { uploadUrl, publicUrl: buildPublicUrl(key), key }
}
