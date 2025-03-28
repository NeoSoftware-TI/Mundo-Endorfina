"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Users, Gift, Settings, LogOut, BarChart } from "lucide-react"
import { toast } from "sonner"

type Admin = {
  id: string
  name: string
  email: string
  role: string
}

export function AdminNavbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [admin, setAdmin] = useState<Admin | null>(null)

  useEffect(() => {
    // Verificar se o admin está logado
    const storedAdmin = localStorage.getItem("admin")
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin))
    } else if (pathname !== "/admin/login") {
      router.push("/admin/login")
    }
  }, [pathname, router])

  const handleLogout = () => {
    localStorage.removeItem("admin")
    toast.success("Logout realizado com sucesso!")
    router.push("/admin/login")
  }

  // Não mostrar a navbar na página de login
  if (pathname === "/admin/login") {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">Mundo Endorfina</span>
            <Badge variant="outline" className="bg-primary/10 text-primary">
              Admin
            </Badge>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-2">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className={pathname === "/admin/dashboard" ? "text-primary" : "text-foreground"}
            >
              <Link href="/admin/dashboard">
                <BarChart className="h-5 w-5" />
                <span className="sr-only">Dashboard</span>
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              size="icon"
              className={pathname === "/admin/usuarios" ? "text-primary" : "text-foreground"}
            >
              <Link href="/admin/usuarios">
                <Users className="h-5 w-5" />
                <span className="sr-only">Usuários</span>
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              size="icon"
              className={pathname === "/admin/cupons" ? "text-primary" : "text-foreground"}
            >
              <Link href="/admin/cupons">
                <Gift className="h-5 w-5" />
                <span className="sr-only">Cupons</span>
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              size="icon"
              className={pathname === "/admin/configuracoes" ? "text-primary" : "text-foreground"}
            >
              <Link href="/admin/configuracoes">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Configurações</span>
              </Link>
            </Button>
          </nav>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt={admin?.name || "Admin"} />
                  <AvatarFallback>{admin?.name?.charAt(0) || "A"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex flex-col space-y-1 p-2">
                <p className="text-sm font-medium leading-none">{admin?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{admin?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin/configuracoes">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

function Badge({ className, variant, ...props }: React.ComponentProps<"div"> & { variant?: "default" | "outline" }) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium",
        variant === "outline" ? "border" : "bg-primary text-primary-foreground",
        className,
      )}
      {...props}
    />
  )
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

