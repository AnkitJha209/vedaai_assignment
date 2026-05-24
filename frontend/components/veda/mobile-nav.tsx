"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Home, Library, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Assignments", href: "/assignments", icon: BookOpen },
  { label: "Library", href: "/library", icon: Library },
  { label: "AI Toolkit", href: "/toolkit", icon: Sparkles },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-30 flex items-center justify-around border-t border-border bg-card py-2 md:hidden">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive =
          item.href === "/assignments"
            ? pathname.startsWith("/assignments")
            : pathname === item.href

        return (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 text-xs",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
