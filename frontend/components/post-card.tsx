// components/PostCard.tsx
"use client";

import { useState } from "react";
import { decodeJwt } from "jose";
import Image from "next/image";
import { Heart, ThumbsDown, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PostType {
  id: string;
  pessoas: {
    name: string;
    avatar: string;
  };
  date: string;
  content: string;
  images: string[];
  distance: number;
  time: string;
  likes: number;
  dislikes: number;
}

interface PostCardProps {
  post: PostType;
}

export function PostCard({ post }: PostCardProps) {
  const {
    id,
    pessoas,
    date,
    content,
    images,
    distance,
    time,
    likes: initialLikes,
    dislikes: initialDislikes,
  } = post;

  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [deleting, setDeleting] = useState(false);

  // Decodifica o token para saber se é Sub-Admin
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const tipo = token ? (decodeJwt(token) as any).tipo : null;
  const privilegedRoles = ["Cliente", "Sub-Admin", "Admin"];
  const usuariosRoles = ["Sub-Admin", "Admin"];
  const usuarios = privilegedRoles.includes(tipo);
  const isSubAdmin = usuariosRoles.includes(tipo);

  // Like
  async function handleLike() {
    try {
      const res = await fetch(`http://localhost:3001/post/updatelike/${id}`, {
        method: "PUT",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Falha ao registrar like");
      const data = (await res.json()) as { likes: number };
      setLikes(data.likes);
    } catch (err) {
      console.error(err);
      alert("Erro ao dar like");
    }
  }

  // Dislike
  async function handleDislike() {
    try {
      const res = await fetch(`http://localhost:3001/post/updatedislike/${id}`, {
        method: "PUT",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Falha ao registrar dislike");
      const data = (await res.json()) as { dislikes: number };
      setDislikes(data.dislikes);
    } catch (err) {
      console.error(err);
      alert("Erro ao dar dislike");
    }
  }

  // Delete (só para Sub-Admin e Admin)
  async function handleDelete() {
    if (!confirm("Confirma exclusão deste post?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`http://localhost:3001/post/deletar/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Falha ao deletar");
      // dispara um evento para remover da lista
      window.dispatchEvent(
        new CustomEvent("postDeleted", { detail: id })
      );
    } catch (err) {
      console.error(err);
      alert("Erro ao deletar post");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={pessoas.avatar} alt={pessoas.name} />
              <AvatarFallback>{pessoas.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{pessoas.name}</p>
              <p className="text-xs text-muted-foreground">{date}</p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-4 py-0">
        <p className="mb-4 text-sm">{content}</p>
        {images.map((image, idx) => (
          <div
            key={idx}
            className="relative mb-4 h-80 w-full overflow-hidden rounded-md"
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`Imagem da atividade de ${pessoas.name}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
        <div className="mb-4 grid grid-cols-3 gap-2 rounded-md bg-muted p-3 text-center text-sm">
          <div>
            <p className="font-semibold text-primary">{distance} km</p>
            <p className="text-xs text-muted-foreground">Distância</p>
          </div>
          <div>
            <p className="font-semibold text-primary">{time}</p>
            <p className="text-xs text-muted-foreground">Tempo</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col p-4">
        <div className="flex w-full items-center justify-between">
          <div className="flex space-x-2">
            {usuarios && (
            <Button
              variant="ghost"
              size="sm"
              className={cn("flex items-center gap-1 text-primary")}
              onClick={handleLike}
            >
              <Heart className="h-4 w-4 currentColor" />
              <span>{likes}</span>
            </Button>
          )}
            {usuarios && (
            <Button
              variant="ghost"
              size="sm"
              className={cn("flex items-center gap-1 text-primary")}
              onClick={handleDislike}
            >
              <ThumbsDown className="h-4 w-4 currentColor" />
              <span>{dislikes}</span>
            </Button>
          )}
            {isSubAdmin && (
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive"
                onClick={handleDelete}
                disabled={deleting}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
