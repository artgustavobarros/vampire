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

## Referências e Fontes Canônicas

Os dados de regras, disciplinas, poderes, clãs e tipos de predadores implementados nesta aplicação são baseados nos livros oficiais da 5ª Edição de *Vampiro: A Máscara* (Galápagos Jogos / World of Darkness) e alinhados com os projetos da comunidade:

- **[WoD5E-Developers / wod5e](https://github.com/WoD5E-Developers/wod5e)**: Sistema comunitário de World of Darkness 5e para Foundry VTT (motor de regras, fichas e taxonomia de dados).
- **[vtm5e-compendio-ptbr](https://github.com/pixshadoow-beep/vtm5e-compendio-ptbr)**: Compêndio oficial completo em Português Brasileiro (PT-BR) para o sistema `wod5e` no Foundry VTT (extraído estritamente das publicações da Galápagos Jogos).
- **[albacrux / vtm5_regras_e_matrizes](https://github.com/albacrux/vtm5_regras_e_matrizes)**: Matrizes e referências canônicas de termos e paradas de dados V5 em PT-BR.

> **Aviso Legal (Dark Pack):** Partes dos materiais utilizados são propriedade intelectual de copyright e marcas registradas da Paradox Interactive AB e são usadas de acordo com a política *Dark Pack*.

