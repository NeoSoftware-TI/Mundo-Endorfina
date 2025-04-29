"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { decodeJwt } from "jose";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

interface ActivityCardProps {
  id_post: string;
  imageUrl: string;        // valor vindo da API, ex: "/uploads/atividade-123.png"
  distance: number;
  title: string;
  date: string;
  likes: number;
}

type Decoded = { id: number; [key: string]: any };
interface UserProfile {
  foto_url: string | null;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export default function ActivityCard({
  imageUrl,
  distance,
  title,
  date,
}: ActivityCardProps) {
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // garantimos render no cliente
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    // decodifica token para saber o id do usuário corrente
    const token = localStorage.getItem("token");
    if (!token) return;
    let decoded: Decoded;
    try {
      decoded = decodeJwt(token) as Decoded;
    } catch {
      return;
    }
    // busca foto de perfil desse usuário
    fetch(`${API_BASE}/api/pessoasconfig/${decoded.id}`, {
      credentials: "include",
    })
      .then(r => {
        if (!r.ok) throw new Error("Não foi possível buscar perfil");
        return r.json();
      })
      .then((data: UserProfile) => {
        if (data.foto_url) {
          setFotoUrl(`${API_BASE}${data.foto_url}`);
        }
      })
      .catch(console.error);
  }, [isClient]);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={fotoUrl ?? "/placeholder.svg?height=36&width=36"}
              alt="Avatar do usuário"
            />
            <AvatarFallback>ME</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{title}</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{date}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 relative h-48 w-full">
        <Image
          src={imageUrl.startsWith("http") ? imageUrl : `${API_BASE}${imageUrl}`}
          alt={title}
          fill
          className="object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-4">
          <div className="rounded-full bg-black px-2 py-1 text-xs font-semibold text-blue-300 inline-block">
            {distance.toLocaleString("pt-BR")} km
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end">
        {/* Você pode colocar algo como o número de likes aqui */}
        <span className="text-sm text-muted-foreground">{/* {likes} 👍 */}</span>
      </CardFooter>
    </Card>
  );
}
