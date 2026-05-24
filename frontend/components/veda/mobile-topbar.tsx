"use client"

import { Bell, Menu } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { VedaLogo } from "@/components/veda/logo"

export function MobileTopBar() {
  return (
    <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3 md:hidden">
      <VedaLogo />
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-full border border-border bg-card p-2 text-muted-foreground"
        >
          <Bell className="size-4" />
        </button>
        <Avatar className="size-7">
          <AvatarFallback>TS</AvatarFallback>
        </Avatar>
        <button
          type="button"
          className="rounded-full border border-border bg-card p-2 text-muted-foreground"
        >
          <Menu className="size-4" />
        </button>
      </div>
    </div>
  )
}
