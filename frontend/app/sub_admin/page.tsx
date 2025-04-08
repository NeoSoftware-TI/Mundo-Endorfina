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
import { handleUpdate } from "@/components/ComandoPessoas";
import { handleDelete } from "@/components/ComandoPessoas";

interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  pontos: number;
  status: string;
}

export default function AdminPage() {
  const [search, setSearch] = useState("")
  const [cuponSearch, setCuponSearch] = useState("")
  const [pessoas, setPessoas] = useState<Cliente[]>([]);
  const router = useRouter()
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPessoas() {
      try {
        const response = await fetch("http://localhost:8000/api/pessoas");
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

  const cupons = [
    { id: "1", titulo: "10% de desconto em tênis", marca: "Nike", pontos: 500, validade: "30/06/2023", resgatados: 24 },
    {
      id: "2",
      titulo: "Camiseta técnica grátis",
      marca: "Adidas",
      pontos: 750,
      validade: "15/07/2023",
      resgatados: 18,
    },
    {
      id: "3",
      titulo: "Relógio esportivo com 30% OFF",
      marca: "Garmin",
      pontos: 1200,
      validade: "31/07/2023",
      resgatados: 7,
    },
    {
      id: "4",
      titulo: "Inscrição gratuita em corrida",
      marca: "Track&Field",
      pontos: 1500,
      validade: "31/08/2023",
      resgatados: 12,
    },
  ]

  const filteredUsers = pessoas.filter(
    (pessoa) =>
      pessoa.nome.toLowerCase().includes(search.toLowerCase()) ||
      pessoa.email.toLowerCase().includes(search.toLowerCase())
  );

  const filteredCupons = cupons.filter(
    (cupom) =>
      cupom.titulo.toLowerCase().includes(cuponSearch.toLowerCase()) ||
      cupom.marca.toLowerCase().includes(cuponSearch.toLowerCase()),
  )

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
                <TableHead>Status</TableHead>
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
                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          user.status === "ativo"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.status}
                      </span>
                    </TableCell>
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
                                  user.status
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
              <CardDescription>Crie e gerencie todos os cupons da plataforma</CardDescription>
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>

                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Adicionar Cupom</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar Novo Cupom</DialogTitle>
                      <DialogDescription>Preencha os dados do novo cupom</DialogDescription>
                    </DialogHeader>
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
                    </div>
                    <DialogFooter>
                      <Button type="submit">Salvar</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Marca</TableHead>
                      <TableHead>Pontos</TableHead>
                      <TableHead>Validade</TableHead>
                      <TableHead>Resgatados</TableHead>
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
                        <TableCell>{cupom.resgatados}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="mr-2">
                            Editar
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive">
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
              <CardDescription>Visualize o ranking de usuários com base em pontuação</CardDescription>
            </CardHeader>
            <CardContent>
              <UserRanking isAdmin />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}