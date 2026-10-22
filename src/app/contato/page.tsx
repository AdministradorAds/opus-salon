import type { Metadata } from "next";
import { readDb } from "@/lib/store";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Telefones, WhatsApp, Instagram e endereço do OPUS SALON no Shopping Flamboyant.",
};

export default async function ContatoPage() {
  const { settings: s } = await readDb();
  const waMsg = encodeURIComponent(
    "Olá! Vim pelo site e gostaria de informações.",
  );

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <p className="text-[0.7rem] tracking-[0.2em] uppercase text-silver">
        Fale conosco
      </p>
      <h1 className="mt-3 font-serif text-5xl text-ink">Contato</h1>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <div className="space-y-8">
          <div>
            <h2 className="text-[0.7rem] tracking-[0.18em] uppercase text-silver">
              Endereço
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-graphite">{s.address}</p>
            <a
              href={s.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block text-[0.72rem] tracking-[0.14em] uppercase text-ink underline-offset-4 hover:underline"
            >
              Abrir rota no Google Maps
            </a>
          </div>

          <div>
            <h2 className="text-[0.7rem] tracking-[0.18em] uppercase text-silver">
              Telefones
            </h2>
            <ul className="mt-3 space-y-2">
              {s.phones.map((p) => (
                <li key={p}>
                  <a
                    href={`tel:${p.replace(/\D/g, "")}`}
                    className="text-lg text-ink hover:text-graphite"
                  >
                    {p}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={`https://wa.me/${s.whatsapp}?text=${waMsg}`}
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
            >
              WhatsApp
            </a>
            <a
              href={`https://instagram.com/${s.instagram}`}
              target="_blank"
              rel="noreferrer"
              className="btn-outline"
            >
              @{s.instagram}
            </a>
          </div>

          <div>
            <h2 className="text-[0.7rem] tracking-[0.18em] uppercase text-silver">
              Horários
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-graphite">
              {s.hoursLabel.map((h) => (
                <li key={h.days}>
                  <strong className="font-medium text-ink">{h.days}:</strong>{" "}
                  {h.hours}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="min-h-[320px] border border-[var(--line)] bg-ivory-deep/50 p-2">
          <iframe
            title="Mapa OPUS SALON"
            className="h-full min-h-[320px] w-full grayscale contrast-90"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=Shopping+Flamboyant+Goi%C3%A2nia&output=embed"
          />
        </div>
      </div>
    </div>
  );
}
