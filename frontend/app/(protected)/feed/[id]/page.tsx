"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/post-card";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export default function FeedPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = getUserIdFromToken();

type DecodedToken = {
  id: number;
};
const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
const decoded: DecodedToken | null = token ? jwtDecode(token) : null;

function getUserIdFromToken(): string | null {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        return decoded.id.toString();
      } catch (error) {
        console.error("Erro ao decodificar token:", error);
      }
    }
  }
  return null;
}

useEffect(() => {
  async function fetchPosts() {
    if (!userId) {
      router.push("/login");
      return;
    }
    try {
      const response = await fetch(`http://localhost:3001/post/vertodos/${userId}`);
      const data = await response.json();

      const formattedPosts = data.map((post: any) => ({
        id: post.id,
        pessoas: {
          id: post.id_pessoa,
          name: post.nome,
          avatar: "/placeholder.svg?height=48&width=48",
        },
        date: post.data_publicacao,
        content: post.descricao,
        images: post.foto_corrida ? [post.foto_corrida] : [],
        distance: post.km_percorridos,
        time: post.tempo_corrida,
        likes: 0,
        dislikes: 0,
        local: post.local,
      }));

      setPosts(formattedPosts);
    } catch (error) {
      console.error("Erro ao buscar posts:", error);
    } finally {
      setLoading(false);
    }
  }

  fetchPosts();
}, [userId, router]);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Feed de Atividades</h1>
        <Button asChild>
          <Link href={`/atividades/${decoded ? decoded.id : ""}`}>Nova Atividade</Link>
        </Button>
      </div>

      <div className="space-y-6">
        {loading ? (
          <p>Carregando posts...</p>
        ) : posts.length === 0 ? (
          <p>Você ainda não publicou nenhuma atividade.</p>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}