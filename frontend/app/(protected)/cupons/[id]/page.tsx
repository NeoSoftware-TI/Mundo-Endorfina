"use client";

import { useState, useEffect } from "react";
import { Eye, Copy } from "lucide-react";
import { decodeJwt } from "jose";
import { toast } from "sonner";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader,
  DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Cupom = {
  id: number;
  titulo: string;
  link: string;
  marca: string;
  pontos: number;
  validade: string;
  disponivel: boolean;
};

export default function CuponsPage() {
  const [userId, setUserId] = useState<number | null>(null);
  const [points, setPoints] = useState<number>(0);
  const [cupons, setCupons] = useState<Cupom[]>([]);
  const [loading, setLoading] = useState(true);
  const [cupomSelecionado, setCupomSelecionado] = useState<Cupom | null>(null);
  const [mostrarLinkModal, setMostrarLinkModal] = useState(false);

  // 1) Decodifica o token e carrega userId + saldo inicial de pontos
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const { id } = decodeJwt(token) as { id: number };
      setUserId(id);
      // buscar saldo de pontos
      fetch(`http://localhost:3001/api/pontos/${id}`)
        .then(r => r.json())
        .then(d => setPoints(d.pontos))
        .catch(() => console.error("Falha ao buscar pontos"));
    } catch {
      console.error("Token inválido");
    }
  }, []);

  // 2) Carrega lista de cupons
  useEffect(() => {
    fetch("http://localhost:3001/cupom/ver")
      .then(r => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(setCupons)
      .catch(err => console.error("Erro ao buscar cupons:", err))
      .finally(() => setLoading(false));
  }, []);

  // 3) Função de resgate
  async function handleResgatar(cupomId: number) {
    if (userId === null) return;
    try {
      const res = await fetch(
        `http://localhost:3001/cupom/resgatar/${userId}/${cupomId}`,
        { method: "POST" }
      );
      const data = await res.json();
      if (!res.ok) {
        // agora jogamos um Error de verdade, com mensagem
        throw new Error(data.error || "Erro ao resgatar");
      }
      toast.success(data.message);
      setPoints(data.pontosRestantes);
      setMostrarLinkModal(true);
    } catch (err: any) {
      // aqui err é um Error, então err.message vem preenchido
      toast.error(err.message);
    }
  }

  // 4) copiar link
  const copiarLink = async () => {
    if (!cupomSelecionado) return;
    await navigator.clipboard.writeText(cupomSelecionado.link);
    toast.success("Link copiado!");
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Cupons Disponíveis</h1>
        <p className="mt-2 text-muted-foreground">
          Troque seus pontos por Cupons Exclusivos <br></br>
          Seus pontos: <strong className="text-primary ">{points.toLocaleString("pt-BR")}</strong>
        </p>
      </div>

      {loading ? (
        <p>Carregando cupons...</p>
      ) : cupons.length === 0 ? (
        <p>Nenhum cupom encontrado.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cupons.map(cupom => (
            <Card key={cupom.id} className={cupom.disponivel ? "" : "opacity-70"}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{cupom.titulo}</CardTitle>
                    <CardDescription>{cupom.marca}</CardDescription>
                  </div>
                  <Badge variant={cupom.disponivel ? "default" : "secondary"}>
                    {cupom.disponivel ? "Disponível" : "Esgotado"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-2">
                <p className="text-blue-400 font-bold">
                  Custa {cupom.pontos.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  Válido até {cupom.validade}
                </p>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full mt-3 flex gap-2 items-center"
                      disabled={!cupom.disponivel}
                      onClick={() => {
                        setCupomSelecionado(cupom);
                        setMostrarLinkModal(false);
                      }}
                    >
                      <Eye className="w-4 h-4" /> Visualizar
                    </Button>
                  </DialogTrigger>

                  {cupomSelecionado?.id === cupom.id && !mostrarLinkModal && (
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Resgatar “{cupom.titulo}” ?</DialogTitle>
                      </DialogHeader>

                      <p className="px-6 pb-4 text-muted-foreground">
                        Esse cupom custa{" "}
                        <strong className="text-red-500">
                          {cupom.pontos.toLocaleString()}
                        </strong>{" "}
                        pontos. Você tem{" "}
                        <strong className="text-primary">{points.toLocaleString()}</strong>.
                      </p>

                      <DialogFooter className="gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setCupomSelecionado(null)}
                        >
                          Cancelar
                        </Button>
                        <Button onClick={() => handleResgatar(cupom.id)}>
                          Confirmar
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  )}

                  {cupomSelecionado?.id === cupom.id && mostrarLinkModal && (
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Resgate concluído!</DialogTitle>
                      </DialogHeader>
                      <p className="px-6 pb-4 text-muted-foreground">
                        Clique no link abaixo para usar seu cupom:
                      </p>

                      <div className="flex gap-2 items-center px-6">
                        <Input
                          readOnly
                          value={cupomSelecionado.link}
                          className="flex-1"
                        />
                        <Button variant="outline" onClick={copiarLink}>
                          <Copy className="w-4 h-4 mr-1" /> Copiar
                        </Button>
                      </div>

                      <DialogFooter>
                        <Button onClick={() => setCupomSelecionado(null)}>
                          Fechar
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  )}
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
