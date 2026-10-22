"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ProfessionalForm({
  create,
  professionalId,
  name: initialName = "",
  bio: initialBio = "",
  specialties: initialSpec = "",
  active: initialActive = true,
}: {
  create?: boolean;
  professionalId?: string;
  name?: string;
  bio?: string;
  specialties?: string;
  active?: boolean;
}) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [bio, setBio] = useState(initialBio);
  const [specialties, setSpecialties] = useState(initialSpec);
  const [active, setActive] = useState(initialActive);
  const [msg, setMsg] = useState("");

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    const url = create
      ? "/api/admin/professionals"
      : `/api/admin/professionals/${professionalId}`;
    const res = await fetch(url, {
      method: create ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, bio, specialties, active }),
    });
    if (!res.ok) {
      setMsg("Erro ao salvar.");
      return;
    }
    setMsg("Salvo.");
    if (create) {
      setName("");
      setBio("");
      setSpecialties("");
    }
    router.refresh();
  }

  return (
    <form onSubmit={save} className="mt-5 space-y-3">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nome"
        required
        className="w-full border border-[var(--line)] bg-transparent px-3 py-2 text-sm"
      />
      <input
        value={specialties}
        onChange={(e) => setSpecialties(e.target.value)}
        placeholder="Especialidades (separadas por vírgula)"
        className="w-full border border-[var(--line)] bg-transparent px-3 py-2 text-sm"
      />
      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Mini biografia"
        rows={3}
        className="w-full border border-[var(--line)] bg-transparent px-3 py-2 text-sm"
      />
      <label className="flex items-center gap-2 text-xs">
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
        />
        Disponível para agendamento
      </label>
      <button type="submit" className="btn-primary !py-2 text-[0.65rem]">
        {create ? "Cadastrar" : "Salvar"}
      </button>
      {msg && <p className="text-xs text-muted">{msg}</p>}
    </form>
  );
}
