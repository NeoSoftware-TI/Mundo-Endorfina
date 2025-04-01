"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const topRunners = [
  { id: "1", name: "Carlos Silva", distance: "120.5km", avatar: "/placeholder.svg?height=32&width=32" },
  { id: "2", name: "Ana Beatriz", distance: "112.3km", avatar: "/placeholder.svg?height=32&width=32" },
  { id: "3", name: "Ricardo Oliveira", distance: "98.7km", avatar: "/placeholder.svg?height=32&width=32" },
  { id: "4", name: "Mariana Santos", distance: "95.2km", avatar: "/placeholder.svg?height=32&width=32" },
  { id: "5", name: "Pedro Almeida", distance: "89.4km", avatar: "/placeholder.svg?height=32&width=32" },
  { id: "6", name: "Fernanda Lima", distance: "85.1km", avatar: "/placeholder.svg?height=32&width=32" },
  { id: "7", name: "Lucas Mendes", distance: "82.9km", avatar: "/placeholder.svg?height=32&width=32" },
  { id: "8", name: "Juliana Costa", distance: "79.3km", avatar: "/placeholder.svg?height=32&width=32" },
]

export default function RankingMarquee() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Não mostrar em páginas de configurações
    setIsVisible(!pathname.includes("/configuracoes"))
  }, [pathname])

  if (!isVisible) return null

  return (
    <div className="bg-primary/10 py-2">
      <div className="flex w-full items-center space-x-6 overflow-hidden">
        <div className="flex min-w-full animate-[marquee_30s_linear_infinite] items-center space-x-6">
          {topRunners.map((runner, index) => (
            <div key={runner.id} className="flex items-center space-x-2">
              <span className="font-semibold text-primary">#{index + 1}</span>
              <Avatar className="h-6 w-6">
                <AvatarImage src={runner.avatar} alt={runner.name} />
                <AvatarFallback>{runner.name[0]}</AvatarFallback>
              </Avatar>
              <span className="whitespace-nowrap font-medium">{runner.name}</span>
              <span className="whitespace-nowrap text-sm text-muted-foreground">{runner.distance}</span>
            </div>
          ))}
        </div>
        <div className="flex min-w-full animate-[marquee_30s_linear_infinite] items-center space-x-6">
          {topRunners.map((runner, index) => (
            <div key={`${runner.id}-repeat`} className="flex items-center space-x-2">
              <span className="font-semibold text-primary">#{index + 1}</span>
              <Avatar className="h-6 w-6">
                <AvatarImage src={runner.avatar} alt={runner.name} />
                <AvatarFallback>{runner.name[0]}</AvatarFallback>
              </Avatar>
              <span className="whitespace-nowrap font-medium">{runner.name}</span>
              <span className="whitespace-nowrap text-sm text-muted-foreground">{runner.distance}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

