"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Início" },
  { href: "/servicos", label: "Serviços" },
  { href: "/equipe", label: "Nossa Equipe" },
  { href: "/o-salao", label: "O Salão" },
  { href: "/galeria", label: "Galeria" },
  { href: "/contato", label: "Contato" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--ivory)_92%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 md:px-8">
        <Link
          href="/"
          className="font-serif text-xl tracking-[0.28em] text-ink md:text-2xl"
          onClick={() => setOpen(false)}
        >
          OPUS SALON
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((l) => {
            const active =
              l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`text-[0.72rem] tracking-[0.16em] uppercase transition-colors ${
                  active ? "text-ink" : "text-muted hover:text-ink"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <Link href="/agendar" className="btn-primary !py-2.5 !px-4 text-[0.68rem]">
            Agendar
          </Link>
        </nav>

        <button
          type="button"
          className="lg:hidden text-[0.72rem] tracking-[0.16em] uppercase text-ink"
          aria-expanded={open}
          aria-label="Abrir menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Fechar" : "Menu"}
        </button>
      </div>

      {open && (
        <div className="border-t border-[var(--line)] bg-ivory px-5 py-6 lg:hidden">
          <nav className="flex flex-col gap-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm tracking-[0.12em] uppercase text-graphite"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/agendar"
              className="btn-primary mt-2 w-full"
              onClick={() => setOpen(false)}
            >
              Agendar meu horário
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
