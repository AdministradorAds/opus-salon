import Link from "next/link";
import type { Metadata } from "next";
import { readDb } from "@/lib/store";

export const metadata: Metadata = {
  title: "Política de Privacidade",
};

export default async function PrivacidadePage() {
  const { settings: s } = await readDb();

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
      <Link href="/" className="text-[0.7rem] tracking-[0.14em] uppercase text-silver">
        ← Voltar
      </Link>
      <h1 className="mt-8 font-serif text-4xl text-ink">Política de Privacidade</h1>
      <p className="mt-2 text-sm text-muted">
        Atualizado em {new Date().toLocaleDateString("pt-BR")}
      </p>
      <div className="prose-salon mt-10 space-y-6 text-sm leading-relaxed text-graphite">
        <p>
          O <strong>{s.name}</strong> (“nós”), localizado em {s.address}, trata
          dados pessoais em conformidade com a Lei Geral de Proteção de Dados
          (LGPD — Lei nº 13.709/2018).
        </p>
        <h2 className="font-serif text-2xl text-ink">Dados coletados</h2>
        <p>
          Coletamos apenas o necessário para agendar e administrar atendimentos:
          nome, telefone e, se informado, e-mail. Observações do agendamento
          também podem ser registradas.
        </p>
        <h2 className="font-serif text-2xl text-ink">Finalidade</h2>
        <p>
          Os dados são usados para confirmar horários, comunicar alterações,
          cumprir obrigações legais e melhorar o atendimento. Não vendemos
          dados pessoais.
        </p>
        <h2 className="font-serif text-2xl text-ink">Base legal</h2>
        <p>
          Tratamento baseado na execução de contrato/serviços solicitados e, quando
          aplicável, no consentimento (ex.: comunicações opcionais).
        </p>
        <h2 className="font-serif text-2xl text-ink">Seus direitos</h2>
        <p>
          Você pode solicitar acesso, correção, portabilidade ou exclusão dos
          seus dados, na medida permitida pela lei, pelos canais:{" "}
          {s.phones.join(" · ")} ou WhatsApp.
        </p>
        <h2 className="font-serif text-2xl text-ink">Contato do controlador</h2>
        <p>
          {s.name} · {s.addressShort} · {s.phones[0]}
        </p>
      </div>
      <Link href="/termos-de-uso" className="mt-10 inline-block text-sm text-ink underline">
        Ver Termos de Uso
      </Link>
    </div>
  );
}
