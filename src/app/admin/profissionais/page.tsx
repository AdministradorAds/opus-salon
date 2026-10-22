import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { readDb } from "@/lib/store";
import { ProfessionalForm } from "@/components/ProfessionalForm";

export default async function AdminProsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  const db = await readDb();

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 md:px-8">
      <Link href="/admin" className="text-[0.7rem] tracking-[0.14em] uppercase text-silver">
        ← Painel
      </Link>
      <h1 className="mt-4 font-serif text-4xl text-ink">Profissionais</h1>
      <p className="mt-3 text-sm text-muted">
        Cadastre membros reais da equipe. Nomes fictícios não devem ser publicados.
      </p>

      <div className="mt-10 space-y-8">
        {db.professionals.map((p) => (
          <div key={p.id} className="border border-[var(--line)] p-5">
            <h2 className="font-serif text-2xl text-ink">{p.name}</h2>
            <p className="mt-1 text-xs text-muted">
              {p.isAnyAvailable ? "Slot genérico do sistema" : "Profissional"}
            </p>
            {!p.isAnyAvailable && (
              <ProfessionalForm
                professionalId={p.id}
                name={p.name}
                bio={p.bio}
                specialties={p.specialties.join(", ")}
                active={p.active}
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 border border-[var(--line)] p-5">
        <h2 className="font-serif text-2xl text-ink">Novo profissional</h2>
        <ProfessionalForm create />
      </div>
    </div>
  );
}
