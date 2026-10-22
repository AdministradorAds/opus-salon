"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ServicePriceForm({
  serviceId,
  durationMinutes,
  priceCents,
  active,
}: {
  serviceId: string;
  durationMinutes: number | null;
  priceCents: number | null;
  active: boolean;
}) {
  const router = useRouter();
  const [duration, setDuration] = useState(durationMinutes?.toString() || "");
  const [price, setPrice] = useState(
    priceCents !== null ? (priceCents / 100).toFixed(2).replace(".", ",") : "",
  );
  const [isActive, setIsActive] = useState(active);
  const [msg, setMsg] = useState("");

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    const normalized = price.replace(/\./g, "").replace(",", ".");
    const reais = normalized.trim() === "" ? null : Number(normalized);
    const cents =
      reais === null || Number.isNaN(reais) ? null : Math.round(reais * 100);
    const dur = duration.trim() === "" ? null : Number(duration);

    const res = await fetch(`/api/admin/services/${serviceId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        durationMinutes: dur,
        priceCents: cents,
        active: isActive,
      }),
    });
    if (!res.ok) {
      setMsg("Erro ao salvar.");
      return;
    }
    setMsg("Salvo.");
    router.refresh();
  }

  return (
    <form onSubmit={save} className="mt-5 grid gap-3 sm:grid-cols-4 sm:items-end">
      <label className="block text-xs">
        <span className="text-silver">Duração (min)</span>
        <input
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="mt-1 w-full border border-[var(--line)] bg-transparent px-3 py-2"
        />
      </label>
      <label className="block text-xs">
        <span className="text-silver">Preço (R$)</span>
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Sob consulta"
          className="mt-1 w-full border border-[var(--line)] bg-transparent px-3 py-2"
        />
      </label>
      <label className="flex items-center gap-2 text-xs pb-2">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
        Ativo no site
      </label>
      <button type="submit" className="btn-primary !py-2 text-[0.65rem]">
        Salvar
      </button>
      {msg && <p className="text-xs text-muted sm:col-span-4">{msg}</p>}
    </form>
  );
}
