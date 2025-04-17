"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PostCard } from "@/components/post-card";

export default function FeedPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {

      try {
        const response = await fetch(`http://localhost:8000/post/verpublic`);
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
  }, [router]);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6">
      <div className="mb-6 flex items-center justify-center">
        <h1 className="text-2xl font-bold">Feed de Atividades</h1>

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