import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { Navbar } from "@/components/navbar"
import { SidebarProvider } from "@/components/sidebar"

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex">
          <AppSidebar />
          <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}

