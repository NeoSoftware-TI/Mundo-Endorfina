"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/post-card";
import { jwtDecode } from "jwt-decode";

type DecodedToken = { id: number };

function getUserIdFromToken(): string | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    return jwtDecode<DecodedToken>(token).id.toString();
  } catch {
    return null;
  }
}

export default function FeedPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = getUserIdFromToken();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const decoded = token ? jwtDecode<DecodedToken>(token) : null;

  useEffect(() => {
    async function fetchPosts() {
      if (!userId) {
        router.push("/login");
        return;
      }
      try {
        const res = await fetch(`http://localhost:3001/post/vertodos/${userId}`);
        if (!res.ok) throw new Error("Falha ao buscar posts");
        const data = await res.json();

        const formatted = data.map((post: any) => ({
          id: post.id,
          pessoas: {
            name: post.nome,
            foto_url:
            typeof post.foto_url === "string" && post.foto_url !== ""
              ? post.foto_url.startsWith("http")
                ? post.foto_url
                : `http://localhost:3001${post.foto_url}`
              : null,
          },
          date: post.data_publicacao,
          content: post.descricao,
          images: post.foto_corrida
            ? [`http://localhost:3001/uploads/${post.foto_corrida}`]
            : [],
          distance: post.km_percorridos,
          time: post.tempo_corrida,
          likes: post.likes,
          dislikes: post.dislikes,
          local: post.local,
        }));

        setPosts(formatted);
      } catch (err) {
        console.error("Erro ao buscar posts:", err);
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
          <Link href={`/atividades/${decoded?.id ?? ""}`}>Nova Atividade</Link>
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
