const CALLBACK_KEY_PATTERN = /callback/i
const CALLBACK_PATH_PATTERN = /(^|\/)callbacks?(\/|$)/i

export function isDownloadableMediaUrl(value: unknown, sourceKey?: string): value is string {
  if (typeof value !== "string") return false

  const url = value.trim()
  if (!/^https?:\/\//i.test(url)) return false
  if (sourceKey && CALLBACK_KEY_PATTERN.test(sourceKey)) return false

  try {
    const parsed = new URL(url)
    return !CALLBACK_PATH_PATTERN.test(parsed.pathname)
  } catch {
    return false
  }
}
