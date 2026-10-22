import Link from "next/link";
import type { Metadata } from "next";
import { readDb } from "@/lib/store";

export const metadata: Metadata = {
  title: "Termos de Uso",
};

export default async function TermosPage() {
  const { settings: s } = await readDb();

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
      <Link href="/" className="text-[0.7rem] tracking-[0.14em] uppercase text-silver">
        ← Voltar
      </Link>
      <h1 className="mt-8 font-serif text-4xl text-ink">Termos de Uso</h1>
      <p className="mt-2 text-sm text-muted">
        Atualizado em {new Date().toLocaleDateString("pt-BR")}
      </p>
      <div className="mt-10 space-y-6 text-sm leading-relaxed text-graphite">
        <p>
          Ao utilizar o site e o sistema de agendamento do <strong>{s.name}</strong>,
          você concorda com estes termos.
        </p>
        <h2 className="font-serif text-2xl text-ink">Serviços</h2>
        <p>
          O site apresenta informações institucionais e permite solicitar
          agendamentos. Preços, durações e disponibilidade podem ser atualizados
          pela administração. Solicitações podem ficar com status “aguardando
          confirmação” quando o salão exigir validação manual.
        </p>
        <h2 className="font-serif text-2xl text-ink">Cancelamento</h2>
        <p>{s.cancelPolicy}</p>
        <h2 className="font-serif text-2xl text-ink">Limitação</h2>
        <p>
          Empenhamo-nos em manter informações corretas, mas o {s.name} não se
          responsabiliza por indisponibilidades temporárias do site ou por
          decisões tomadas com base em conteúdos ainda não confirmados (como
          preços sob consulta).
        </p>
        <h2 className="font-serif text-2xl text-ink">Foro</h2>
        <p>
          Fica eleito o foro da comarca de Goiânia — GO para dirimir eventuais
          controvérsias.
        </p>
      </div>
      <Link
        href="/politica-de-privacidade"
        className="mt-10 inline-block text-sm text-ink underline"
      >
        Ver Política de Privacidade
      </Link>
    </div>
  );
}
