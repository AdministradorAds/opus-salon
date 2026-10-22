import Link from "next/link";
import { readDb, formatPrice, formatDuration } from "@/lib/store";

export default async function HomePage() {
  const db = await readDb();
  const { settings, services, categories, professionals } = db;
  const featured = services.filter((s) => s.active).slice(0, 6);
  const team = professionals.filter((p) => p.active && !p.isAnyAvailable);

  return (
    <>
      <section className="hero-plane relative min-h-[88vh] overflow-hidden text-ivory">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-gold/40 blur-3xl" />
          <div className="absolute bottom-10 right-0 h-96 w-96 rounded-full bg-sand/20 blur-3xl" />
        </div>
        <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end px-5 pb-20 pt-28 md:justify-center md:px-8 md:pb-24">
          <p className="reveal text-[0.72rem] tracking-[0.28em] uppercase text-gold-soft">
            {settings.tagline}
          </p>
          <h1 className="reveal reveal-delay-1 mt-5 max-w-3xl font-serif text-5xl leading-[1.05] md:text-7xl">
            {settings.headline}
          </h1>
          <p className="reveal reveal-delay-2 mt-6 max-w-xl text-base leading-relaxed text-ivory/80 md:text-lg">
            {settings.subtitle}
          </p>
          <div className="reveal reveal-delay-3 mt-10 flex flex-wrap gap-3">
            <Link href="/agendar" className="btn-primary bg-ivory !text-ink hover:!bg-sand">
              Agendar meu horário
            </Link>
            <Link href="/servicos" className="btn-ghost">
              Conhecer nossos serviços
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="grid gap-12 md:grid-cols-2 md:items-end">
          <div>
            <p className="text-[0.7rem] tracking-[0.2em] uppercase text-silver">
              A marca
            </p>
            <h2 className="mt-3 font-serif text-4xl text-ink md:text-5xl">
              Quatro décadas de arte e cuidado
            </h2>
          </div>
          <p className="text-base leading-relaxed text-muted md:text-lg">
            No coração do Shopping Flamboyant, o OPUS SALON cultiva uma
            atmosfera sensorial onde cada atendimento é pensado com precisão —
            do primeiro olhar ao último detalhe. Tradição que se renova sem
            perder a essência.
          </p>
        </div>
        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/o-salao" className="btn-outline">
            Conhecer o salão
          </Link>
          <Link href="/equipe" className="btn-outline">
            Nossa equipe
          </Link>
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-ivory-deep/60">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-[0.7rem] tracking-[0.2em] uppercase text-silver">
                Serviços
              </p>
              <h2 className="mt-3 font-serif text-4xl text-ink">Em destaque</h2>
            </div>
            <Link
              href="/servicos"
              className="text-[0.72rem] tracking-[0.16em] uppercase text-graphite underline-offset-4 hover:underline"
            >
              Ver todos
            </Link>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((s) => {
              const cat = categories.find((c) => c.id === s.categoryId);
              return (
                <Link
                  key={s.id}
                  href={`/servicos/${s.slug}`}
                  className="group border border-[var(--line)] bg-ivory p-6 transition hover:border-ink/30"
                >
                  <p className="text-[0.65rem] tracking-[0.18em] uppercase text-silver">
                    {cat?.name}
                  </p>
                  <h3 className="mt-3 font-serif text-2xl text-ink group-hover:text-graphite">
                    {s.name}
                  </h3>
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">
                    {s.description}
                  </p>
                  <p className="mt-5 text-xs tracking-wide text-graphite">
                    {formatDuration(s.durationMinutes)} · {formatPrice(s.priceCents)}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <p className="text-[0.7rem] tracking-[0.2em] uppercase text-silver">
          Equipe
        </p>
        <h2 className="mt-3 font-serif text-4xl text-ink">Profissionais</h2>
        {team.length === 0 ? (
          <div className="mt-10 max-w-2xl border border-[var(--line)] bg-ivory p-8">
            <p className="font-serif text-2xl text-ink">Perfis em atualização</p>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Os perfis individuais da equipe serão publicados após confirmação
              do salão — sem nomes ou fotos fictícias. Enquanto isso, você pode
              agendar com o primeiro profissional disponível.
            </p>
            <Link href="/agendar" className="btn-primary mt-8 inline-flex">
              Agendar agora
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((p) => (
              <div key={p.id} className="border border-[var(--line)] p-6">
                <div className="flex h-40 items-end bg-gradient-to-br from-sand to-stone/40 p-4">
                  <p className="font-serif text-2xl text-ink">{p.name}</p>
                </div>
                <p className="mt-4 text-sm text-muted">{p.specialties.join(" · ")}</p>
                <Link
                  href={`/agendar?profissional=${p.id}`}
                  className="mt-5 inline-block text-[0.7rem] tracking-[0.14em] uppercase text-ink underline-offset-4 hover:underline"
                >
                  Agendar com este profissional
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-[var(--line)] bg-ink text-ivory">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:px-8 md:py-20">
          <div>
            <p className="text-[0.7rem] tracking-[0.2em] uppercase text-gold-soft">
              Visite-nos
            </p>
            <h2 className="mt-3 font-serif text-4xl">Shopping Flamboyant</h2>
            <p className="mt-4 text-sm leading-relaxed text-ivory/75">
              {settings.address}
            </p>
            <ul className="mt-6 space-y-2 text-sm text-ivory/80">
              {settings.hoursLabel.map((h) => (
                <li key={h.days}>
                  {h.days}: {h.hours}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={settings.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost"
              >
                Abrir no Maps
              </a>
              <Link href="/contato" className="btn-primary bg-ivory !text-ink">
                Contato
              </Link>
            </div>
          </div>
          <div className="flex flex-col justify-center border border-ivory/15 p-8 md:p-10">
            <p className="font-serif text-3xl leading-snug">
              Pronto para o seu próximo horário?
            </p>
            <p className="mt-4 text-sm text-ivory/70">
              Escolha o serviço, o profissional e o horário — confirmação clara,
              sem troca de mensagens desnecessária.
            </p>
            <Link
              href="/agendar"
              className="btn-primary mt-8 w-fit bg-ivory !text-ink hover:!bg-sand"
            >
              Agendar meu horário
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
