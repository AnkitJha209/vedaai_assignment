"use client"

import { Bell, ChevronDown, ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuthStore } from "@/lib/auth-store"

type TopBarProps = {
  breadcrumbLabel: string
  onBackHref?: string
}

export function TopBar({ breadcrumbLabel }: TopBarProps) {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const clearUser = useAuthStore((state) => state.clearUser)
  const displayName = user
    ? `${user.firstName} ${user.lastName}`.trim()
    : "Teacher"
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } catch (error) {
      console.error(error)
    } finally {
      clearUser()
      router.push("/signin")
      router.refresh()
    }
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <ChevronLeft className="size-4" />
        <span>{breadcrumbLabel}</span>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="rounded-full border border-border bg-card p-2 text-muted-foreground"
        >
          <Bell className="size-4" />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground">
            <Avatar className="size-7">
              <AvatarFallback>{initials || "U"}</AvatarFallback>
            </Avatar>
            <span className="hidden sm:block">{displayName}</span>
            <ChevronDown className="size-3" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
