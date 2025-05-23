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
import InputMask from "react-input-mask";
import { jwtDecode } from "jwt-decode";

type DecodedToken = {
  id: number;
};
const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
const decoded: DecodedToken | null = token ? jwtDecode(token) : null;

function formatPhone(value: string) {
  // tira tudo que não for dígito
  const digits = value.replace(/\D/g, "");
  const d1 = digits.slice(0, 2);    // DDD
  const d2 = digits.slice(2, 7);    // primeiros 5 dígitos
  const d3 = digits.slice(7, 11);   // últimos 4 dígitos
  let result = "";

  if (d1) result = `(${d1}`;
  if (d1.length === 2) result += ") ";
  if (d2) result += d2;
  if (d2.length === 5) result += "-";
  if (d3) result += d3;

  return result;
}

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

const registroSchema = z
  .object({
    nome: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
    email: z.string().email({ message: "Email inválido" }),
    telefone: z
    .string()
    .regex(/^\(\d{2}\) \d{5}-\d{4}$/, { message: "Telefone deve estar no formato (99) 99999-9999" }),
    senha: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
    confirmacaoSenha: z.string(),
  })
  .refine((data) => data.senha === data.confirmacaoSenha, {
    message: "As senhas não coincidem",
    path: ["confirmacaoSenha"],
  })

type RegistroFormValues = z.infer<typeof registroSchema>

export default function RegistroPage() {
  const userId = getUserIdFromToken();
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
      router.push(`/sub_admin/${userId}`)
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
                    <Input
                      placeholder="(99) 99999-9999"
                      // controla o valor formatado
                      value={field.value}
                      onChange={e => {
                        const formatted = formatPhone(e.target.value);
                        field.onChange(formatted);
                      }}
                      onBlur={field.onBlur}
                      maxLength={15} // opcional
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