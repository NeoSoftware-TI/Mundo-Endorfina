import { Button } from "@/components/ui/button"
import { PostCard } from "@/components/post-card"
import Link from "next/link"

const posts = [
  {
    id: "1",
    author: {
      name: "Carlos Silva",
      avatar: "/placeholder.svg?height=48&width=48",
    },
    date: "há 2 horas",
    content:
      "Completei minha primeira meia-maratona hoje! Muito orgulhoso da minha evolução nos últimos meses. O treinamento valeu a pena!",
    images: ["/placeholder.svg?height=400&width=600"],
    distance: 21.1,
    time: "1h 45min",
    pace: "5:02 min/km",
    likes: 42,
    comments: 7,
  },
  {
    id: "2",
    author: {
      name: "Ana Beatriz",
      avatar: "/placeholder.svg?height=48&width=48",
    },
    date: "há 5 horas",
    content: "Treino matinal com vista para o mar. Nada melhor para começar o dia com energia!",
    images: ["/placeholder.svg?height=400&width=600"],
    distance: 8.5,
    time: "42min",
    pace: "4:56 min/km",
    likes: 28,
    comments: 3,
  },
  {
    id: "3",
    author: {
      name: "Ricardo Oliveira",
      avatar: "/placeholder.svg?height=48&width=48",
    },
    date: "há 1 dia",
    content: "Treino intervalado concluído. Hoje foi puxado, mas o resultado valeu cada gota de suor!",
    images: ["/placeholder.svg?height=400&width=600"],
    distance: 10.2,
    time: "48min",
    pace: "4:42 min/km",
    likes: 35,
    comments: 5,
  },
]

export default function FeedPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Feed de Atividades</h1>
        <Button asChild>
          <Link href="/atividades/nova">Nova Atividade</Link>
        </Button>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}

