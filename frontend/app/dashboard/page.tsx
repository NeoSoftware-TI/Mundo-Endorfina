import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import UserRanking from "@/components/user-ranking"
import ActivityCard from "@/components/activity-card"
import Link from "next/link"
// asdas
export default function DashboardPage() {
  return (
    <div className="container mx-auto p-4 py-6">
      <h1 className="mb-8 text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Pontos Acumulados</CardTitle>
            <CardDescription>Total de pontos disponíveis para trocar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">1.250</div>
            <Button variant="outline" size="sm" className="mt-4 w-full">
              Resgatar cupons
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Meta Semanal</CardTitle>
            <CardDescription>40km de 50km concluídos</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={80} className="h-3 w-full" />
            <p className="mt-2 text-sm text-muted-foreground">Faltam 10km para atingir sua meta</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Próximo Nível</CardTitle>
            <CardDescription>Corredor Avançado</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={65} className="h-3 w-full" />
            <p className="mt-2 text-sm text-muted-foreground">750 pontos para o próximo nível</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Próximo Nível</CardTitle>
            <CardDescription>Corredor Avançado</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={65} className="h-3 w-full" />
            <p className="mt-2 text-sm text-muted-foreground">750 pontos para o próximo nível</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-2xl font-semibold">Ranking</h2>
        <UserRanking />
      </div>

      <div className="mt-8">
        <Tabs defaultValue="atividades">
          <TabsList className="mb-4">
            <TabsTrigger value="atividades">Suas Atividades</TabsTrigger>
            <TabsTrigger value="conquistas">Conquistas</TabsTrigger>
            <TabsTrigger value="maps">Mapa</TabsTrigger>
          </TabsList>
          <TabsContent value="atividades" className="space-y-4">
            <div className="flex justify-between">
              <h2 className="text-2xl font-semibold">Atividades Recentes</h2>
              <Button asChild>
                <Link href="/atividades/nova">Nova Atividade</Link>
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <ActivityCard
                id="1"
                title="Corrida Matinal"
                description="Parque Ibirapuera"
                distance={5.2}
                date="Ontem"
                likes={24}
                comments={5}
                imageUrl="/placeholder.svg?height=300&width=500"
              />
              <ActivityCard
                id="2"
                title="Treino Intervalado"
                description="Pista de Atletismo"
                distance={8.5}
                date="3 dias atrás"
                likes={37}
                comments={9}
                imageUrl="/placeholder.svg?height=300&width=500"
              />
            </div>
          </TabsContent>
          <TabsContent value="conquistas">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Maratonista</CardTitle>
                  <CardDescription>Completou 42km em uma semana</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center py-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="64"
                      height="64"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <circle cx="12" cy="8" r="6"></circle>
                      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path>
                    </svg>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Madrugador</CardTitle>
                  <CardDescription>Completou 10 corridas antes das 7h</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center py-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="64"
                      height="64"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Velocista</CardTitle>
                  <CardDescription>Atingiu a velocidade de 4:30 min/km</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center py-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="64"
                      height="64"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="m8 16 3-8 3 8"></path>
                      <path d="M18.685 18.059a9.94 9.94 0 0 0 1.314-4.958"></path>
                      <path d="M5.341 14.69a9.981 9.981 0 0 0 2.774 3.384"></path>
                      <path d="M8.12 8.11a9.966 9.966 0 0 0-2.779 3.384"></path>
                      <path d="M18.69 9.998a9.94 9.94 0 0 0-1.313-4.958"></path>
                      <path d="M9.5 2.686A10 10 0 0 1 22.32 11.03"></path>
                      <path d="M14.54 21.32A10 10 0 0 1 1.72 12.967"></path>
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent> 
          <TabsContent value="maps" className="space-y-4"> {/* Iniciar o Maps */}
            <div className="flex justify-between">
              <h2 className="text-2xl font-semibold">Atividades Recentes</h2>
              <Button asChild>
                <Link href="/atividades/nova">Nova Atividade</Link>
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <ActivityCard
                id="1"
                title="Corrida Matinal"
                description="Parque Ibirapuera"
                distance={5.2}
                date="Ontem"
                likes={24}
                comments={5}
                imageUrl="/placeholder.svg?height=300&width=500"
              />
              <ActivityCard
                id="2"
                title="Treino Intervalado"
                description="Pista de Atletismo"
                distance={8.5}
                date="3 dias atrás"
                likes={37}
                comments={9}
                imageUrl="/placeholder.svg?height=300&width=500"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

