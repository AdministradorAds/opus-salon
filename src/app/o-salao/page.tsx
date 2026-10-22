import Link from "next/link";
import type { Metadata } from "next";
import { readDb } from "@/lib/store";

export const metadata: Metadata = {
  title: "O Salão",
  description:
    "40 anos de arte e cuidado no Shopping Flamboyant. Conheça a história do OPUS SALON.",
};

export default async function OSalaoPage() {
  const db = await readDb();

  return (
    <div>
      <section className="hero-plane px-5 py-24 text-ivory md:px-8 md:py-32">
        <div className="mx-auto max-w-4xl">
          <p className="text-[0.7rem] tracking-[0.28em] uppercase text-gold-soft">
            O salão
          </p>
          <h1 className="mt-4 font-serif text-5xl md:text-6xl">
            Quarenta anos de arte viva
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ivory/80">
            {db.settings.subtitle}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-20 md:px-8">
        <h2 className="font-serif text-3xl text-ink">Atmosfera sensorial</h2>
        <p className="mt-5 text-base leading-relaxed text-muted">
          O OPUS SALON foi pensado para acolher. Lavatórios, estações de
          atendimento e áreas de manicure compõem um espaço onde conforto e
          técnica caminham juntos. Cada detalhe — da iluminação ao ritmo do
          atendimento — reforça a confiança de quem busca excelência sem
          ostentação.
        </p>
        <p className="mt-5 text-base leading-relaxed text-muted">
          Fotografias reais do ambiente serão publicadas com autorização do
          salão. Até lá, convidamos você a conhecer o espaço pessoalmente no
          Shopping Flamboyant.
        </p>

        <div className="mt-12 grid gap-4 border border-[var(--line)] p-6 sm:grid-cols-3">
          {["Acolhimento", "Precisão técnica", "Atenção ao detalhe"].map(
            (item) => (
              <p
                key={item}
                className="font-serif text-xl text-ink sm:text-center"
              >
                {item}
              </p>
            ),
          )}
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/agendar" className="btn-primary">
            Agendar visita
          </Link>
          <a
            href={db.settings.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-outline"
          >
            Como chegar
          </a>
        </div>
      </section>
    </div>
  );
}
