"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Trophy, Medal, MapPin, Award } from "lucide-react"
import { motion } from "framer-motion"

// Dados simulados
const mockUsers = Array.from({ length: 20 }).map((_, i) => ({
  id: `${i + 1}`,
  name: `Usuário ${i + 1}`,
  avatar: "/placeholder.svg",
  points: 1000 - i * 35,
  distance: 150 - i * 5,
  runs: 25 - i,
  badges: i < 3 ? ["Maratonista", "Velocista"] : i < 10 ? ["Maratonista"] : [],
}))

export default function RankingPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredUsers = mockUsers.filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()))

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
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <h1 className="text-3xl font-bold gradient-text">Ranking</h1>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar usuário..."
            className="pl-8 transition-all focus:ring-2 focus:ring-primary/30"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {[0, 1, 2].map((index) => (
          <motion.div key={index} variants={item}>
            <Card className={`card-hover-effect overflow-hidden ${index === 0 ? "border-primary" : ""}`}>
              <div
                className={`h-1 w-full ${index === 0 ? "bg-primary" : index === 1 ? "bg-gray-400" : "bg-amber-700"}`}
              ></div>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  {index === 0 ? (
                    <Trophy className="h-5 w-5 text-yellow-500" />
                  ) : index === 1 ? (
                    <Medal className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Medal className="h-5 w-5 text-amber-700" />
                  )}
                  {index + 1}º Lugar
                </CardTitle>
                <CardDescription>
                  {index === 0 ? "Campeão" : index === 1 ? "Vice-campeão" : "Terceiro lugar"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-2 border-primary">
                    <AvatarImage src={mockUsers[index].avatar} alt={mockUsers[index].name} />
                    <AvatarFallback>{mockUsers[index].name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-lg">{mockUsers[index].name}</h3>
                    <div className="flex gap-1 mt-1">
                      {mockUsers[index].badges.map((badge) => (
                        <Badge key={badge} variant="secondary" className="text-xs">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-primary font-bold mt-1">{mockUsers[index].points} pontos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <Tabs defaultValue="points">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="points">Por Pontos</TabsTrigger>
          <TabsTrigger value="distance">Por Distância</TabsTrigger>
          <TabsTrigger value="runs">Por Corridas</TabsTrigger>
        </TabsList>
        <TabsContent value="points" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredUsers.map((user, index) => (
                  <div key={user.id} className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full ${index < 3 ? "bg-primary/10 text-primary" : "bg-muted"} text-sm font-medium`}
                    >
                      {index + 1}
                    </div>
                    <Avatar className="h-10 w-10 border border-primary/20">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{user.name}</p>
                      <div className="flex gap-1 mt-1">
                        {user.badges.map((badge) => (
                          <Badge key={badge} variant="secondary" className="text-xs">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-primary" />
                      <span className="font-bold text-primary">{user.points} pts</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="distance" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {[...filteredUsers]
                  .sort((a, b) => b.distance - a.distance)
                  .map((user, index) => (
                    <div key={user.id} className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full ${index < 3 ? "bg-primary/10 text-primary" : "bg-muted"} text-sm font-medium`}
                      >
                        {index + 1}
                      </div>
                      <Avatar className="h-10 w-10 border border-primary/20">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{user.name}</p>
                        <div className="flex gap-1 mt-1">
                          {user.badges.map((badge) => (
                            <Badge key={badge} variant="secondary" className="text-xs">
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="font-bold text-primary">{user.distance} km</span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="runs" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {[...filteredUsers]
                  .sort((a, b) => b.runs - a.runs)
                  .map((user, index) => (
                    <div key={user.id} className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full ${index < 3 ? "bg-primary/10 text-primary" : "bg-muted"} text-sm font-medium`}
                      >
                        {index + 1}
                      </div>
                      <Avatar className="h-10 w-10 border border-primary/20">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{user.name}</p>
                        <div className="flex gap-1 mt-1">
                          {user.badges.map((badge) => (
                            <Badge key={badge} variant="secondary" className="text-xs">
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-primary" />
                        <span className="font-bold text-primary">{user.runs} corridas</span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

