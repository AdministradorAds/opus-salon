import type { Metadata } from "next";
import { BookingWizard } from "@/components/BookingWizard";
import { readDb } from "@/lib/store";

export const metadata: Metadata = {
  title: "Agendar",
  description:
    "Agende seu horário no OPUS SALON — escolha serviço, profissional e horário disponível.",
};

export default async function AgendarPage({
  searchParams,
}: {
  searchParams: Promise<{ servico?: string; profissional?: string }>;
}) {
  const sp = await searchParams;
  const db = await readDb();

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
      <p className="text-[0.7rem] tracking-[0.2em] uppercase text-silver">
        Agenda
      </p>
      <h1 className="mt-3 font-serif text-5xl text-ink">Agendar horário</h1>
      <p className="mt-4 text-muted">
        Fluxo simples: serviço → profissional → data → seus dados. Horários
        ocupados não aparecem como disponíveis.
      </p>
      <div className="mt-10">
        <BookingWizard
          categories={db.categories}
          services={db.services}
          professionals={db.professionals}
          cancelPolicy={db.settings.cancelPolicy}
          requireManualConfirmation={db.settings.requireManualConfirmation}
          initialServiceId={sp.servico}
          initialProfessionalId={sp.profissional}
        />
      </div>
    </div>
  );
}
