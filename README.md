# OPUS SALON

Site institucional + agendamento online + painel administrativo para o OPUS SALON (Shopping Flamboyant · Goiânia).

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Persistência em `data/db.json` (sem dependência externa na v1)
- Auth admin via cookie JWT (`jose` + `bcryptjs`)

> A API pública da Avec é voltada a **relatórios** (leitura). Não há endpoint documentado para criar agendamentos — por isso a agenda própria.

## Rodar local

```bash
npm install
cp .env.example .env
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

### Admin

- URL: `/admin`
- E-mail: `admin@opussalon.local`
- Senha: valor de `ADMIN_PASSWORD` (padrão `opus-admin-2026`)

A senha é hasheada na **primeira** criação de `data/db.json`. Se mudar `ADMIN_PASSWORD` depois, apague `data/db.json` para regenerar o seed.

## Páginas

| Rota | Conteúdo |
|------|----------|
| `/` | Home premium |
| `/servicos` | Catálogo + filtros |
| `/equipe` | Perfis (sem nomes fictícios) |
| `/o-salao` | História / 40 anos |
| `/galeria` | Placeholders até fotos autorizadas |
| `/contato` | Telefones, WhatsApp, mapa |
| `/agendar` | Fluxo de agendamento |
| `/admin` | Dashboard e gestão |

## Dados ainda necessários do salão

- Fotos reais (ambiente, equipe, resultados) com autorização
- Preços e durações definitivos
- Nomes/fotos/especialidades da equipe
- Regras finais de cancelamento e se a confirmação é manual
- Credenciais Avec (se no futuro houver integração de escrita)

## Produção

1. Defina `NEXT_PUBLIC_SITE_URL`, `AUTH_SECRET` e `ADMIN_PASSWORD` fortes
2. `npm run build && npm start`
3. Faça backup periódico de `data/db.json`
