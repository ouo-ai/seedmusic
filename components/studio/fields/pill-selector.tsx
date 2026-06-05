"use client"

export function PillSelector<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label?: string
  options: readonly T[]
  value: T
  onChange: (value: T) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <span className="font-sans text-[11px] font-medium uppercase tracking-wide text-[rgba(42,36,32,0.50)]">{label}</span>
      )}
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded-full border px-3 py-1 font-sans text-[12px] font-medium transition-colors ${
              value === option
                ? "border-[#2A2420] bg-[#2A2420] text-white"
                : "border-[rgba(42,36,32,0.16)] bg-white text-[#2A2420] hover:border-[rgba(42,36,32,0.36)]"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}
