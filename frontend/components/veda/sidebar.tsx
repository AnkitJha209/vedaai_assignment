"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpen,
  Home,
  Library,
  Settings,
  Sparkles,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { VedaLogo } from "@/components/veda/logo"

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "My Groups", href: "/groups", icon: Users },
  { label: "Assignments", href: "/assignments", icon: BookOpen },
  { label: "AI Teacher's Toolkit", href: "/toolkit", icon: Sparkles },
  { label: "My Library", href: "/library", icon: Library },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:flex md:w-[220px] md:flex-col md:border-r md:border-sidebar-border md:bg-sidebar md:px-4 md:py-6">
      <VedaLogo className="px-2" />

      <Button asChild className="mt-6 w-full rounded-full">
        <Link href="/assignments/create">+ Create Assignment</Link>
      </Button>

      <nav className="mt-6 flex flex-1 flex-col gap-1">
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
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground/80 transition",
                isActive ? "bg-primary/10 text-primary" : "hover:bg-muted"
              )}
            >
              <Icon className="size-4" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto space-y-4">
        <Link
          href="/settings"
          className="flex items-center gap-2 px-3 text-sm text-muted-foreground"
        >
          <Settings className="size-4" />
          Settings
        </Link>

        <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-3">
          <Avatar className="size-9">
            <AvatarFallback>VA</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Veda Public School
            </p>
            <p className="text-xs text-muted-foreground">Bengaluru, IN</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
