## Context

O passo 3 do assistente lê `dist` via `sheetToWizard` (`web/src/features/wizard/schema.ts`), que hoje devolve `""` quando a ficha não tem distribuição. Com `""`, nenhum `SelectableCard` fica marcado e o schema do passo 3 (`oneOf(SKILL_DISTRIBUTIONS…)`) acusa "Escolha uma distribuição".

Ao mesmo tempo, `skillDistributionProgress` (`web/src/rules/wizard.ts`) cai em `DEFAULT_DISTRIBUTION` quando o nome não bate com nenhuma distribuição. Essa constante é "Equilibrado" (`web/src/data/distributions.ts`, índice 1, herdada do standalone). Então as linhas de progresso mostram as metas de Equilibrado sem nenhum cartão selecionado.

## Goals / Non-Goals

**Goals:**
- Personagem sem distribuição abre o passo 3 com "Faz-tudo" selecionada, e o progresso bate com o cartão marcado.
- Uma fonte só para o padrão: `DEFAULT_DISTRIBUTION`, usada pelo formulário e pelo fallback do progresso.

**Non-Goals:**
- Pré-preencher pontos de habilidade: as 27 habilidades continuam em 0.
- Mudar `blankSheet()` ou o formato da ficha e da API.
- Mudar as metas das distribuições ou a ordem dos cartões.

## Decisions

**1. `DEFAULT_DISTRIBUTION` passa a ser "Faz-tudo", buscada pelo nome.**
Trocar a desestruturação posicional `export const [, DEFAULT_DISTRIBUTION]` por uma busca pelo nome "Faz-tudo" (ou pelo primeiro elemento, com comentário), para que reordenar os cartões não mude o padrão sem ninguém perceber. O fallback de `skillDistributionProgress` passa a dar Faz-tudo sem mudar nada em `rules/wizard.ts`.

**2. O padrão entra em `sheetToWizard`, não em `blankSheet`.**
`dist: sheet.dist || DEFAULT_DISTRIBUTION.name`. Assim o padrão vale para personagens novos, criações pela metade e refazer de fichas antigas sem `dist`, sem gravar nada na ficha antes do passo 3 ser validado (o assistente só grava ao "Continuar"/"Voltar"). Colocar em `blankSheet` não cobriria fichas já existentes e marcaria `dist` numa ficha que ainda nem passou pelo passo 3.
- Alternativa descartada: `defaultValues` do `useForm`. Espalharia o padrão por outro lugar, e `firstIncompleteStep` (que também usa `sheetToWizard`) ficaria em desacordo com o formulário.

**3. O schema do passo 3 continua exigindo uma distribuição válida.**
`oneOf(...)` fica como está. Com o padrão aplicado em `sheetToWizard`, a mensagem "Escolha uma distribuição" só aparece para um nome inválido ou desconhecido gravado na ficha.

## Risks / Trade-offs

- [`firstIncompleteStep` passa a tratar `dist` vazio como Faz-tudo] → Uma ficha com habilidades em Equilibrado e `dist` vazio continua parando no passo 3 (as metas não batem), mas agora pelo motivo "habilidades", não "distribuição". Os testes que usam `completeSheet({ dist: "" })` para forçar o passo 3 devem usar um `dist` inválido ou habilidades incompletas.
- [Fichas antigas criadas antes de existir `dist` e com habilidades em Equilibrado] → No refazer, o passo 3 abre com Faz-tudo e o progresso vermelho; basta o jogador clicar em "Equilibrado". Não há migração: é um ajuste de um clique, e a ficha pronta não é afetada.
