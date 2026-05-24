"use client"

import { useEffect } from "react"
import { Sidebar } from "@/components/veda/sidebar"
import { MobileNav } from "@/components/veda/mobile-nav"
import { MobileTopBar } from "@/components/veda/mobile-topbar"
import { useAuthStore } from "@/lib/auth-store"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const loadUser = useAuthStore((state) => state.loadUser)

  useEffect(() => {
    loadUser()
  }, [loadUser])

  return (
    <div className="min-h-svh bg-[#f5f5f5]">
      <Sidebar />
      <MobileTopBar />
      <div className="md:pl-[220px]">
        <main className="min-h-svh px-4 pt-6 pb-24 md:h-svh md:overflow-y-auto md:px-8 md:pt-8">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
