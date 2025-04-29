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
        const response = await fetch(`http://localhost:3001/post/verpublic`);
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
          images: post.foto_corrida
            ? [`http://localhost:3001/uploads/${post.foto_corrida}`]
            : [],
          distance: post.km_percorridos,
          time: post.tempo_corrida.toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
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
    
 <><nav className="sticky top-0 w-full bg-white shadow-md z-50 h-20">
 <div className="container mx-auto max-w-3xl px-4 h-full grid grid-cols-3 items-center">

   <button
     type="button"
     className="w-[140px] bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition"
     onClick={() => router.push('/login')}
   >
     Login
   </button>


   <h1 className="col-span-1 text-center text-2xl font-bold">
     Timeline
   </h1>


   <div />
 </div>
</nav>

    <div className="container mx-auto max-w-3xl px-4 py-6">
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
    </>
  );
}