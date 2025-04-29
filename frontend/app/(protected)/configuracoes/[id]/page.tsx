"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { decodeJwt } from "jose";

type DecodedToken = { id: number; tipo: string; exp: number };
interface UserProfile {
  nome: string;
  email: string;
  telefone: string;
}

export default function EditProfilePage() {
  const router = useRouter();

  // 1) Estados
  const [isClient, setIsClient] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");

  // extrai id do token
  function getUserIdFromToken(): number | null {
    if (typeof window === "undefined") return null;
    const t = localStorage.getItem("token");
    if (!t) return null;
    try {
      return decodeJwt<DecodedToken>(t).id;
    } catch {
      return null;
    }
  }

  // detecta cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  // auth + set userId
  useEffect(() => {
    if (!isClient) return;
    const t = localStorage.getItem("token");
    if (!t) return router.push("/login");

    const id = getUserIdFromToken();
    if (!id) return router.push("/login");

    setUserId(id);
    setLoading(false);
  }, [isClient, router]);

  // carrega perfil
  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/api/pessoasconfig/${userId}`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error("Falha ao carregar perfil");
        const data: UserProfile = await res.json();
        setNome(data.nome);
        setEmail(data.email);
        setTelefone(data.telefone);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [userId]);

  // submit usa PUT
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!userId) return;
    setSaving(true);

    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("email", email);
    formData.append("telefone", telefone);

    try {
      const res = await fetch(
        `http://localhost:3001/api/clienteupdate/${userId}`,
        {
          method: "PUT",
          credentials: "include",
          body: formData,
        }
      );
      if (!res.ok) throw new Error("Falha ao salvar perfil");
      alert("Perfil atualizado com sucesso!");
      router.push(`/dashboard/${userId}`);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  // loading spinner
  if (!isClient || loading) {
    return (
      <div className="container mx-auto p-4 py-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  return (
  <div className="py-20">
    <div className="max-w-2xl mx-auto p-4 border border-black p-20 py-6">
      <h1 className="text-2xl font-bold mb-4">Editar Perfil</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-blue-500">Perfil</h2>
          <div>
            <label className="block font-medium mb-1">Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Telefone</label>
            <input
              type="tel"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
        </section>

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 disabled:opacity-50 text-white px-4 py-2 rounded"
        >
          {saving ? "Salvando…" : "Salvar"}
        </button>
      </form>
    </div>
  </div>
  );
}
