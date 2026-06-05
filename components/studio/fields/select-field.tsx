"use client"

import { ChevronDown } from "lucide-react"

export function SelectField({
  label,
  value,
  onChange,
  children,
}: {
  label?: string
  value: string
  onChange: (value: string) => void
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-1.5">
      {label && (
        <span className="font-sans text-[11px] font-medium uppercase tracking-wide text-[rgba(42,36,32,0.50)]">{label}</span>
      )}
      <span className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-10 w-full appearance-none rounded-xl border border-[rgba(42,36,32,0.14)] bg-white px-3 pr-12 font-sans text-sm text-[#2A2420] focus:border-[rgba(42,36,32,0.36)] focus:outline-none"
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[#2A2420]"
          strokeWidth={1.8}
          aria-hidden="true"
        />
      </span>
    </label>
  )
}
