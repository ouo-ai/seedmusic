"use client"

export function CheckboxField({
  label,
  checked,
  onChange,
  description,
}: {
  label: string
  checked: boolean
  onChange: (value: boolean) => void
  description?: string
}) {
  return (
    <label className="flex min-h-10 items-start gap-3 rounded-xl border border-[rgba(42,36,32,0.14)] bg-white px-3 py-2.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-4 w-4 rounded border-[rgba(42,36,32,0.24)] accent-[#2A2420]"
      />
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="font-sans text-[12px] font-medium text-[#2A2420]">{label}</span>
        {description && <span className="font-sans text-[11px] leading-4 text-[rgba(42,36,32,0.50)]">{description}</span>}
      </span>
    </label>
  )
}
