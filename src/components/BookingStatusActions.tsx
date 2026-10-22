"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function BookingStatusActions({
  bookingId,
  status,
}: {
  bookingId: string;
  status: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function setStatus(next: string) {
    setLoading(true);
    try {
      await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-1">
      {status === "solicitado" && (
        <button
          type="button"
          disabled={loading}
          onClick={() => setStatus("confirmado")}
          className="border border-ink px-2 py-1 text-[0.65rem] uppercase tracking-wide disabled:opacity-40"
        >
          Confirmar
        </button>
      )}
      {(status === "solicitado" || status === "confirmado") && (
        <button
          type="button"
          disabled={loading}
          onClick={() => setStatus("cancelado")}
          className="border border-[var(--line)] px-2 py-1 text-[0.65rem] uppercase tracking-wide disabled:opacity-40"
        >
          Cancelar
        </button>
      )}
      {status === "confirmado" && (
        <button
          type="button"
          disabled={loading}
          onClick={() => setStatus("concluido")}
          className="border border-[var(--line)] px-2 py-1 text-[0.65rem] uppercase tracking-wide disabled:opacity-40"
        >
          Concluir
        </button>
      )}
    </div>
  );
}
