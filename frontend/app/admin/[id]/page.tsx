"use client"

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
  status: string;
}

export default function AdminPage() {
  const [search, setSearch] = useState("")
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

  const filteredUsers = pessoas.filter(
    (pessoa) =>
      pessoa.nome.toLowerCase().includes(search.toLowerCase()) ||
      pessoa.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 py-6">
      <h1 className="mb-8 text-3xl font-bold">Painel Administrativo</h1>

      <Tabs defaultValue="usuarios">
        <TabsList className="mb-6 grid w-full grid-cols-3">
          <TabsTrigger value="usuarios">Usuários</TabsTrigger>
        </TabsList>

        <TabsContent value="usuarios">
  <Card>
    <CardHeader>
      <CardTitle>Gerenciamento de Sub-Admin</CardTitle>
      <CardDescription>Gerencie todos os Sub-Admin (Gerentes) da plataforma</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="mb-4 flex items-center justify-between">
        <div className="relative w-72">
          <Input
            placeholder="Buscar Sub-Admin..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
          {/* ícone de busca */}
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={() => router.push("/registroSub_Admin")}>
              Registrar Sub-Admin
            </Button>
          </DialogTrigger>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={() => router.push("/registroAdmin")}>
              Registrar Admin
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
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor={`senha-${user.id}`} className="text-right">
                                Senha
                              </Label>
                              <Input id={`senha-${user.id}`} className="col-span-3" />
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
                                  (document.getElementById(`senha-${user.id}`) as HTMLInputElement).value,
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
      </Tabs>
    </div>
  )
}