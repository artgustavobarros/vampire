# Ficha · Vampiro: A Máscara V5

App web da ficha de personagem V5, recriado a partir do standalone
`design/reference/ficha-v5-standalone.html`. Roda só no navegador: contas e
fichas ficam no `localStorage` (chaves `vtm5.*`), sem backend nem deploy.

## Stack

TanStack Start (React 19, TanStack Router com rotas em arquivo), Tailwind CSS v4,
shadcn/ui, Ultracite (Biome), Vitest + Testing Library.

Scaffold gerado com:

```bash
npx @tanstack/cli@latest create web --framework React --package-manager pnpm \
  --add-ons shadcn --no-examples --toolchain biome --no-git --no-intent --non-interactive
pnpm dlx shadcn@latest add button input textarea select label dialog sheet separator
pnpm dlx ultracite@latest init --pm pnpm --linter biome --frameworks react
```

## Rodar localmente

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build && pnpm preview
```

## Verificação

```bash
pnpm test         # Vitest
pnpm typecheck    # tsc --noEmit
pnpm check        # Ultracite (Biome) lint + format
pnpm fix          # corrige lint/format automaticamente
```

## Organização

```
src/
  data/        dados do jogo (clãs, disciplinas, predadores, Potência…) e ficha de exemplo
  rules/       regras puras e testadas (trilhas, alimentação, sono, cotas do assistente)
  lib/         tipos da ficha, armazenamento local, store, configurações
  components/  ui/ (shadcn) e vtm/ (pontos, trilhas de dano, cartões)
  features/    auth, wizard, sheet, actions
  routes/      rotas do TanStack Router
```

O design segue `design/reference/template.html`: tokens de cor e fonte em `src/styles.css`.
