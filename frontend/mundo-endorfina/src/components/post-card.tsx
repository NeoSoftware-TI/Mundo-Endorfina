"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Heart, MessageCircle, Share2, ThumbsDown, MapPin, Timer, TrendingUp, ImageIcon } from "lucide-react"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

type PostComment = {
  id: string
  user: {
    id: string
    name: string
    avatar: string
  }
  content: string
  date: string
}

type Post = {
  id: string
  user: {
    id: string
    name: string
    avatar: string
  }
  date: string
  content: string
  distance: number
  time: string
  pace: string
  image: string
  additionalImages?: string[]
  likes: number
  comments: PostComment[]
}

type PostCardProps = {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [showDetails, setShowDetails] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const handleLike = () => {
    setLiked(!liked)
  }

  const handleComment = () => {
    if (newComment.trim()) {
      // Em um app real, enviaríamos para o backend
      setNewComment("")
    }
  }

  const handleDislike = () => {
    // Em um app real, reportaríamos para o backend
    alert("Post reportado como fraudulento")
  }

  // Simular imagens adicionais
  const additionalImages = post.additionalImages || [
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
  ]

  return (
    <Card className="card-hover-effect overflow-hidden">
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar className="border border-primary/20">
              <AvatarImage src={post.user.avatar} alt={post.user.name} />
              <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{post.user.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.date), { addSuffix: true, locale: ptBR })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Label htmlFor={`details-${post.id}`} className="text-xs">
                Detalhes
              </Label>
              <Switch id={`details-${post.id}`} checked={showDetails} onCheckedChange={setShowDetails} />
            </div>
            <Button variant="ghost" size="icon" onClick={handleDislike}>
              <ThumbsDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <p className="mb-3">{post.content}</p>

        {showDetails ? (
          <div className="mb-4 grid grid-cols-3 gap-2 bg-muted p-3 rounded-md">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-primary">
                <MapPin className="h-4 w-4" />
                <span className="font-medium">Distância</span>
              </div>
              <span>{post.distance} km</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-primary">
                <Timer className="h-4 w-4" />
                <span className="font-medium">Tempo</span>
              </div>
              <span>{post.time}</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-primary">
                <TrendingUp className="h-4 w-4" />
                <span className="font-medium">Ritmo</span>
              </div>
              <span>{post.pace} min/km</span>
            </div>
          </div>
        ) : null}

        <Tabs defaultValue="photos" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="photos" className="text-xs">
              <ImageIcon className="h-3 w-3 mr-1" />
              Fotos
            </TabsTrigger>
            <TabsTrigger value="stats" className="text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              Estatísticas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="photos" className="mt-2">
            <div className="image-gallery">
              <Dialog>
                <DialogTrigger asChild>
                  <div className="image-gallery-item cursor-pointer" onClick={() => setSelectedImage(post.image)}>
                    <Image
                      src={post.image || "/placeholder.svg"}
                      alt="Imagem da corrida"
                      width={600}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-3xl p-0 overflow-hidden">
                  <div className="relative aspect-video">
                    <Image src={selectedImage || post.image} alt="Imagem ampliada" fill className="object-contain" />
                  </div>
                </DialogContent>
              </Dialog>

              {additionalImages.map((img, index) => (
                <Dialog key={index}>
                  <DialogTrigger asChild>
                    <div className="image-gallery-item cursor-pointer" onClick={() => setSelectedImage(img)}>
                      <Image
                        src={img || "/placeholder.svg"}
                        alt={`Imagem adicional ${index + 1}`}
                        width={600}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl p-0 overflow-hidden">
                    <div className="relative aspect-video">
                      <Image src={selectedImage || img} alt="Imagem ampliada" fill className="object-contain" />
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="stats" className="mt-2">
            <div className="bg-muted rounded-md p-4 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Distância</span>
                    <span className="font-medium">{post.distance} km</span>
                  </div>
                  <div className="h-1.5 bg-muted-foreground/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${Math.min((post.distance / 10) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Ritmo</span>
                    <span className="font-medium">{post.pace} min/km</span>
                  </div>
                  <div className="h-1.5 bg-muted-foreground/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${Math.min(((6 - Number.parseInt(post.pace)) / 3) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Timer className="h-4 w-4 text-primary" />
                  <span>Tempo: {post.time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4 text-primary" />
                  <span>FC Média: 155 bpm</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span>Elevação: 120m</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>Passos: 6.500</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className={liked ? "text-primary" : ""} onClick={handleLike}>
              <Heart className="h-4 w-4 mr-1" fill={liked ? "currentColor" : "none"} />
              <span>{liked ? post.likes + 1 : post.likes}</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowComments(!showComments)}>
              <MessageCircle className="h-4 w-4 mr-1" />
              <span>{post.comments.length}</span>
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="button-hover-effect">
            <Share2 className="h-4 w-4 mr-1" />
            <span>Compartilhar</span>
          </Button>
        </div>

        {showComments && (
          <div className="w-full mt-4 space-y-4">
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <Avatar className="h-8 w-8 border border-primary/20">
                  <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                  <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 bg-muted p-2 rounded-md">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium">{comment.user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.date), { addSuffix: true, locale: ptBR })}
                    </p>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
              </div>
            ))}

            <div className="flex gap-3 mt-2">
              <Avatar className="h-8 w-8 border border-primary/20">
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex-1 flex gap-2">
                <Input
                  placeholder="Adicione um comentário..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="h-9 transition-all focus:ring-2 focus:ring-primary/30"
                />
                <Button size="sm" onClick={handleComment} disabled={!newComment.trim()} className="button-hover-effect">
                  Enviar
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

