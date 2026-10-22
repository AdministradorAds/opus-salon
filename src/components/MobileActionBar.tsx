import Link from "next/link";
import { readDb } from "@/lib/store";

export async function MobileActionBar() {
  const db = await readDb();
  const wa = `https://wa.me/${db.settings.whatsapp}`;

  return (
    <div className="mobile-action-bar fixed inset-x-0 bottom-0 z-40 border-t border-[var(--line)] bg-[color-mix(in_srgb,var(--ivory)_95%,transparent)] backdrop-blur-md md:hidden">
      <div className="grid grid-cols-2 gap-2 px-3 py-2.5">
        <a
          href={wa}
          target="_blank"
          rel="noreferrer"
          className="btn-outline !py-3 text-[0.65rem]"
        >
          WhatsApp
        </a>
        <Link href="/agendar" className="btn-primary !py-3 text-[0.65rem]">
          Agendar
        </Link>
      </div>
    </div>
  );
}
