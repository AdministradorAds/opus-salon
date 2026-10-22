import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { readDb, formatPrice, formatDuration } from "@/lib/store";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const db = await readDb();
  const service = db.services.find((s) => s.slug === slug);
  if (!service) return { title: "Serviço" };
  return {
    title: service.name,
    description: service.description,
  };
}

export default async function ServicoDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const db = await readDb();
  const service = db.services.find((s) => s.slug === slug && s.active);
  if (!service) notFound();

  const cat = db.categories.find((c) => c.id === service.categoryId);
  const pros = db.professionals.filter(
    (p) => p.active && service.professionalIds.includes(p.id),
  );

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
      <Link
        href="/servicos"
        className="text-[0.7rem] tracking-[0.14em] uppercase text-silver hover:text-ink"
      >
        ← Serviços
      </Link>
      <p className="mt-8 text-[0.7rem] tracking-[0.2em] uppercase text-silver">
        {cat?.name}
      </p>
      <h1 className="mt-3 font-serif text-5xl text-ink">{service.name}</h1>
      <p className="mt-6 text-lg leading-relaxed text-muted">{service.description}</p>

      <dl className="mt-10 grid gap-4 border-y border-[var(--line)] py-8 sm:grid-cols-2">
        <div>
          <dt className="text-[0.65rem] tracking-[0.16em] uppercase text-silver">
            Duração
          </dt>
          <dd className="mt-1 text-ink">{formatDuration(service.durationMinutes)}</dd>
        </div>
        <div>
          <dt className="text-[0.65rem] tracking-[0.16em] uppercase text-silver">
            Investimento
          </dt>
          <dd className="mt-1 text-ink">{formatPrice(service.priceCents)}</dd>
        </div>
      </dl>

      {service.benefits.length > 0 && (
        <div className="mt-10">
          <h2 className="font-serif text-2xl text-ink">Benefícios</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            {service.benefits.map((b) => (
              <li key={b} className="flex gap-2">
                <span className="text-gold">—</span> {b}
              </li>
            ))}
          </ul>
        </div>
      )}

      {service.requiresConsultation && (
        <p className="mt-8 border border-gold/30 bg-sand/30 px-5 py-4 text-sm text-graphite">
          Este serviço pode exigir avaliação prévia do fio ou da pele. Ao
          agendar, a equipe poderá confirmar o protocolo ideal.
        </p>
      )}

      <div className="mt-10">
        <h2 className="font-serif text-2xl text-ink">Profissionais</h2>
        <ul className="mt-4 space-y-2 text-sm text-muted">
          {pros.map((p) => (
            <li key={p.id}>{p.name}</li>
          ))}
        </ul>
      </div>

      <Link
        href={`/agendar?servico=${service.id}`}
        className="btn-primary mt-12 inline-flex"
      >
        Agendar este serviço
      </Link>
    </div>
  );
}
