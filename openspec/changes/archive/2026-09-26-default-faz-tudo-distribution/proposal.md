## Why

No passo 3 (Habilidades) do assistente de criação, nenhuma distribuição vem marcada num personagem novo: o jogador precisa clicar num cartão antes de avançar, e enquanto isso o progresso por nível mostra as metas de "Equilibrado" (herdado do standalone). Isso confunde, porque as linhas de progresso descrevem uma distribuição que não está selecionada. "Faz-tudo" (1×3, 8×2, 10×1) é a distribuição padrão desejada para quem ainda não escolheu.

## What Changes

- A distribuição padrão de habilidades passa de "Equilibrado" para "Faz-tudo".
- Ao abrir o passo 3 sem distribuição gravada na ficha, o cartão "Faz-tudo" MUST aparecer já selecionado e o progresso por nível MUST mostrar as metas de Faz-tudo (3: 0 de 1, 2: 0 de 8, 1: 0 de 10).
- O jogador continua livre para trocar para "Equilibrado" ou "Especialista"; uma distribuição já gravada na ficha é sempre respeitada.
- Ao validar o passo 3, a distribuição padrão é gravada na ficha como qualquer escolha explícita.
- Fichas antigas criadas sem `dist` passam a ser lidas como "Faz-tudo" no assistente (no refazer), em vez de exigir nova escolha.

## Capabilities

### New Capabilities

_Nenhuma._

### Modified Capabilities

- `character-wizard`: o requisito "Passo 3 — Habilidades" ganha a regra de distribuição padrão ("Faz-tudo" pré-selecionada quando a ficha não tem distribuição).

## Impact

- `web/src/data/distributions.ts`: `DEFAULT_DISTRIBUTION` passa a ser "Faz-tudo".
- `web/src/features/wizard/schema.ts`: `sheetToWizard` usa o nome da distribuição padrão quando `sheet.dist` está vazio.
- `web/src/rules/wizard.ts`: sem mudança de código; o fallback de `skillDistributionProgress` já usa `DEFAULT_DISTRIBUTION`.
- Testes: `schema.test.ts`, `wizard.test.tsx` e `rules.test.ts` que dependem de `dist: ""` ser inválido ou do fallback "Equilibrado".
- Sem impacto na API nem no formato da ficha (`dist` continua string opcional).
