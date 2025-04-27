"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import jwtDecode from "jwt-decode";

type DecodedToken = { id: number; tipo: string; exp: number };

// esquema dos dados que chegam da API
interface UserProfile {
  nome: string;
  foto_url: string | null;
}

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // estados dos formulários
  const [name, setName] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  // extrai o ID do user do token
  function getUserIdFromToken(): number | null {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      return (jwtDecode<DecodedToken>(token)).id;
    } catch {
      return null;
    }
  }

  const userId = getUserIdFromToken();
  if (userId === null) {

    useEffect(() => router.replace("/login"), [router]);
    return null;
  }

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch(`http://localhost:3001/api/pessoas/${userId}`, {
          credentials: "include"
        });
        if (!res.ok) throw new Error("Não foi possível buscar perfil");
        const data: UserProfile = await res.json();

        // 2) pré-popula os estados
        setName(data.nome);
        setPhotoUrl(data.foto_url);

      } catch (err) {
        console.error(err);

      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [userId]);

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setPhotoFile(e.target.files[0]);
  };


  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();
    formData.append("nome", name);

    if (photoFile) formData.append("foto", photoFile);

    try {
      const res = await fetch(`http://localhost:3001/api/pessoas/${userId}`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });
      if (!res.ok) throw new Error("Falha ao salvar");
      router.push("/login/" + userId);
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar perfil");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="p-4">Carregando perfil…</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Editar Perfil</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Seção Perfil */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Perfil</h2>
          <div>
            <label className="block font-medium mb-1">Nome</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Foto de Perfil</label>
            {photoUrl && !photoFile && (
              <img
                src={photoUrl}
                alt="Perfil"
                className="mb-2 w-24 h-24 object-cover rounded-full"
              />
            )}
            <input type="file" accept="image/*" onChange={handlePhotoChange} />
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
  );
}
