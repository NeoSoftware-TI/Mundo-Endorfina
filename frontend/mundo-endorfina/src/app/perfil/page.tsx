"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Activity, Award, Calendar, Edit, MapPin, Timer, TrendingUp } from "lucide-react"
import { PostCard } from "@/components/post-card"

type UserProfile = {
  id: string
  name: string
  email: string
  role: string
  points: number
  bio?: string
  location?: string
  joinedDate: string
  stats: {
    totalDistance: number
    totalRuns: number
    avgPace: string
    bestPace: string
  }
  badges: string[]
}

// Dados simulados
const mockPosts = [
  {
    id: "1",
    user: {
      id: "1",
      name: "Usuário Teste",
      avatar: "/placeholder.svg",
    },
    date: "2023-05-15T10:30:00",
    content: "Minha corrida de hoje foi incrível! Consegui bater meu recorde pessoal.",
    distance: 5.2,
    time: "25:30",
    pace: "4:54",
    image: "/placeholder.svg?height=400&width=600",
    likes: 24,
    comments: [
      {
        id: "c1",
        user: {
          id: "2",
          name: "Maria Silva",
          avatar: "/placeholder.svg",
        },
        content: "Parabéns pelo recorde! Continue assim!",
        date: "2023-05-15T11:15:00",
      },
    ],
  },
  {
    id: "2",
    user: {
      id: "1",
      name: "Usuário Teste",
      avatar: "/placeholder.svg",
    },
    date: "2023-05-14T08:45:00",
    content: "Corrida matinal para começar bem o dia!",
    distance: 3.8,
    time: "19:15",
    pace: "5:04",
    image: "/placeholder.svg?height=400&width=600",
    likes: 18,
    comments: [],
  },
]

export default function PerfilPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    // Simulando carregamento do perfil
    setTimeout(() => {
      setProfile({
        id: "1",
        name: "Usuário Teste",
        email: "usuario@teste.com",
        role: "user",
        points: 150,
        bio: "Corredor amador apaixonado por trilhas e maratonas. Sempre em busca de superar meus limites!",
        location: "São Paulo, SP",
        joinedDate: "2023-01-15",
        stats: {
          totalDistance: 156.8,
          totalRuns: 23,
          avgPace: "5:12",
          bestPace: "4:45",
        },
        badges: ["Maratonista", "Velocista", "Corredor Noturno"],
      })
    }, 500)
  }, [])

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse-slow text-lg">Carregando perfil...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Avatar className="h-24 w-24 border-2 border-primary">
              <AvatarImage src="/placeholder.svg" alt={profile.name} />
              <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <h1 className="text-2xl font-bold">{profile.name}</h1>
                  <p className="text-muted-foreground">{profile.email}</p>
                </div>
                <Button variant="outline" className="w-full md:w-auto">
                  <Edit className="mr-2 h-4 w-4" />
                  Editar Perfil
                </Button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {profile.badges.map((badge) => (
                  <Badge key={badge} variant="secondary">
                    {badge}
                  </Badge>
                ))}
              </div>

              <div className="mt-4 space-y-2">
                {profile.bio && <p>{profile.bio}</p>}

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                  {profile.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Entrou em {new Date(profile.joinedDate).toLocaleDateString("pt-BR")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="h-4 w-4 text-primary" />
                    <span className="font-medium text-primary">{profile.points} pontos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Distância
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.stats.totalDistance} km</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Corridas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.stats.totalRuns}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Timer className="h-4 w-4 text-primary" />
              Ritmo Médio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.stats.avgPace} min/km</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Melhor Ritmo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.stats.bestPace} min/km</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="atividades">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="atividades">Atividades</TabsTrigger>
          <TabsTrigger value="conquistas">Conquistas</TabsTrigger>
        </TabsList>
        <TabsContent value="atividades" className="mt-4 space-y-4">
          {mockPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
          <div className="flex justify-center">
            <Button variant="outline">Carregar mais</Button>
          </div>
        </TabsContent>
        <TabsContent value="conquistas" className="mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="text-center p-4">
                <div className="flex justify-center mb-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="font-medium">Conquista {i + 1}</h3>
                <p className="text-xs text-muted-foreground mt-1">{i % 2 === 0 ? "Completada" : "Em progresso"}</p>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

