"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Define o tipo para os cupons conforme o esperado da API
type Cupom = {
  id: string;
  titulo: string;
  marca: string;
  pontos: number;
  validade: string;
  resgatados: number;
  disponivel: boolean;
};

export default function CuponsPage() {
  const [cupons, setCupons] = useState<Cupom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCupons() {
      try {
        const res = await fetch("http://localhost:8000/cupom/criar");
        if (!res.ok) throw new Error("Erro ao buscar cupons");
        const data: Cupom[] = await res.json();
        setCupons(data);
      } catch (error) {
        console.error("Erro ao buscar cupons:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCupons();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Cupons Disponíveis</h1>
        <p className="mt-2 text-muted-foreground">Troque seus pontos por cupons exclusivos</p>
      </div>

      {loading ? (
        <p>Carregando cupons...</p>
      ) : cupons.length === 0 ? (
        <p>Nenhum cupom encontrado.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cupons.map((cupom) => (
            <Card key={cupom.id} className={cupom.disponivel ? "" : "opacity-70"}>
              <CardHeader>
                <div className="flex justify-between">
                  <CardTitle>{cupom.titulo}</CardTitle>
                  <Badge variant={cupom.disponivel ? "default" : "secondary"}>
                    {cupom.disponivel ? "Disponível" : "Esgotado"}
                  </Badge>
                </div>
                <CardDescription>{cupom.marca}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{cupom.descricao}</p>
                <p className="mt-2 text-sm text-muted-foreground">Válido até {cupom.validade}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="font-semibold text-primary">{cupom.pontos} pontos</div>
                <Button disabled={!cupom.disponivel}>
                  {cupom.disponivel ? "Resgatar" : "Indisponível"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
