"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Runner = {
  id_login: string;
  id_pessoa: string;
  nome: string;
  km_percorridos: number;
  pontos: number;
  avatar: string;
};

interface UserRankingProps {
  isAdmin?: boolean;
}

export default function UserRanking({ isAdmin = false }: UserRankingProps) {
  const [topUsers, setTopUsers] = useState<Runner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRanking() {
      try {
        const res = await fetch("http://localhost:3001/rank/ranking");
        if (!res.ok) {
          throw new Error("Erro ao buscar ranking");
        }
        const data: Runner[] = await res.json();
        setTopUsers(data);
      } catch (error) {
        console.error("Erro ao buscar ranking:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRanking();
  }, []);

  if (loading) {
    return <div className="py-2 text-center">Carregando ranking...</div>;
  }

  return (
    <div className="w-full space-y-5">
      <div className="flex overflow-x-auto pb-4">
        <div className="flex gap-4">
          {topUsers.slice(0, 3).map((user, index) => (
            <Card key={user.id_login} className="relative min-w-[445px] shadow-md">
              <div className="absolute -top-0 left-1/2 -translate-x-1/2 transform">
                <Badge className="px-3 py-1 text-base font-bold">#{index + 1}</Badge>
              </div>
              <CardContent className="pt-12">
                <div className="flex flex-col items-center">
                  <Avatar className="mb-2 h-20 w-20 border-4 border-primary">
                    <AvatarImage src={user.avatar || "/placeholder.svg?height=40&width=40"} alt={user.nome} />
                    <AvatarFallback>{user.nome[0]}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold">{user.nome}</h3>
                  <div className="my-2 text-center">
                    <p className="text-2xl font-bold text-primary">{user.pontos.toLocaleString("pt-BR")}</p>
                    <p className="text-sm text-muted-foreground">pontos</p>
                  </div>
                  <div className="text-sm text-muted-foreground">{user.km_percorridos} km percorridos</div>
                  {isAdmin && (
                    <Button variant="outline" size="sm" className="mt-3">
                      Ver perfil
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {(isAdmin || topUsers.length > 3) && (
        <div className="rounded-md border">
          <div className="divide-y">
            {topUsers.slice(3).map((user, index) => (
              <div key={user.id_login} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted font-semibold">
                    {index + 4}
                  </div>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar || "/placeholder.svg?height=40&width=40"} alt={user.nome} />
                    <AvatarFallback>{user.nome[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.nome}</p>
                    <p className="text-sm text-muted-foreground">{user.km_percorridos} km</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-primary">{user.pontos.toLocaleString("pt-BR")}</div>
                  <div className="text-xs text-muted-foreground">pontos</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
