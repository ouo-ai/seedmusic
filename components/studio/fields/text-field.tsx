"use client"

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  min,
  max,
}: {
  label?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: "text" | "number" | "url"
  min?: number
  max?: number
}) {
  return (
    <label className="flex flex-col gap-1.5">
      {label && (
        <span className="font-sans text-[11px] font-medium uppercase tracking-wide text-[rgba(42,36,32,0.50)]">{label}</span>
      )}
      <input
        type={type}
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-10 rounded-xl border border-[rgba(42,36,32,0.14)] bg-white px-3 font-sans text-sm text-[#2A2420] placeholder:text-[rgba(42,36,32,0.35)] focus:border-[rgba(42,36,32,0.36)] focus:outline-none"
      />
    </label>
  )
}
