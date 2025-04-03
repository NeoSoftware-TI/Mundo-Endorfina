"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

export default function AdminPage() {
  const [search, setSearch] = useState("")
  const [cuponSearch, setCuponSearch] = useState("")

  // Dados simulados
  const users = [
    {
      id: "1",
      nome: "Carlos Silva",
      email: "carlos@email.com",
      telefone: "(11) 99999-9999",
      pontos: 1250,
      status: "ativo",
    },
    { id: "2", nome: "Ana Beatriz", email: "ana@email.com", telefone: "(11) 88888-8888", pontos: 980, status: "ativo" },
    {
      id: "3",
      nome: "Ricardo Oliveira",
      email: "ricardo@email.com",
      telefone: "(21) 77777-7777",
      pontos: 1540,
      status: "ativo",
    },
    {
      id: "4",
      nome: "Mariana Santos",
      email: "mariana@email.com",
      telefone: "(11) 66666-6666",
      pontos: 780,
      status: "inativo",
    },
  ]

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

  const filteredUsers = users.filter(
    (user) =>
      user.nome.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase()),
  )

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
                    <Button>Adicionar Usuário</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar Novo Usuário</DialogTitle>
                      <DialogDescription>Preencha os dados do novo usuário</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="nome" className="text-right">
                          Nome
                        </Label>
                        <Input id="nome" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                          Email
                        </Label>
                        <Input id="email" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="telefone" className="text-right">
                          Telefone
                        </Label>
                        <Input id="telefone" className="col-span-3" />
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
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Pontos</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.nome}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.telefone}</TableCell>
                        <TableCell>{user.pontos}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                              user.status === "ativo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {user.status}
                          </span>
                        </TableCell>
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

