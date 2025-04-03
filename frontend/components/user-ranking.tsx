import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface UserRankingProps {
  isAdmin?: boolean
}

export default function UserRanking({ isAdmin = false }: UserRankingProps) {
  // Dados simulados
  const topUsers = [
    {
      position: 1,
      name: "Carlos Silva",
      points: 1850,
      distance: "125.7km",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      position: 2,
      name: "Ana Beatriz",
      points: 1720,
      distance: "118.2km",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      position: 3,
      name: "Ricardo Oliveira",
      points: 1685,
      distance: "112.4km",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      position: 4,
      name: "Mariana Santos",
      points: 1610,
      distance: "103.8km",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      position: 5,
      name: "Pedro Almeida",
      points: 1550,
      distance: "97.5km",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  return (
    <div className="w-full space-y-4">
      <div className="flex overflow-x-auto pb-4">
        <div className="flex gap-4">
          {topUsers.slice(0, 3).map((user) => (
            <Card key={user.position} className="relative min-w-[260px] shadow-md">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform">
                <Badge className="px-3 py-1 text-base font-bold">#{user.position}</Badge>
              </div>
              <CardContent className="pt-8">
                <div className="flex flex-col items-center">
                  <Avatar className="mb-2 h-20 w-20 border-4 border-primary">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold">{user.name}</h3>
                  <div className="my-2 text-center">
                    <p className="text-2xl font-bold text-primary">{user.points}</p>
                    <p className="text-sm text-muted-foreground">pontos</p>
                  </div>
                  <div className="text-sm text-muted-foreground">{user.distance} percorridos</div>
                  {isAdmin && (
                    <Button variant="outline" size="sm" className="mt-3">
                      Ver perfil
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {(isAdmin || topUsers.length > 3) && (
        <div className="rounded-md border">
          <div className="divide-y">
            {topUsers.slice(3).map((user) => (
              <div key={user.position} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted font-semibold">
                    {user.position}
                  </div>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.distance}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-primary">{user.points}</div>
                  <div className="text-xs text-muted-foreground">pontos</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

