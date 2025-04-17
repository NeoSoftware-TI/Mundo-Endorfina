"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, MessageCircle, MoreHorizontal, Share2, ThumbsDown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface PostType {
  id: string
  pessoas: {
    name: string
    avatar: string
  }
  date: string
  content: string
  images: string[]
  distance: number
  time: string
  pace: string
  likes: number
}

interface PostCardProps {
  post: PostType
}

export function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(post.likes)
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState("")

  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1)
    } else {
      setLikes(likes + 1)
    }
    setLiked(!liked)
  }

  const handleAddComment = () => {
    if (commentText.trim() === "") return
    // Em um cenário real, enviaríamos o comentário para um backend
    setCommentText("")
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={post.pessoas.avatar} alt={post.pessoas.name} />
              <AvatarFallback>{post.pessoas.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{post.pessoas.name}</p>
              <p className="text-xs text-muted-foreground">{post.date}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Salvar post</DropdownMenuItem>
              <DropdownMenuItem>Copiar link</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Denunciar</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="px-4 py-0" >
        <p className="mb-4 text-sm">{post.content}</p>
        {post.images.map((image, index) => (
          <div key={index} className="relative mb-4 h-80 w-full overflow-hidden rounded-md">
            <Image
              src={image || "/placeholder.svg"}
              alt={`Imagem da atividade de ${post.pessoas.name}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
        <div className="mb-4 grid grid-cols-3 gap-2 rounded-md bg-muted p-3 text-center text-sm">
          <div>
            <p className="font-semibold text-primary">{post.distance} km</p>
            <p className="text-xs text-muted-foreground">Distância</p>
          </div>
          <div>
            <p className="font-semibold text-primary">{post.time}</p>
            <p className="text-xs text-muted-foreground">Tempo</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col p-4">
        <div className="flex w-full items-center justify-between">
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className={cn("flex items-center gap-1", liked && "text-primary")}
              onClick={handleLike}
            >
              <Heart className="h-4 w-4" fill={liked ? "currentColor" : "none"} />
              <span>{likes}</span>
            </Button>
          </div>
          <div className="flex space-x-1">
            <Button variant="ghost" size="sm">
              <ThumbsDown className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {showComments && (
          <div className="mt-4 w-full space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Avatar className="h-7 w-7">
                  <AvatarFallback>U1</AvatarFallback>
                </Avatar>
                <div className="rounded-md bg-muted p-2 text-sm">
                  <p className="font-medium">Maria Fernandes</p>
                  <p>Parabéns pela corrida! 🎉 Esse pace está incrível!</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Avatar className="h-7 w-7">
                  <AvatarFallback>U2</AvatarFallback>
                </Avatar>
                <div className="rounded-md bg-muted p-2 text-sm">
                  <p className="font-medium">João Paulo</p>
                  <p>Como está o seu tênis novo? Valeu a pena o investimento?</p>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Avatar className="h-7 w-7">
                <AvatarFallback>ME</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Textarea
                  placeholder="Adicione um comentário..."
                  className="min-h-8 resize-none"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <Button size="sm" onClick={handleAddComment}>
                  Comentar
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

