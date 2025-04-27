"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Runner = {
  id_login: string;
  id_pessoa: string;
  nome: string;
  km_percorridos: number;
  pontos: number;
};

export default function RankingMarquee() {
  const [runners, setRunners] = useState<Runner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRanking() {
      try {
        const res = await fetch("http://localhost:3001/rank/ranking");
        if (!res.ok) throw new Error("Erro ao buscar ranking");
        const data = await res.json();
        setRunners(data);
      } catch (error) {
        console.error("Erro ao buscar ranking:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRanking();
  }, []);

  if (loading) return <div className="py-2 text-center">Carregando ranking...</div>;

  return (
    <div className="bg-primary/10 py-2">
      <div className="flex w-full items-center space-x-6 overflow-hidden">
        <div className="flex min-w-full animate-[marquee_10s_linear_infinite] items-center space-x-6">
          {runners.map((runner, index) => (
            <div key={runner.id_login} className="flex items-center space-x-2">
              <span className="font-semibold text-primary">#{index + 1}</span>
              <Avatar className="h-6 w-6">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt={runner.nome} />
                <AvatarFallback>{runner.nome[0]}</AvatarFallback>
              </Avatar>
              <span className="whitespace-nowrap font-medium">{runner.nome}</span>
              <span className="whitespace-nowrap text-sm text-muted-foreground">{runner.km_percorridos}km</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}