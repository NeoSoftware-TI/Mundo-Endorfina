"use client"

import React from "react"

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
import {
  Home,
  Trophy,
  User,
  Settings,
  LogOut,
  PlusCircle,
  Bell,
  Search,
  Menu,
  Calendar,
  Gift,
  BarChart3,
} from "lucide-react"
import { toast } from "sonner"
import { SidebarTrigger } from "@/components/sidebar"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

type UserType = {
  id: string
  name: string
  email: string
  role: string
  points: number
}

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<UserType | null>(null)
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    // Verificar se o usuário está logado
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else if (
      !pathname.includes("/login") &&
      !pathname.includes("/registro") &&
      !pathname.includes("/admin") &&
      pathname !== "/"
    ) {
      router.push("/login")
    }

    const handleScroll = () => {
      setScrollPosition(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [pathname, router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    toast.success("Logout realizado com sucesso!")
    router.push("/login")
  }

  // Não mostrar a navbar na página inicial, login ou registro
  if (pathname === "/" || pathname.includes("/login") || pathname.includes("/registro")) {
    return null
  }

  // Determinar se o navbar deve ter sombra baseado na posição de scroll
  const navbarClass = scrollPosition > 10 ? "shadow-md" : ""

  const menuItems = [
    { name: "Dashboard", icon: <Home className="h-5 w-5" />, path: "/dashboard" },
    { name: "Ranking", icon: <Trophy className="h-5 w-5" />, path: "/ranking" },
    { name: "Perfil", icon: <User className="h-5 w-5" />, path: "/perfil" },
    { name: "Nova Corrida", icon: <PlusCircle className="h-5 w-5" />, path: "/nova-corrida" },
    { name: "Eventos", icon: <Calendar className="h-5 w-5" />, path: "/eventos" },
    { name: "Cupons", icon: <Gift className="h-5 w-5" />, path: "/cupons" },
    { name: "Estatísticas", icon: <BarChart3 className="h-5 w-5" />, path: "/estatisticas" },
    { name: "Configurações", icon: <Settings className="h-5 w-5" />, path: "/configuracoes" },
  ]

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full border-b bg-background transition-shadow duration-200 ${navbarClass}`}
      >
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="md:hidden">
              <SidebarTrigger />
            </div>
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="rounded-full bg-primary p-1.5 hidden md:flex">
                <Home className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold text-primary">Mundo Endorfina</span>
            </Link>
          </div>

          {/* Menu principal - visível apenas em telas médias e grandes */}
          <nav className="hidden md:flex items-center gap-4">
            {menuItems.slice(0, 4).map((item) => (
              <Button
                key={item.path}
                asChild
                variant="ghost"
                className={pathname === item.path ? "text-primary" : "text-foreground"}
              >
                <Link href={item.path}>
                  {React.cloneElement(item.icon, { className: "h-5 w-5 mr-1" })}
                  <span>{item.name}</span>
                </Link>
              </Button>
            ))}

            {/* Menu dropdown para mais opções */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  <Menu className="h-5 w-5 mr-1" />
                  <span>Mais</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {menuItems.slice(4).map((item) => (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link href={item.path} className="flex items-center">
                      {React.cloneElement(item.icon, { className: "h-4 w-4 mr-2" })}
                      <span>{item.name}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-muted rounded-full px-3 py-1.5 hover:bg-muted/80 transition-colors cursor-pointer">
              <Search className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Pesquisar...</span>
            </div>

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                3
              </span>
              <span className="sr-only">Notificações</span>
            </Button>

            {/* Menu móvel - visível apenas em telas pequenas */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <div className="py-4 space-y-4">
                  <div className="flex items-center gap-3 mb-6">
                    <Avatar className="h-10 w-10 border border-primary/20">
                      <AvatarImage src="/placeholder.svg" alt={user?.name || "Avatar"} />
                      <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.points} pontos</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    {menuItems.map((item) => (
                      <Button
                        key={item.path}
                        asChild
                        variant="ghost"
                        className={`w-full justify-start ${pathname === item.path ? "bg-muted" : ""}`}
                      >
                        <Link href={item.path}>
                          {React.cloneElement(item.icon, { className: "h-5 w-5 mr-2" })}
                          <span>{item.name}</span>
                        </Link>
                      </Button>
                    ))}

                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-5 w-5 mr-2" />
                      <span>Sair</span>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8 border border-primary/20">
                    <AvatarImage src="/placeholder.svg" alt={user?.name || "Avatar"} />
                    <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  {user?.points !== undefined && (
                    <p className="text-xs font-medium text-primary mt-1">{user.points} pontos</p>
                  )}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/perfil">
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/configuracoes">
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

      {/* Ranking rolante horizontal */}
      {pathname !== "/configuracoes" && (
        <div className="w-full bg-muted py-2 border-b overflow-hidden">
          <div className="container">
            <div className="scrolling-wrapper">
              <div className="scrolling-content">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="ranking-item flex items-center gap-2 whitespace-nowrap">
                    <span className={`font-bold ${i < 3 ? "text-primary" : ""}`}>{i + 1}.</span>
                    <Avatar className="h-6 w-6 border border-primary/20">
                      <AvatarImage src="/placeholder.svg" alt={`Usuário ${i + 1}`} />
                      <AvatarFallback>{i + 1}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">Usuário {i + 1}</span>
                    <Badge variant="outline" className="text-xs bg-primary/10 text-primary">
                      {1000 - i * 50} pts
                    </Badge>
                  </div>
                ))}
              </div>
              <div className="scrolling-content" aria-hidden="true">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="ranking-item flex items-center gap-2 whitespace-nowrap">
                    <span className={`font-bold ${i < 3 ? "text-primary" : ""}`}>{i + 1}.</span>
                    <Avatar className="h-6 w-6 border border-primary/20">
                      <AvatarImage src="/placeholder.svg" alt={`Usuário ${i + 1}`} />
                      <AvatarFallback>{i + 1}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">Usuário {i + 1}</span>
                    <Badge variant="outline" className="text-xs bg-primary/10 text-primary">
                      {1000 - i * 50} pts
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

