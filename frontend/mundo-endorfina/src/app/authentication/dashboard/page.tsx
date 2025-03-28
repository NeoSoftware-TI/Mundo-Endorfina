"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Activity, Award, Trophy } from "lucide-react"
import Link from "next/link"
import { PostCard } from "@/components/post-card"
import { motion } from "framer-motion"

type User = {
  id: string
  name: string
  email: string
  role: string
  points: number
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
    additionalImages: ["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"],
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
      id: "3",
      name: "João Oliveira",
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

const mockGoals = [
  {
    id: "1",
    title: "Correr 50km no mês",
    current: 32,
    target: 50,
    unit: "km",
    reward: 100,
  },
  {
    id: "2",
    title: "Completar 10 corridas",
    current: 7,
    target: 10,
    unit: "corridas",
    reward: 150,
  },
  {
    id: "3",
    title: "Manter ritmo abaixo de 5min/km",
    current: 4,
    target: 5,
    unit: "corridas",
    reward: 200,
  },
]

const mockStats = {
  totalDistance: 156.8,
  totalRuns: 23,
  avgPace: "5:12",
  bestPace: "4:45",
  thisMonth: {
    distance: 32.5,
    runs: 7,
  },
  lastMonth: {
    distance: 48.2,
    runs: 9,
  },
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Verificar se o usuário está logado
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  // Animação para os cards
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  }

  return (
    <div className="space-y-6">
      <motion.div className="flex flex-col md:flex-row gap-6" variants={container} initial="hidden" animate="show">
        <motion.div variants={item} className="flex-1">
          <Card className="card-hover-effect h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Resumo de Atividades
              </CardTitle>
              <CardDescription>Seu progresso e estatísticas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Distância Total</span>
                  <span className="text-2xl font-bold">{mockStats.totalDistance} km</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Corridas</span>
                  <span className="text-2xl font-bold">{mockStats.totalRuns}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Ritmo Médio</span>
                  <span className="text-2xl font-bold">{mockStats.avgPace} min/km</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Melhor Ritmo</span>
                  <span className="text-2xl font-bold">{mockStats.bestPace} min/km</span>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium mb-2">Este mês vs. Mês anterior</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Distância</span>
                      <span className="text-sm font-medium">{mockStats.thisMonth.distance} km</span>
                    </div>
                    <Progress
                      value={(mockStats.thisMonth.distance / mockStats.lastMonth.distance) * 100}
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Corridas</span>
                      <span className="text-sm font-medium">{mockStats.thisMonth.runs}</span>
                    </div>
                    <Progress value={(mockStats.thisMonth.runs / mockStats.lastMonth.runs) * 100} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item} className="w-full md:w-80">
          <Card className="card-hover-effect h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Ranking
              </CardTitle>
              <CardDescription>Top 5 corredores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 group hover:bg-muted/50 p-2 rounded-md transition-colors"
                  >
                    <div
                      className={`flex items-center justify-center w-6 h-6 rounded-full ${i < 3 ? "bg-primary/10 text-primary" : "bg-muted"} text-sm font-medium group-hover:bg-primary/20 transition-colors`}
                    >
                      {i + 1}
                    </div>
                    <Avatar className="h-8 w-8 border border-primary/20">
                      <AvatarImage src="/placeholder.svg" alt={`Usuário ${i + 1}`} />
                      <AvatarFallback>{i + 1}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Usuário {i + 1}</p>
                      <p className="text-xs text-muted-foreground">{23 - i} corridas</p>
                    </div>
                    <div className="text-sm font-medium text-primary">{1000 - i * 50} pts</div>
                  </div>
                ))}
              </div>
              <Button asChild variant="outline" className="w-full mt-4 button-hover-effect">
                <Link href="/ranking">Ver ranking completo</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {mockGoals.map((goal) => (
          <motion.div key={goal.id} variants={item}>
            <Card className="card-hover-effect">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{goal.title}</CardTitle>
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    +{goal.reward} pts
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Progresso</span>
                    <span className="text-sm font-medium">
                      {goal.current} / {goal.target} {goal.unit}
                    </span>
                  </div>
                  <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <Tabs defaultValue="feed">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="feed">Feed de Atividades</TabsTrigger>
          <TabsTrigger value="achievements">Conquistas</TabsTrigger>
        </TabsList>
        <TabsContent value="feed" className="mt-4 space-y-4">
          {mockPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
          <div className="flex justify-center">
            <Button variant="outline" className="button-hover-effect">
              Carregar mais
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="achievements" className="mt-4">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div key={i} variants={item}>
                <Card className="text-center p-4 card-hover-effect">
                  <div className="flex justify-center mb-2">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-medium">Conquista {i + 1}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{i % 2 === 0 ? "Completada" : "Em progresso"}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

