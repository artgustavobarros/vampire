## 1. Dados e regras

- [x] 1.1 Criar `web/src/data/compulsions.ts` com o tipo `GeneralCompulsion` ("Fome" | "Dominância" | "Dano" | "Paranoia") e `COMPULSIONS` (nome e efeito de cada uma, conforme a tabela da spec), mais a constante do texto de duração "Dura até ser satisfeita ou até o fim da cena."
- [x] 1.2 Criar `web/src/rules/compulsion.ts` com `rollCompulsion(clan: string | null, d: Die = rollDie)`: d10 com 1–3 Fome, 4–5 Dominância, 6–7 Dano, 8–9 Paranoia, 10 Clã; no 10, com clã cuja `compulsion` é "Nenhuma", rolar de novo até sair 1–9; guardar todos os dados. Reaproveitar `Die`/`rollDie` de `rules/resonance.ts` e `findClan` de `data/clans.ts`
- [x] 1.3 Adicionar `compulsionDiceLine(roll)` → "Compulsão d10: 4" ou "Compulsão d10: 10, 10, 6"
- [x] 1.4 Criar `web/src/rules/compulsion.test.ts` cobrindo os limites da tabela (3/4, 5/6, 7/8, 9/10), o 10 com Brujah, o 10 sem clã, Caitiff com 10, 10, 6 e Sangue-ralo com 10, 1, e a linha dos dados

## 2. Componente

- [x] 2.1 Criar `web/src/features/dm/compulsion-roll.tsx` com `CompulsionRoll({ d })`: painel `surface`/`line` com título "Rolagem de Compulsão" (id `rolagem-compulsao`), texto de apoio, `ChipGroup` "Clã" ("Não informado" + nomes de `CLANS`), botão sangue "Rolar compulsão" e a nota da tabela, em grid de duas colunas a partir de `md`
- [x] 2.2 No mesmo arquivo, o cartão `ink` com filete `blood` numa região "Resultado da compulsão" (`aria-live="polite"`), com o texto vazio, o rótulo, o nome, o texto, a duração em itálico e a linha dos dados, e o botão "Limpar" com `aria-label="Limpar compulsão"`. Só classes Tailwind no JSX, sem mexer em `styles.css`
- [x] 2.3 Em `web/src/features/dm/resonance-roll.tsx`, renderizar `<CompulsionRoll d={d} />` entre a Rolagem de Ressonância e o `<NpcGenerator d={d} />`, e atualizar o comentário do componente

## 3. Testes de tela e verificação

- [x] 3.1 Criar `web/src/features/dm/compulsion-roll.test.tsx`: estado inicial, marcar clã, cartão de compulsão geral (d10 4), de clã com Brujah, sem clã, nova rolagem com Sangue-ralo e "Limpar compulsão" preservando o clã
- [x] 3.2 Conferir que `resonance-roll.test.tsx`, `npc-generator.test.tsx` e `dm-routes.test.tsx` continuam passando com o novo painel na aba (os dados viciados agora também servem o `CompulsionRoll`, que só rola ao clicar)
- [x] 3.3 Rodar `pnpm --filter web test`, `pnpm --filter web typecheck` e `pnpm --filter web check`
- [x] 3.4 Abrir `/personagens/acoes` a 375px e em desktop: ordem Ressonância → Compulsão → Gerador de NPC, selos quebrando linha, sem rolagem horizontal
