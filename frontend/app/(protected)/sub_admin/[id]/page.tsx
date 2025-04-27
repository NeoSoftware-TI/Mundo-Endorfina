"use client"

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import UserRanking from "@/components/user-ranking"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  handleUpdate,
  handleDelete,
  handleUpdatecupom,
  handleDeletecupom,
} from "@/components/ComandoPessoas";
import { jwtDecode } from "jwt-decode";

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

interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  pontos: number;
}

type Cupom = {
  id: string;
  titulo: string;
  marca: string;
  pontos: number;
  validade: string;
  link: string;
  disponivel: string;
};

export default function AdminPage() {
  const [search, setSearch] = useState("");
  const [pessoas, setPessoas] = useState<Cliente[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [cupons, setCupons] = useState<Cupom[]>([]);
  const [cuponSearch, setCuponSearch] = useState("");
  const userId = getUserIdFromToken();
  

// ////////////////////////////////////////////////////////////////////////// PESSOAS - CHAMAR API
  useEffect(() => {
    async function fetchPessoas() {
      try {
        const response = await fetch("http://localhost:3001/api/pessoas");
        const data = await response.json();
        setPessoas(data);
      } catch (error) {
        console.error("Erro ao buscar pessoas:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPessoas();
  }, []);
// ////////////////////////////////////////////////////////////////////////// CUPOM - CHAMAR API
useEffect(() => {
  async function fetchCupons() {
    try {
      const res = await fetch("http://localhost:3001/cupom/ver");
      const data = await res.json();
      setCupons(data);
    } catch (err) {
      console.error("Erro ao buscar cupons:", err);
    }
  }
  fetchCupons();
}, []);
// ////////////////////////////////////////////////////////////////////////// PESSOAS - FILTRO
  const filteredUsers = pessoas.filter(
    (pessoa) =>
      pessoa.nome.toLowerCase().includes(search.toLowerCase()) ||
      pessoa.email.toLowerCase().includes(search.toLowerCase())
  );
// ////////////////////////////////////////////////////////////////////////// CUPOM - FILTRO
  const filteredCupons = cupons.filter((cupom) =>
    cupom.titulo.toLowerCase().includes(cuponSearch.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 py-6">
      <h1 className="mb-8 text-3xl font-bold">Painel Administrativo</h1>

      <Tabs defaultValue="usuarios">
        <TabsList className="mb-6 grid w-full grid-cols-3">
          <TabsTrigger value="usuarios">Usuários</TabsTrigger>
          <TabsTrigger value="cupons">Cupons</TabsTrigger>
          <TabsTrigger value="ranking">Ranking</TabsTrigger>
        </TabsList>

        <TabsContent value="usuarios">
  <Card>
    <CardHeader>
      <CardTitle>Gerenciamento de Usuários</CardTitle>
      <CardDescription>Gerencie todos os usuários da plataforma</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="mb-4 flex items-center justify-between">
        <div className="relative w-72">
          <Input
            placeholder="Buscar usuários..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
          {/* ícone de busca */}
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={() => router.push("/registroCliente")}>
              Registrar Cliente
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      <div className="rounded-md border">
        {loading ? (
          <p className="text-center py-4">Carregando usuários...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Pontos</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.nome}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.telefone}</TableCell>
                    <TableCell>{user.pontos}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            Editar
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Editar Usuário</DialogTitle>
                            <DialogDescription>
                              Atualize os dados do usuário
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor={`nome-${user.id}`} className="text-right">
                                Nome
                              </Label>
                              <Input id={`nome-${user.id}`} defaultValue={user.nome} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor={`email-${user.id}`} className="text-right">
                                Email
                              </Label>
                              <Input id={`email-${user.id}`} defaultValue={user.email} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor={`telefone-${user.id}`} className="text-right">
                                Telefone
                              </Label>
                              <Input id={`telefone-${user.id}`} defaultValue={user.telefone} className="col-span-3" />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              onClick={() =>
                                handleUpdate(
                                  user.id,
                                  (document.getElementById(`nome-${user.id}`) as HTMLInputElement).value,
                                  (document.getElementById(`email-${user.id}`) as HTMLInputElement).value,
                                  (document.getElementById(`telefone-${user.id}`) as HTMLInputElement).value,
                                )
                              }
                            >
                              Salvar
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleDelete(user.id)}
                      >
                        Excluir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Nenhum usuário encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </CardContent>
  </Card>
        </TabsContent>

        <TabsContent value="cupons">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Cupons</CardTitle>
              <CardDescription>
                Crie e gerencie todos os cupons da plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center justify-between">
                <div className="relative w-72">
                  <Input
                    placeholder="Buscar cupons..."
                    value={cuponSearch}
                    onChange={(e) => setCuponSearch(e.target.value)}
                    className="pl-8"
                  />
                </div>

                {/* Dialog de Criação */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Adicionar Cupom</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar Novo Cupom</DialogTitle>
                      <DialogDescription>Preencha os dados do novo cupom</DialogDescription>
                    </DialogHeader>
                    {/* Iniciamos um formulário para capturar os dados */}
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const payload = {
                          titulo: (document.getElementById("titulo") as HTMLInputElement).value,
                          marca: (document.getElementById("marca") as HTMLInputElement).value,
                          pontos: parseInt(
                            (document.getElementById("pontos") as HTMLInputElement).value,
                            10
                          ),
                          validade: (document.getElementById("validade") as HTMLInputElement).value,
                          link:
                            (document.getElementById("link") as HTMLInputElement).value,
                          disponivel: (document.getElementById("disponivel") as HTMLInputElement).value,
                        };

                        try {
                          const res = await fetch("http://localhost:3001/cupom/criar", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(payload),
                          });router.push(`/cupons/${userId}`)

                          if (!res.ok) {
                            throw new Error("Erro ao criar cupom");
                          }

                          const novoCupom = await res.json();

                          (document.getElementById("titulo") as HTMLInputElement).value = "";
                          (document.getElementById("marca") as HTMLInputElement).value = "";
                          (document.getElementById("pontos") as HTMLInputElement).value = "";
                          (document.getElementById("validade") as HTMLInputElement).value = "";
                          (document.getElementById("link") as HTMLInputElement).value = "";
                          (document.getElementById("disponivel") as HTMLInputElement).value = "";
                        } catch (err) {
                          console.error("Erro ao adicionar cupom:", err);
                        }
                      }}
                    >
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="titulo" className="text-right">
                            Título
                          </Label>
                          <Input id="titulo" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="marca" className="text-right">
                            Marca
                          </Label>
                          <Input id="marca" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="pontos" className="text-right">
                            Pontos
                          </Label>
                          <Input id="pontos" type="number" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="validade" className="text-right">
                            Validade
                          </Label>
                          <Input id="validade" type="date" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-3">
                          <Label htmlFor="link" className="text-right">
                            Link
                          </Label>
                          <Input id="link" type="string" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-1">
                          <Label htmlFor="disponivel" className="text-right">
                            Está Disponivel?
                          </Label>
                          <Input id="disponivel" className="col-span-3" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Salvar</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Tabela de Cupons */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Marca</TableHead>
                      <TableHead>Pontos</TableHead>
                      <TableHead>Validade</TableHead>
                      <TableHead>link</TableHead>
                      <TableHead>Disponível</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCupons.map((cupom) => (
                      <TableRow key={cupom.id}>
                        <TableCell className="font-medium">{cupom.titulo}</TableCell>
                        <TableCell>{cupom.marca}</TableCell>
                        <TableCell>{cupom.pontos}</TableCell>
                        <TableCell>{cupom.validade}</TableCell>
                        <TableCell>{cupom.link}</TableCell>
                        <TableCell>{cupom.disponivel}</TableCell>
                        <TableCell className="text-right space-x-2">
                          {/* Dialog de Edição */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                Editar
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Editar Cupom</DialogTitle>
                                <DialogDescription>
                                  Atualize os dados do cupom
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 gap-4 items-center">
                                  <Label htmlFor={`titulo-${cupom.id}`} className="text-right">
                                    Título
                                  </Label>
                                  <Input
                                    id={`titulo-${cupom.id}`}
                                    defaultValue={cupom.titulo}
                                    className="col-span-3"
                                  />
                                </div>
                                <div className="grid grid-cols-4 gap-4 items-center">
                                  <Label htmlFor={`marca-${cupom.id}`} className="text-right">
                                    Marca
                                  </Label>
                                  <Input
                                    id={`marca-${cupom.id}`}
                                    defaultValue={cupom.marca}
                                    className="col-span-3"
                                  />
                                </div>
                                <div className="grid grid-cols-4 gap-4 items-center">
                                  <Label htmlFor={`pontos-${cupom.id}`} className="text-right">
                                    Pontos
                                  </Label>
                                  <Input
                                    id={`pontos-${cupom.id}`}
                                    defaultValue={cupom.pontos.toString()}
                                    type="number"
                                    className="col-span-3"
                                  />
                                </div>
                                <div className="grid grid-cols-4 gap-4 items-center">
                                  <Label htmlFor={`validade-${cupom.id}`} className="text-right">
                                    Validade
                                  </Label>
                                  <Input
                                    id={`validade-${cupom.id}`}
                                    defaultValue={cupom.validade}
                                    type="date"
                                    className="col-span-3"
                                  />
                                </div>
                                <div className="grid grid-cols-4 gap-4 items-center">
                                  <Label htmlFor={`disponivel-${cupom.id}`} className="text-right">
                                    Disponível?
                                  </Label>
                                  <Input
                                    id={`disponivel-${cupom.id}`}
                                    defaultValue={cupom.disponivel}
                                    className="col-span-3"
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                 <Button
                                    onClick={() =>
                                      handleUpdatecupom(
                                        cupom.id, 
                                        (document.getElementById(`titulo-${cupom.id}`) as HTMLInputElement).value,
                                        (document.getElementById(`marca-${cupom.id}`) as HTMLInputElement).value,
                                        parseInt(
                                          (document.getElementById(`pontos-${cupom.id}`) as HTMLInputElement).value,
                                          10
                                        ),
                                        (document.getElementById(`validade-${cupom.id}`) as HTMLInputElement).value,
                                        parseInt(
                                          (document.getElementById(`link-${cupom.id}`) as HTMLInputElement).value,
                                          10
                                        ),
                                        (document.getElementById(`disponivel-${cupom.id}`) as HTMLInputElement).value
                                      )
                                    }
                                  >
                                    Salvar
                                  </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={() => handleDeletecupom(cupom.id.toString())}
                          >
                            Excluir
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ranking">
          <Card>
            <CardHeader>
              <CardTitle>Ranking de Usuários</CardTitle>
              <CardDescription>
                Visualize o ranking de usuários com base em pontuação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserRanking isAdmin />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}