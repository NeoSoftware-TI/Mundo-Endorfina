"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { makeRequest } from "@/axios"

const registroSchema = z
  .object({
    nome: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
    email: z.string().email({ message: "Email inválido" }),
    telefone: z.string().min(10, { message: "Telefone inválido" }),
    senha: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
    confirmacaoSenha: z.string(),
  })
  .refine((data) => data.senha === data.confirmacaoSenha, {
    message: "As senhas não coincidem",
    path: ["confirmacaoSenha"],
  })

type RegistroFormValues = z.infer<typeof registroSchema>

export default function RegistroPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<RegistroFormValues>({
    resolver: zodResolver(registroSchema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      senha: "",
      confirmacaoSenha: "",
    },
  })

// IMPLEMENTAÇÃO BACK END ------------------------------------------------

  async function onSubmit(values: RegistroFormValues) {
    setIsLoading(true)
    try {
      const response = await makeRequest.post("registerCliente", {
        nome: values.nome,
        email: values.email,
        telefone: values.telefone,
        senha: values.senha,
        confirmsenha: values.senha,
      })

// IMPLEMENTAÇÃO BACK END ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

      toast.success("Cadastro realizado com sucesso!")
      router.push("/sub_admin")
    } catch (error) {
      toast.error("Erro ao realizar cadastro. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-120px)] items-center justify-center px-4 py-6">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Cadastro</CardTitle>
          <CardDescription className="text-center">Crie sua conta para participar do Mundo Endorfina</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="seu.email@exemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="telefone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input placeholder="(99) 99999-9999" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="senha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmacaoSenha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Cadastrando..." : "Cadastrar"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}