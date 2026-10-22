import Link from "next/link";
import type { Metadata } from "next";
import { readDb } from "@/lib/store";

export const metadata: Metadata = {
  title: "Nossa Equipe",
  description: "Conheça os profissionais do OPUS SALON e agende com quem preferir.",
};

export default async function EquipePage() {
  const db = await readDb();
  const team = db.professionals.filter((p) => p.active && !p.isAnyAvailable);
  const anyPro = db.professionals.find((p) => p.isAnyAvailable);

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <p className="text-[0.7rem] tracking-[0.2em] uppercase text-silver">
        Pessoas
      </p>
      <h1 className="mt-3 font-serif text-5xl text-ink">Nossa equipe</h1>
      <p className="mt-4 max-w-2xl text-muted">
        Perfis com foto, especialidades e agenda individual serão publicados
        conforme autorização do salão. Não exibimos profissionais fictícios.
      </p>

      {team.length === 0 ? (
        <div className="mt-12 max-w-2xl border border-[var(--line)] p-8 md:p-10">
          <h2 className="font-serif text-3xl text-ink">Em breve, os rostos do OPUS</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            {anyPro?.bio}
          </p>
          <Link href="/agendar" className="btn-primary mt-8 inline-flex">
            Agendar com profissional disponível
          </Link>
        </div>
      ) : (
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((p) => (
            <article key={p.id} className="border border-[var(--line)]">
              <div className="flex h-56 items-end bg-gradient-to-br from-sand via-ivory-deep to-stone/50 p-6">
                <h2 className="font-serif text-3xl text-ink">{p.name}</h2>
              </div>
              <div className="p-6">
                <p className="text-[0.7rem] tracking-[0.14em] uppercase text-silver">
                  {p.specialties.join(" · ")}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted">{p.bio}</p>
                <Link
                  href={`/agendar?profissional=${p.id}`}
                  className="btn-outline mt-6 inline-flex !py-2.5 text-[0.65rem]"
                >
                  Agendar com este profissional
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
