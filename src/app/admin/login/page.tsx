"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@opussalon.local");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Falha no login.");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-5 py-16">
      <h1 className="font-serif text-4xl text-ink">Admin</h1>
      <p className="mt-2 text-sm text-muted">Acesso restrito à equipe OPUS SALON.</p>
      <form onSubmit={onSubmit} className="mt-10 space-y-5">
        <label className="block">
          <span className="text-[0.7rem] tracking-[0.14em] uppercase text-silver">
            E-mail
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full border border-[var(--line)] bg-transparent px-4 py-3 outline-none focus:border-ink"
            required
          />
        </label>
        <label className="block">
          <span className="text-[0.7rem] tracking-[0.14em] uppercase text-silver">
            Senha
          </span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full border border-[var(--line)] bg-transparent px-4 py-3 outline-none focus:border-ink"
            required
          />
        </label>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}
