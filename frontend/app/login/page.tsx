"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { makeRequest } from "@/axios"
import { jwtDecode } from "jwt-decode";

const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  senha: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Configuração do react-hook-form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      senha: "",
    },
  })

  type DecodedToken = {
    id: number
    tipo: string
    exp: number
  }

  const token = localStorage.getItem("token")
  if (token) {
    const decoded: DecodedToken = jwtDecode(token)
    console.log("ID do usuário:", decoded.id)
  }

  // Função de envio do formulário que faz a chamada ao backend
  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true)
    try {
      const response = await makeRequest.post("login", values);
      const { token } = response.data;
      localStorage.setItem("token", token);

      console.log(response.data)
      toast.success("Login realizado com sucesso!");
      const decoded: DecodedToken = jwtDecode(token)
      router.push(`/dashboard/${decoded.id}`)
    } catch (error: any) {
      toast.error("Erro no login: " + error.response?.data.erro);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto flex h-[calc(100vh-120px)] items-center justify-center px-4 py-6">
      <Card className="w-full max-w-md">
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





        <Button onClick={() => router.push("/registroAdmin")}>
          Registrar Admin
        </Button>
        



      
    </div>
  )
}
