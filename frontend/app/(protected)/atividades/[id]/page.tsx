"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { getUserIdFromToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileUploader from "@/components/file-uploader";
import { makeInicial } from "@/axios";
import { decodeJwt } from "jose";


const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const atividadeSchema = z.object({
  titulo: z.string().min(3, { message: "O título deve ter pelo menos 3 caracteres" }),
  descricao: z.string().min(10, { message: "A descrição deve ter pelo menos 10 caracteres" }),
  km_percorridos: z.coerce.number().positive({ message: "A distância deve ser maior que zero" }),
  tempo_corrida: z.string().min(3, { message: "O tempo é obrigatório" }),
  local: z.string().min(3, { message: "O local é obrigatório" }),
  chegada: z.string().min(3, { message: "O local é obrigatório" }),
  foto_corrida: z.boolean().default(false).optional(),
});

type AtividadeFormValues = z.infer<typeof atividadeSchema>;

// Função para decodificar o token e extrair o ID do usuário
type Decoded = { id: number; [key: string]: any };

export default function NovaAtividadePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [activityImage, setActivityImage] = useState<File | null>(null);
  const [watchImage, setWatchImage] = useState<File | null>(null);

  const form = useForm<AtividadeFormValues>({
    resolver: zodResolver(atividadeSchema),
    defaultValues: {
      titulo: "",
      descricao: "",
      km_percorridos: 0,
      tempo_corrida: "",
      local: "",
      chegada: "",
      foto_corrida: false,
    },
  });

  const onSubmit: SubmitHandler<AtividadeFormValues> = async (values) => {
    const userId = getUserIdFromToken();
    if (!userId) {
      toast.error("Usuário não autenticado");
      return;
    }
    setIsLoading(true);
    try {
      await makeInicial.post("post/criar", {
        ...values,
        id_pessoa: userId,
      });
      toast.success("Atividade registrada com sucesso!");
      router.push(`/feed/${userId}`);
    } catch {
      toast.error("Erro ao registrar atividade");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle>Nova Atividade</CardTitle>
          <CardDescription>Compartilhe sua corrida com a comunidade Mundo Endorfina</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="titulo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título da atividade</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Corrida matinal no parque" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Conte como foi sua corrida" className="min-h-24" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="km_percorridos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Distância (km)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tempo_corrida"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tempo</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 45:30" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="local"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Local</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Parque Ibirapuera" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>

                <FormField
                  control={form.control}
                  name="chegada"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chegada</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Parque Ibirapuera" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Tabs defaultValue="foto-corrida" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="foto-corrida">Foto da Corrida</TabsTrigger>
                  <TabsTrigger value="foto-smartwatch">Foto do Smartwatch</TabsTrigger>
                </TabsList>
                <TabsContent value="foto-corrida" className="p-4">
                  <FileUploader
                    onFileSelected={setActivityImage}
                    acceptedFileTypes={ACCEPTED_IMAGE_TYPES}
                    maxFileSize={MAX_FILE_SIZE}
                    label="Adicione uma foto da sua corrida"
                  />
                </TabsContent>
                <TabsContent value="foto-smartwatch" className="p-4">
                  <FileUploader
                    onFileSelected={setWatchImage}
                    acceptedFileTypes={ACCEPTED_IMAGE_TYPES}
                    maxFileSize={MAX_FILE_SIZE}
                    label="Adicione uma foto do seu smartwatch"
                  />
                </TabsContent>
              </Tabs>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Enviando..." : "Publicar atividade"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}