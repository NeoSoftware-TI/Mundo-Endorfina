"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Home,
  Trophy,
  User,
  Settings,
  PlusCircle,
  BarChart3,
  MapPin,
  Gift,
  LogOut,
  Calendar,
  ChevronLeft,
  ChevronRight,
  LightbulbIcon,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/sidebar"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type UserType = {
  id: string
  name: string
  email: string
  role: string
  points: number
}

// Dicas do dia
const dailyTips = [
  "Beba água antes, durante e depois da corrida para manter-se hidratado.",
  "Alongue-se por pelo menos 10 minutos antes de começar a correr.",
  "Respire pelo nariz e exale pela boca para melhor oxigenação.",
  "Mantenha uma postura ereta enquanto corre para evitar lesões.",
  "Alterne entre corrida e caminhada se estiver começando.",
  "Use tênis adequados para o seu tipo de pisada.",
  "Aumente gradualmente a distância percorrida a cada semana.",
  "Descanse pelo menos um dia entre corridas intensas.",
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<UserType | null>(null)
  const [collapsed, setCollapsed] = useState(false)
  const {  setOpen } = useSidebar()
  const [dailyTip, setDailyTip] = useState("")

  useEffect(() => {
    // Verificar se o usuário está logado
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    // Selecionar uma dica aleatória do dia
    const randomTip = dailyTips[Math.floor(Math.random() * dailyTips.length)]
    setDailyTip(randomTip)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    toast.success("Logout realizado com sucesso!")
    router.push("/login")
  }

  const toggleSidebar = () => {
    setOpen(!collapsed)
    setCollapsed(!collapsed)
  }

  // Não mostrar a sidebar na página inicial, login ou registro
  if (
    pathname === "/" ||
    pathname.includes("/login") ||
    pathname.includes("/registro") ||
    pathname.includes("/admin")
  ) {
    return null
  }

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader className="border-b pb-2">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-primary p-1">
              <Home className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg">Mundo Endorfina</span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggleSidebar}>
                  {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">{collapsed ? "Expandir sidebar" : "Minimizar sidebar"}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard"} tooltip="Dashboard">
                  <Link href="/dashboard">
                    <BarChart3 className="text-primary" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/ranking"} tooltip="Ranking">
                  <Link href="/ranking">
                    <Trophy className="text-primary" />
                    <span>Ranking</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/perfil"} tooltip="Perfil">
                  <Link href="/perfil">
                    <User className="text-primary" />
                    <span>Perfil</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/nova-corrida"} tooltip="Nova Corrida">
                  <Link href="/nova-corrida">
                    <PlusCircle className="text-primary" />
                    <span>Nova Corrida</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {user && (
          <SidebarGroup>
            <SidebarGroupLabel>Meu Progresso</SidebarGroupLabel>
            <SidebarGroupContent className="space-y-4 px-2">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Pontos</span>
                  <span className="font-medium">{user.points}</span>
                </div>
                <Progress value={user.points % 100} className="h-1.5" />
              </div>

              <div className="bg-muted/50 rounded-md p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs">
                    <MapPin className="h-3 w-3 text-primary" />
                    <span className="font-medium">Meta Mensal: 50km</span>
                  </div>
                  <span className="text-xs font-medium">32/50 km</span>
                </div>
                <Progress value={64} className="h-1.5" />
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>Próximo Evento</SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <Card className="p-3 bg-primary/5 border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Corrida pela Saúde</span>
              </div>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Data:</span>
                  <span>15/06/2023</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Local:</span>
                  <span>Parque Ibirapuera</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Distância:</span>
                  <span>5km / 10km</span>
                </div>
              </div>
              <Button variant="link" size="sm" className="p-0 h-auto mt-2 text-primary">
                Ver detalhes
              </Button>
            </Card>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Cupons Disponíveis</SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <div className="space-y-2">
              <div className="rounded-md border p-2 bg-sidebar-accent">
                <div className="flex items-center gap-2">
                  <Gift className="h-4 w-4 text-primary" />
                  <div className="flex-1">
                    <p className="text-xs font-medium">Desconto 15%</p>
                    <p className="text-xs text-muted-foreground">200 pontos</p>
                  </div>
                  <Badge variant="outline" className="text-xs bg-primary/10 text-primary">
                    Novo
                  </Badge>
                </div>
              </div>

              <div className="rounded-md border p-2">
                <div className="flex items-center gap-2">
                  <Gift className="h-4 w-4 text-primary" />
                  <div className="flex-1">
                    <p className="text-xs font-medium">Frete Grátis</p>
                    <p className="text-xs text-muted-foreground">150 pontos</p>
                  </div>
                </div>
              </div>
            </div>
            <Button variant="link" size="sm" className="p-0 h-auto mt-2 text-primary">
              Ver todos os cupons
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Dica do Dia</SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <div className="rounded-md border p-3 bg-amber-50 border-amber-200">
              <div className="flex gap-2">
                <LightbulbIcon className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800">{dailyTip}</p>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t pt-2">
        {user && (
          <div className="px-2 mb-2">
            <div className="flex items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/configuracoes"} tooltip="Configurações">
              <Link href="/configuracoes">
                <Settings className="text-muted-foreground" />
                <span>Configurações</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} tooltip="Sair">
              <LogOut className="text-muted-foreground" />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

