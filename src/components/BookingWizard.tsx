"use client";

import { useEffect, useMemo, useState } from "react";
import { addDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Professional, Service, ServiceCategory } from "@/lib/types";

type Props = {
  categories: ServiceCategory[];
  services: Service[];
  professionals: Professional[];
  cancelPolicy: string;
  requireManualConfirmation: boolean;
  initialServiceId?: string;
  initialProfessionalId?: string;
};

export function BookingWizard({
  categories,
  services,
  professionals,
  cancelPolicy,
  requireManualConfirmation,
  initialServiceId,
  initialProfessionalId,
}: Props) {
  const [step, setStep] = useState(1);
  const [categoryId, setCategoryId] = useState<string>("");
  const [serviceId, setServiceId] = useState(initialServiceId || "");
  const [professionalId, setProfessionalId] = useState(
    initialProfessionalId || "any",
  );
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [accept, setAccept] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<{
    id: string;
    status: string;
    cancelToken: string;
  } | null>(null);

  const activeServices = useMemo(
    () =>
      services.filter(
        (s) => s.active && (!categoryId || s.categoryId === categoryId),
      ),
    [services, categoryId],
  );

  const service = services.find((s) => s.id === serviceId);
  const proList = professionals.filter((p) => p.active);

  useEffect(() => {
    if (initialServiceId) {
      const s = services.find((x) => x.id === initialServiceId);
      if (s) setCategoryId(s.categoryId);
      setStep(2);
    }
  }, [initialServiceId, services]);

  useEffect(() => {
    if (!serviceId || !date) {
      setSlots([]);
      return;
    }
    let cancelled = false;
    setLoadingSlots(true);
    setStartTime("");
    const pro = professionalId || "any";
    fetch(
      `/api/availability?serviceId=${serviceId}&professionalId=${pro}&date=${date}`,
    )
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setSlots(data.slots || []);
      })
      .catch(() => {
        if (!cancelled) setSlots([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingSlots(false);
      });
    return () => {
      cancelled = true;
    };
  }, [serviceId, professionalId, date]);

  const dates = Array.from({ length: 21 }, (_, i) => {
    const d = addDays(new Date(), i);
    return format(d, "yyyy-MM-dd");
  });

  async function submit() {
    setError("");
    if (!accept) {
      setError("Aceite a política de privacidade e os termos para continuar.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId,
          professionalId,
          date,
          startTime,
          name,
          phone,
          email: email || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Não foi possível concluir o agendamento.");
        return;
      }
      setDone(data.booking);
      setStep(5);
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="border border-[var(--line)] bg-ivory p-8 md:p-10">
        <p className="text-[0.7rem] tracking-[0.2em] uppercase text-gold">
          Solicitação recebida
        </p>
        <h2 className="mt-3 font-serif text-3xl text-ink">
          {requireManualConfirmation
            ? "Aguardando confirmação"
            : "Agendamento confirmado"}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          {requireManualConfirmation
            ? "Sua solicitação foi salva. A equipe do OPUS SALON confirmará o horário em breve."
            : "Seu horário está reservado. Guarde os dados abaixo."}
        </p>
        <dl className="mt-8 space-y-3 text-sm">
          <div className="flex justify-between gap-4 border-b border-[var(--line)] pb-2">
            <dt className="text-silver">Serviço</dt>
            <dd className="text-ink">{service?.name}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-[var(--line)] pb-2">
            <dt className="text-silver">Data</dt>
            <dd className="text-ink">
              {date} · {startTime}
            </dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-[var(--line)] pb-2">
            <dt className="text-silver">Código</dt>
            <dd className="font-mono text-xs text-ink">{done.id}</dd>
          </div>
        </dl>
        <a
          href={`/agendamento/${done.id}?token=${done.cancelToken}`}
          className="btn-outline mt-8 inline-flex"
        >
          Consultar ou cancelar
        </a>
      </div>
    );
  }

  return (
    <div className="border border-[var(--line)] bg-ivory">
      <div className="flex flex-wrap gap-2 border-b border-[var(--line)] px-5 py-4 text-[0.65rem] tracking-[0.14em] uppercase text-silver md:px-8">
        {["Serviço", "Profissional", "Horário", "Seus dados"].map((label, i) => (
          <span
            key={label}
            className={step === i + 1 ? "text-ink" : step > i + 1 ? "text-gold" : ""}
          >
            {i + 1}. {label}
          </span>
        ))}
      </div>

      <div className="p-5 md:p-8">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl text-ink">Escolha o serviço</h2>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setCategoryId("")}
                className={`border px-3 py-2 text-[0.68rem] tracking-[0.12em] uppercase ${
                  !categoryId ? "border-ink bg-ink text-ivory" : "border-[var(--line)]"
                }`}
              >
                Todas
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategoryId(c.id)}
                  className={`border px-3 py-2 text-[0.68rem] tracking-[0.12em] uppercase ${
                    categoryId === c.id
                      ? "border-ink bg-ink text-ivory"
                      : "border-[var(--line)]"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {activeServices.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setServiceId(s.id)}
                  className={`border p-4 text-left transition ${
                    serviceId === s.id
                      ? "border-ink bg-sand/40"
                      : "border-[var(--line)] hover:border-ink/30"
                  }`}
                >
                  <p className="font-serif text-xl text-ink">{s.name}</p>
                  <p className="mt-2 line-clamp-2 text-xs text-muted">
                    {s.description}
                  </p>
                </button>
              ))}
            </div>
            <button
              type="button"
              disabled={!serviceId}
              onClick={() => setStep(2)}
              className="btn-primary disabled:opacity-40"
            >
              Continuar
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl text-ink">Profissional</h2>
            <div className="grid gap-3">
              <button
                type="button"
                onClick={() => setProfessionalId("any")}
                className={`border p-4 text-left ${
                  professionalId === "any"
                    ? "border-ink bg-sand/40"
                    : "border-[var(--line)]"
                }`}
              >
                <p className="font-serif text-xl">Qualquer profissional disponível</p>
                <p className="mt-1 text-xs text-muted">
                  Primeiro horário livre na equipe habilitada para o serviço.
                </p>
              </button>
              {proList
                .filter((p) => !p.isAnyAvailable)
                .map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setProfessionalId(p.id)}
                    className={`border p-4 text-left ${
                      professionalId === p.id
                        ? "border-ink bg-sand/40"
                        : "border-[var(--line)]"
                    }`}
                  >
                    <p className="font-serif text-xl">{p.name}</p>
                    <p className="mt-1 text-xs text-muted">
                      {p.specialties.join(" · ")}
                    </p>
                  </button>
                ))}
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)} className="btn-outline">
                Voltar
              </button>
              <button type="button" onClick={() => setStep(3)} className="btn-primary">
                Continuar
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl text-ink">Data e horário</h2>
            <div>
              <p className="text-[0.7rem] tracking-[0.14em] uppercase text-silver">
                Data
              </p>
              <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
                {dates.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDate(d)}
                    className={`min-w-[4.5rem] border px-3 py-3 text-center ${
                      date === d
                        ? "border-ink bg-ink text-ivory"
                        : "border-[var(--line)]"
                    }`}
                  >
                    <span className="block text-[0.65rem] uppercase">
                      {format(new Date(d + "T12:00:00"), "EEE", { locale: ptBR })}
                    </span>
                    <span className="mt-1 block text-sm">
                      {format(new Date(d + "T12:00:00"), "dd/MM")}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[0.7rem] tracking-[0.14em] uppercase text-silver">
                Horários disponíveis
              </p>
              {!date && (
                <p className="mt-3 text-sm text-muted">Selecione uma data.</p>
              )}
              {date && loadingSlots && (
                <p className="mt-3 text-sm text-muted">Carregando…</p>
              )}
              {date && !loadingSlots && slots.length === 0 && (
                <p className="mt-3 text-sm text-muted">
                  Nenhum horário neste dia. Tente outra data.
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                {slots.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setStartTime(t)}
                    className={`border px-4 py-2 text-sm ${
                      startTime === t
                        ? "border-ink bg-ink text-ivory"
                        : "border-[var(--line)]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(2)} className="btn-outline">
                Voltar
              </button>
              <button
                type="button"
                disabled={!date || !startTime}
                onClick={() => setStep(4)}
                className="btn-primary disabled:opacity-40"
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl text-ink">Seus dados</h2>
            <div className="border border-[var(--line)] bg-ivory-deep/40 p-4 text-sm text-graphite">
              <p>
                <strong>{service?.name}</strong>
              </p>
              <p className="mt-1">
                {date} às {startTime}
              </p>
            </div>
            <label className="block">
              <span className="text-[0.7rem] tracking-[0.14em] uppercase text-silver">
                Nome completo
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full border border-[var(--line)] bg-transparent px-4 py-3 outline-none focus:border-ink"
                required
              />
            </label>
            <label className="block">
              <span className="text-[0.7rem] tracking-[0.14em] uppercase text-silver">
                Telefone / WhatsApp
              </span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-2 w-full border border-[var(--line)] bg-transparent px-4 py-3 outline-none focus:border-ink"
                required
              />
            </label>
            <label className="block">
              <span className="text-[0.7rem] tracking-[0.14em] uppercase text-silver">
                E-mail (opcional)
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full border border-[var(--line)] bg-transparent px-4 py-3 outline-none focus:border-ink"
              />
            </label>
            <label className="flex items-start gap-3 text-sm text-muted">
              <input
                type="checkbox"
                checked={accept}
                onChange={(e) => setAccept(e.target.checked)}
                className="mt-1"
              />
              <span>
                Li e aceito a{" "}
                <a href="/politica-de-privacidade" className="underline">
                  Política de Privacidade
                </a>{" "}
                e os{" "}
                <a href="/termos-de-uso" className="underline">
                  Termos de Uso
                </a>
                .
              </span>
            </label>
            <p className="text-xs leading-relaxed text-silver">{cancelPolicy}</p>
            {error && <p className="text-sm text-red-700">{error}</p>}
            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(3)} className="btn-outline">
                Voltar
              </button>
              <button
                type="button"
                disabled={submitting || !name || !phone}
                onClick={submit}
                className="btn-primary disabled:opacity-40"
              >
                {submitting ? "Enviando…" : "Confirmar solicitação"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
