import Link from "next/link";
import { readDb } from "@/lib/store";

export async function Footer() {
  const db = await readDb();
  const s = db.settings;

  return (
    <footer className="mt-auto border-t border-[var(--line)] bg-ivory-deep">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3 md:px-8">
        <div>
          <p className="font-serif text-2xl tracking-[0.22em] text-ink">
            OPUS SALON
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            {s.tagline}. Tradição, sensibilidade e excelência no Shopping
            Flamboyant.
          </p>
        </div>

        <div>
          <p className="text-[0.7rem] tracking-[0.18em] uppercase text-silver">
            Contato
          </p>
          <ul className="mt-4 space-y-2 text-sm text-graphite">
            <li>{s.addressShort}</li>
            {s.phones.map((p) => (
              <li key={p}>
                <a href={`tel:${p.replace(/\D/g, "")}`} className="hover:text-ink">
                  {p}
                </a>
              </li>
            ))}
            <li>
              <a
                href={`https://wa.me/${s.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-ink"
              >
                WhatsApp
              </a>
            </li>
            <li>
              <a
                href={`https://instagram.com/${s.instagram}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-ink"
              >
                @{s.instagram}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-[0.7rem] tracking-[0.18em] uppercase text-silver">
            Horários
          </p>
          <ul className="mt-4 space-y-2 text-sm text-graphite">
            {s.hoursLabel.map((h) => (
              <li key={h.days}>
                <span className="text-ink">{h.days}:</span> {h.hours}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-4 text-[0.7rem] tracking-[0.12em] uppercase text-muted">
            <Link href="/politica-de-privacidade" className="hover:text-ink">
              Privacidade
            </Link>
            <Link href="/termos-de-uso" className="hover:text-ink">
              Termos
            </Link>
            <Link href="/admin" className="hover:text-ink">
              Admin
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-[var(--line)] px-5 py-4 text-center text-xs text-silver">
        © {new Date().getFullYear()} OPUS SALON · Goiânia — GO
      </div>
    </footer>
  );
}
