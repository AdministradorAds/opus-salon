import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { readDb, formatPrice, formatDuration } from "@/lib/store";
import { ServicePriceForm } from "@/components/ServicePriceForm";

export default async function AdminServicesPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  const db = await readDb();

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 md:px-8">
      <Link href="/admin" className="text-[0.7rem] tracking-[0.14em] uppercase text-silver">
        ← Painel
      </Link>
      <h1 className="mt-4 font-serif text-4xl text-ink">Serviços</h1>
      <p className="mt-3 text-sm text-muted">
        Cadastre preços (em reais) e duração. Deixe preço vazio para “Sob consulta”.
      </p>
      <div className="mt-10 space-y-6">
        {db.services.map((s) => (
          <div key={s.id} className="border border-[var(--line)] p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-serif text-2xl text-ink">{s.name}</h2>
                <p className="mt-1 text-xs text-muted">
                  Atual: {formatDuration(s.durationMinutes)} ·{" "}
                  {formatPrice(s.priceCents)}
                </p>
              </div>
              <span
                className={`text-[0.65rem] tracking-wide uppercase ${
                  s.active ? "text-gold" : "text-silver"
                }`}
              >
                {s.active ? "Ativo" : "Inativo"}
              </span>
            </div>
            <ServicePriceForm
              serviceId={s.id}
              durationMinutes={s.durationMinutes}
              priceCents={s.priceCents}
              active={s.active}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
