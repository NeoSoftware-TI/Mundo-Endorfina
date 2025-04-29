"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { decodeJwt } from "jose";

type DecodedToken = { id: number };
interface UserProfile {
  nome: string;
  email: string;
  telefone: string;
  foto_url: string | null;
}

export default function EditProfilePage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| FOTO
  const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| FOTO

  function getUserIdFromToken(): number | null {
    const t = localStorage.getItem("token");
    if (!t) return null;
    try { return decodeJwt<DecodedToken>(t).id; }
    catch { return null; }
  }

  useEffect(() => { setIsClient(true); }, []);

  useEffect(() => {
    if (!isClient) return;
    const t = localStorage.getItem("token");
    if (!t) return router.replace("/login");
    const id = getUserIdFromToken();
    if (!id) return router.replace("/login");
    setUserId(id);
    setLoading(false);
  }, [isClient, router]);

  useEffect(() => {
    if (!userId) return;
  
    fetch(`${API_BASE}/api/pessoasconfig/${userId}`, { credentials: "include" })
      .then((r) =>
        r.ok
          ? r.json()
          : Promise.reject("Erro ao carregar perfil")
      )
      .then((d: UserProfile) => {
        setNome(d.nome);
        setEmail(d.email);
        setTelefone(d.telefone);
  
        // Se existir foto_url, monta a URL completa
        if (d.foto_url) {
          setFotoUrl(`${API_BASE}${d.foto_url}`);
        }
      })
      .catch(console.error);
  }, [userId]);

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFotoFile(f);
      setFotoUrl(URL.createObjectURL(f));
    }
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!userId) return;
    setSaving(true);

    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("email", email);
    formData.append("telefone", telefone);
    if (fotoFile) formData.append("foto", fotoFile);
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| FOTO
    try {
      const res = await fetch(`http://localhost:3001/api/colocarFoto/${userId}`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro desconhecido");
      alert(data.message);
      router.push(`/dashboard/${userId}`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| FOTO
  if (!isClient || loading) {
    return <div className="container mx-auto py-20 text-center">Carregando…</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Editar Perfil</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nome, Email, Telefone */}
        <label className="block">
          Nome
          <input
            value={nome}
            onChange={e => setNome(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          />
        </label>
        <label className="block">
          Email
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          />
        </label>
        <label className="block">
          Telefone
          <input
            value={telefone}
            onChange={e => setTelefone(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          />
        </label>
        {/* Foto */}
        <div>
          <p>Foto de Perfil</p>
          {fotoUrl ? (
            <img
              src={fotoUrl}
              alt="Minha foto"
              className="w-24 h-24 rounded-full mb-2"
            />
          ) : (
            <div className="w-24 h-24 rounded-full mb-2 bg-gray-200 flex items-center justify-center">
              {/* Ícone de placeholder, se quiser */}
              Sem foto
            </div>
          )}
          <input type="file" accept="image/*" onChange={handlePhotoChange} />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {saving ? "Salvando…" : "Salvar"}
        </button>
      </form>
    </div>
  );
}
