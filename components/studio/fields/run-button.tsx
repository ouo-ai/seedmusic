"use client"

import { Loader2 } from "lucide-react"

export function RunButton({
  onClick,
  loading = false,
  disabled = false,
  children = "Generate",
}: {
  onClick: () => void
  loading?: boolean
  disabled?: boolean
  children?: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading || disabled}
      className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#2A2420] font-sans text-sm font-medium text-white shadow-[0px_2px_8px_rgba(42,36,32,0.18)] transition-all hover:bg-[#1a1512] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
    >
      {loading && <Loader2 className="size-4 animate-spin" />}
      {children}
    </button>
  )
}
