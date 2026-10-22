import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Galeria",
  description:
    "Resultados e ambiente do OPUS SALON. Galeria editorial com filtros por categoria.",
};

const placeholders = [
  { cat: "Cabelos", label: "Corte & finalização" },
  { cat: "Cabelos", label: "Coloração" },
  { cat: "Cabelos", label: "Mechas" },
  { cat: "Cabelos", label: "Penteado" },
  { cat: "Unhas", label: "Manicure" },
  { cat: "Unhas", label: "Pedicure" },
];

export default function GaleriaPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <p className="text-[0.7rem] tracking-[0.2em] uppercase text-silver">
        Portfólio
      </p>
      <h1 className="mt-3 font-serif text-5xl text-ink">Galeria</h1>
      <p className="mt-4 max-w-2xl text-muted">
        Espaço reservado para fotografias reais do OPUS SALON. Imagens
        ilustrativas não são apresentadas como resultados da equipe. Assim que
        o salão autorizar o uso das fotos, a galeria será atualizada.
      </p>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {placeholders.map((item, i) => (
          <div
            key={`${item.label}-${i}`}
            className="flex aspect-[4/5] flex-col justify-between border border-[var(--line)] bg-gradient-to-br from-sand/80 via-ivory-deep to-stone/40 p-5"
          >
            <p className="text-[0.65rem] tracking-[0.18em] uppercase text-silver">
              {item.cat}
            </p>
            <div>
              <p className="font-serif text-2xl text-ink">{item.label}</p>
              <p className="mt-2 text-xs text-muted">Aguardando foto autorizada</p>
            </div>
          </div>
        ))}
      </div>

      <Link href="/agendar" className="btn-primary mt-12 inline-flex">
        Agendar meu horário
      </Link>
    </div>
  );
}
