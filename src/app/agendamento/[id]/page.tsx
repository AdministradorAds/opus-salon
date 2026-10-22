import Link from "next/link";
import { notFound } from "next/navigation";
import { CancelBookingButton } from "@/components/CancelBookingButton";
import { readDb, formatPrice } from "@/lib/store";

export default async function AgendamentoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { id } = await params;
  const { token } = await searchParams;
  const db = await readDb();
  const booking = db.bookings.find((b) => b.id === id);
  if (!booking || !token || booking.cancelToken !== token) notFound();

  const service = db.services.find((s) => s.id === booking.serviceId);
  const pro = db.professionals.find((p) => p.id === booking.professionalId);
  const client = db.clients.find((c) => c.id === booking.clientId);

  const statusLabel: Record<string, string> = {
    solicitado: "Aguardando confirmação",
    confirmado: "Confirmado",
    cancelado: "Cancelado",
    concluido: "Concluído",
    nao_compareceu: "Não compareceu",
  };

  return (
    <div className="mx-auto max-w-xl px-5 py-16 md:px-8 md:py-24">
      <p className="text-[0.7rem] tracking-[0.2em] uppercase text-silver">
        Seu agendamento
      </p>
      <h1 className="mt-3 font-serif text-4xl text-ink">
        {statusLabel[booking.status] || booking.status}
      </h1>
      <dl className="mt-10 space-y-4 text-sm">
        <div className="flex justify-between border-b border-[var(--line)] pb-3">
          <dt className="text-silver">Serviço</dt>
          <dd className="text-ink">{service?.name}</dd>
        </div>
        <div className="flex justify-between border-b border-[var(--line)] pb-3">
          <dt className="text-silver">Profissional</dt>
          <dd className="text-ink">{pro?.name}</dd>
        </div>
        <div className="flex justify-between border-b border-[var(--line)] pb-3">
          <dt className="text-silver">Quando</dt>
          <dd className="text-ink">
            {booking.date} · {booking.startTime}–{booking.endTime}
          </dd>
        </div>
        <div className="flex justify-between border-b border-[var(--line)] pb-3">
          <dt className="text-silver">Cliente</dt>
          <dd className="text-ink">{client?.name}</dd>
        </div>
        <div className="flex justify-between border-b border-[var(--line)] pb-3">
          <dt className="text-silver">Valor</dt>
          <dd className="text-ink">{formatPrice(service?.priceCents ?? null)}</dd>
        </div>
      </dl>

      {(booking.status === "solicitado" || booking.status === "confirmado") && (
        <CancelBookingButton bookingId={booking.id} token={token} />
      )}

      <Link href="/" className="mt-8 inline-block text-sm text-muted underline">
        Voltar ao site
      </Link>
    </div>
  );
}
