import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { readDb, formatPrice } from "@/lib/store";
import { AdminLogoutButton } from "@/components/AdminLogoutButton";
import { BookingStatusActions } from "@/components/BookingStatusActions";

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const db = await readDb();
  const today = new Date().toISOString().slice(0, 10);
  const todayBookings = db.bookings
    .filter((b) => b.date === today && b.status !== "cancelado")
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
  const upcoming = db.bookings
    .filter(
      (b) =>
        b.date >= today &&
        (b.status === "solicitado" || b.status === "confirmado"),
    )
    .sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`))
    .slice(0, 20);
  const pending = db.bookings.filter((b) => b.status === "solicitado").length;
  const cancelled = db.bookings.filter((b) => b.status === "cancelado").length;

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[0.7rem] tracking-[0.2em] uppercase text-silver">
            Painel
          </p>
          <h1 className="mt-2 font-serif text-4xl text-ink">Olá, {session.name}</h1>
        </div>
        <AdminLogoutButton />
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <div className="border border-[var(--line)] p-5">
          <p className="text-[0.65rem] tracking-[0.16em] uppercase text-silver">
            Hoje
          </p>
          <p className="mt-2 font-serif text-4xl text-ink">{todayBookings.length}</p>
        </div>
        <div className="border border-[var(--line)] p-5">
          <p className="text-[0.65rem] tracking-[0.16em] uppercase text-silver">
            Aguardando
          </p>
          <p className="mt-2 font-serif text-4xl text-ink">{pending}</p>
        </div>
        <div className="border border-[var(--line)] p-5">
          <p className="text-[0.65rem] tracking-[0.16em] uppercase text-silver">
            Cancelados
          </p>
          <p className="mt-2 font-serif text-4xl text-ink">{cancelled}</p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/admin/agendamentos" className="btn-outline !py-2.5 text-[0.65rem]">
          Todos os agendamentos
        </Link>
        <Link href="/admin/servicos" className="btn-outline !py-2.5 text-[0.65rem]">
          Serviços
        </Link>
        <Link href="/admin/profissionais" className="btn-outline !py-2.5 text-[0.65rem]">
          Profissionais
        </Link>
      </div>

      <h2 className="mt-14 font-serif text-2xl text-ink">Próximos atendimentos</h2>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="text-[0.65rem] tracking-[0.14em] uppercase text-silver">
            <tr className="border-b border-[var(--line)]">
              <th className="py-3 pr-4 font-medium">Data</th>
              <th className="py-3 pr-4 font-medium">Cliente</th>
              <th className="py-3 pr-4 font-medium">Serviço</th>
              <th className="py-3 pr-4 font-medium">Status</th>
              <th className="py-3 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {upcoming.map((b) => {
              const client = db.clients.find((c) => c.id === b.clientId);
              const service = db.services.find((s) => s.id === b.serviceId);
              return (
                <tr key={b.id} className="border-b border-[var(--line)]">
                  <td className="py-3 pr-4 whitespace-nowrap">
                    {b.date}
                    <br />
                    <span className="text-muted">
                      {b.startTime}–{b.endTime}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    {client?.name}
                    <br />
                    <span className="text-muted">{client?.phone}</span>
                  </td>
                  <td className="py-3 pr-4">
                    {service?.name}
                    <br />
                    <span className="text-muted">
                      {formatPrice(service?.priceCents ?? null)}
                    </span>
                  </td>
                  <td className="py-3 pr-4 capitalize">{b.status.replace("_", " ")}</td>
                  <td className="py-3">
                    <BookingStatusActions bookingId={b.id} status={b.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {upcoming.length === 0 && (
          <p className="mt-4 text-sm text-muted">Nenhum agendamento futuro.</p>
        )}
      </div>
    </div>
  );
}
