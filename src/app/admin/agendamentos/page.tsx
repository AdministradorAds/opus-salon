import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { readDb } from "@/lib/store";
import { BookingStatusActions } from "@/components/BookingStatusActions";

export default async function AdminBookingsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  const db = await readDb();
  const list = [...db.bookings].sort((a, b) =>
    `${b.date}${b.startTime}`.localeCompare(`${a.date}${a.startTime}`),
  );

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:px-8">
      <Link href="/admin" className="text-[0.7rem] tracking-[0.14em] uppercase text-silver">
        ← Painel
      </Link>
      <h1 className="mt-4 font-serif text-4xl text-ink">Agendamentos</h1>
      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-[0.65rem] tracking-[0.14em] uppercase text-silver">
            <tr className="border-b border-[var(--line)]">
              <th className="py-3 pr-3 font-medium">Quando</th>
              <th className="py-3 pr-3 font-medium">Cliente</th>
              <th className="py-3 pr-3 font-medium">Serviço</th>
              <th className="py-3 pr-3 font-medium">Profissional</th>
              <th className="py-3 pr-3 font-medium">Status</th>
              <th className="py-3 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {list.map((b) => {
              const client = db.clients.find((c) => c.id === b.clientId);
              const service = db.services.find((s) => s.id === b.serviceId);
              const pro = db.professionals.find((p) => p.id === b.professionalId);
              return (
                <tr key={b.id} className="border-b border-[var(--line)]">
                  <td className="py-3 pr-3 whitespace-nowrap">
                    {b.date} {b.startTime}
                  </td>
                  <td className="py-3 pr-3">
                    {client?.name}
                    <br />
                    <span className="text-muted">{client?.phone}</span>
                  </td>
                  <td className="py-3 pr-3">{service?.name}</td>
                  <td className="py-3 pr-3">{pro?.name}</td>
                  <td className="py-3 pr-3">{b.status}</td>
                  <td className="py-3">
                    <BookingStatusActions bookingId={b.id} status={b.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
