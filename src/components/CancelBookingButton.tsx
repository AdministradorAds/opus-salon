"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function CancelBookingButton({
  bookingId,
  token,
}: {
  bookingId: string;
  token: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function cancel() {
    if (!confirm("Deseja realmente cancelar este agendamento?")) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Não foi possível cancelar.");
        return;
      }
      router.refresh();
    } catch {
      setError("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8">
      <button
        type="button"
        onClick={cancel}
        disabled={loading}
        className="btn-outline disabled:opacity-40"
      >
        {loading ? "Cancelando…" : "Cancelar agendamento"}
      </button>
      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
    </div>
  );
}
