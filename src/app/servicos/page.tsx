import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { readDb, formatPrice, formatDuration } from "@/lib/store";
import type { ServiceCategoryId } from "@/lib/types";
import { ServicesFilter } from "@/components/ServicesFilter";

export const metadata: Metadata = {
  title: "Serviços",
  description:
    "Cabelos, unhas, beleza facial e maquiagem no OPUS SALON — Shopping Flamboyant, Goiânia.",
};

export default async function ServicosPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; q?: string }>;
}) {
  const { categoria, q } = await searchParams;
  const db = await readDb();
  const query = (q || "").trim().toLowerCase();
  const cat = categoria as ServiceCategoryId | undefined;

  let list = db.services.filter((s) => s.active);
  if (cat) list = list.filter((s) => s.categoryId === cat);
  if (query) {
    list = list.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query),
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <p className="text-[0.7rem] tracking-[0.2em] uppercase text-silver">
        Catálogo
      </p>
      <h1 className="mt-3 font-serif text-5xl text-ink">Serviços</h1>
      <p className="mt-4 max-w-2xl text-muted">
        Organize sua escolha por categoria. Preços e durações definitivos são
        cadastrados pela administração — o que ainda não estiver definido
        aparece como sob consulta.
      </p>

      <Suspense fallback={<div className="mt-10 h-20 animate-pulse bg-sand/40" />}>
        <ServicesFilter categories={db.categories} />
      </Suspense>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((s) => {
          const c = db.categories.find((x) => x.id === s.categoryId);
          return (
            <Link
              key={s.id}
              href={`/servicos/${s.slug}`}
              className="border border-[var(--line)] bg-ivory p-6 transition hover:border-ink/25"
            >
              <p className="text-[0.65rem] tracking-[0.18em] uppercase text-silver">
                {c?.name}
              </p>
              <h2 className="mt-2 font-serif text-2xl text-ink">{s.name}</h2>
              <p className="mt-3 line-clamp-3 text-sm text-muted">{s.description}</p>
              <p className="mt-5 text-xs text-graphite">
                {formatDuration(s.durationMinutes)} · {formatPrice(s.priceCents)}
              </p>
              {s.requiresConsultation && (
                <p className="mt-2 text-[0.65rem] tracking-wide text-gold uppercase">
                  Avaliação prévia recomendada
                </p>
              )}
            </Link>
          );
        })}
      </div>

      {list.length === 0 && (
        <p className="mt-12 text-muted">Nenhum serviço encontrado com esses filtros.</p>
      )}
    </div>
  );
}
