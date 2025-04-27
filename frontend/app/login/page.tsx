"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { makeRequest } from "@/axios"
import { decodeJwt } from "jose";
import Link from "next/link"

const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  senha: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
})

type LoginFormValues = z.infer<typeof loginSchema>
type Payload = { id: number; tipo: string; exp: number };

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Configuração do react-hook-form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", senha: "" },
  })

  // Função de envio do formulário que faz a chamada ao backend
  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);
    try {
      const { data } = await makeRequest.post("login", values);
      const token: string = data.token;
      localStorage.setItem("token", token);
      
      const decoded = decodeJwt(token) as Payload;
      console.log("ID do usuário:", decoded.id);
      console.log('Token:', localStorage.getItem("token"));
      console.log('Decoded:', decoded);
      
      // Verifica se o ID é válido antes de redirecionar
      if (decoded.id && decoded.id > 0) {
        toast.success("Login realizado com sucesso!");
        router.push(`/dashboard/${decoded.id}`);
      } else {
        throw new Error("ID de usuário inválido");
      }
    } catch (err: any) {
      toast.error("Erro no login: " + (err.response?.data.erro ?? err.message));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto flex h-[calc(100vh-120px)] items-center justify-center px-4 py-6">
      <Card className="w-full max-w-md">
        <CardContent className="bg-blue-400/20 flex items-center justify-center px-4 py-6">

              <Link href="/" passHref>
              <Button type="submit" className="w-[120px] bg-green-500" >
                Inicio
              </Button>
              </Link>

              <Link href="/feedsemid" passHref>
              <Button type="submit" className="w-[120px] bg-blue-500" >
                Feed
              </Button>
              </Link>

              <Link href="/registrotemp" passHref>
              <Button type="submit" className="w-[120px] bg-red-500" >
                Registro Admin
              </Button>
              </Link>

        </CardContent>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Entrar</CardTitle>
          <CardDescription className="text-center">
            Entre com seu email e senha para acessar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="seu.email@exemplo.com"
                        {...field}
                      />
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
                      <Input
                        type="password" 
                        placeholder="******"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
