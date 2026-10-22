"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { ServiceCategory } from "@/lib/types";

export function ServicesFilter({
  categories,
}: {
  categories: ServiceCategory[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const current = params.get("categoria") || "";
  const q = params.get("q") || "";

  return (
    <div className="mt-10 space-y-5">
      <div className="flex flex-wrap gap-2">
        <Link
          href={q ? `/servicos?q=${encodeURIComponent(q)}` : "/servicos"}
          className={`border px-4 py-2 text-[0.68rem] tracking-[0.14em] uppercase ${
            !current
              ? "border-ink bg-ink text-ivory"
              : "border-[var(--line)] text-graphite hover:border-ink/40"
          }`}
        >
          Todos
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/servicos?categoria=${c.id}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
            className={`border px-4 py-2 text-[0.68rem] tracking-[0.14em] uppercase ${
              current === c.id
                ? "border-ink bg-ink text-ivory"
                : "border-[var(--line)] text-graphite hover:border-ink/40"
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>
      <form
        className="flex max-w-md gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const search = String(fd.get("q") || "").trim();
          const sp = new URLSearchParams();
          if (current) sp.set("categoria", current);
          if (search) sp.set("q", search);
          router.push(`/servicos${sp.toString() ? `?${sp}` : ""}`);
        }}
      >
        <input
          name="q"
          defaultValue={q}
          placeholder="Buscar serviço…"
          className="flex-1 border border-[var(--line)] bg-transparent px-4 py-3 text-sm outline-none focus:border-ink"
        />
        <button type="submit" className="btn-outline !py-3">
          Buscar
        </button>
      </form>
    </div>
  );
}
