"use client"

import { Disc3, Home, Mic2, Sparkles } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/studio", label: "Create", icon: Sparkles, exact: true },
  { href: "/studio/library", label: "Library", icon: Disc3, exact: false },
  { href: "/studio/voices", label: "Voices", icon: Mic2, exact: false },
]

export function StudioSidebar() {
  const pathname = usePathname() ?? ""

  return (
    <aside className="flex w-16 shrink-0 flex-col border-r border-[rgba(42,36,32,0.10)] bg-white md:w-60">
      <Link href="/" className="flex h-16 items-center gap-2 border-b border-[rgba(42,36,32,0.08)] px-4">
        <svg width="22" height="22" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="7" stroke="#2A2420" strokeWidth="1.2" />
          <circle cx="8" cy="8" r="2.5" fill="#E8541A" />
        </svg>
        <span className="hidden text-sm font-semibold text-[#2A2420] md:block">SeedMusic</span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1 p-2">
        {NAV_ITEMS.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                "justify-center md:justify-start",
                active ? "bg-[#2A2420] text-white" : "text-[#2A2420] hover:bg-[#F0EDE9]",
              )}
            >
              <Icon className="size-5 shrink-0" strokeWidth={1.8} />
              <span className="hidden md:block">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-[rgba(42,36,32,0.08)] p-2">
        <Link
          href="/"
          className="flex items-center justify-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#857870] transition-colors hover:bg-[#F0EDE9] md:justify-start"
        >
          <Home className="size-5 shrink-0" strokeWidth={1.8} />
          <span className="hidden md:block">Back to home</span>
        </Link>
      </div>
    </aside>
  )
}
