## 1. Dados e tipos

- [x] 1.1 Ampliar `MeritKind` em `lib/types.ts` para `"vantagem" | "defeito" | "qualidade-sr" | "defeito-sr"` e ajustar os usos (`trait-info.ts`, `build-info.ts`) para compilar
- [x] 1.2 Criar `data/clan-rules.ts` com `ClanRule` e `CLAN_FULL` (14 clãs) portado da seção 8 da referência, com o aviso "paráfrases do V5, revisar com a mesa"

## 2. Regras puras

- [x] 2.1 Em `rules/wizard.ts`, criar `clanDisciplineOptions(cla)` (sem clã / clã / Caitiff / Sangue Fraco) com opções e texto do aviso
- [x] 2.2 Criar `disciplineDistribution(disc, cla)` com `ok` e a mensagem "Distribuição completa: 2 e 1." / "Falta: …"
- [x] 2.3 Criar `effectiveMeritKind(tipo, ralo)`; reescrever `meritTotals` para receber o clã e devolver `vantagens`, `defeitos`, `qualidadesSR`, `defeitosSR`; criar `meritStatus(meritos, cla)` com a lista "Falta: … · …" / "Distribuição completa."
- [x] 2.4 Testes em `rules.test.ts` para as quatro funções (Brujah, Caitiff, Sangue Fraco, sem clã; totais com tipos SR fora e dentro do Sangue Fraco; mensagens de status)

## 3. Schema do assistente

- [x] 3.1 Adicionar `cla` à shape dos passos 5, 6 e 7 e a `CONTEXT_FIELDS` desses passos
- [x] 3.2 Passo 5: pular validação para Sangue Fraco; senão exigir Disciplinas do clã ("Escolha Disciplinas do clã"), níveis 2 e 1 ("Marque 2 pontos em uma Disciplina e 1 na outra"), diferentes e poderes até o nível; o nível do slot vai de 1 a 2
- [x] 3.3 Passo 6: aceitar tudo para Sangue Fraco
- [x] 3.4 Passo 7: aceitar tipos SR no `z.enum` e acrescentar a checagem de `meritStatus` com a mesma mensagem da linha de status
- [x] 3.5 `wizardToPatch`: com Sangue Fraco, gravar `predador`/`predEspec`/`predDisc` vazios ao salvar o passo 6 e as duas posições de `disc` vazias ao salvar o passo 5 (preservando as extras)
- [x] 3.6 Atualizar `test-fixtures.ts`/`example-sheet` para respeitar 2+1 e 7/2 e ampliar `schema.test.ts` com os cenários de validação da spec

## 4. Passo 5 — Disciplinas

- [x] 4.1 Mostrar o aviso de `clanDisciplineOptions`; para Sangue Fraco renderizar só o aviso (e o bloco de Potência de Sangue)
- [x] 4.2 Slots "Primeira Disciplina" / "Segunda Disciplina" com opções do clã, sem a Disciplina do outro slot, mantendo uma gravada fora da lista como opção extra
- [x] 4.3 `DotRating count={2}` com `onChange` que grava o complemento no outro slot
- [x] 4.4 Linha de status (`disciplineDistribution`) em Moss quando completa, com classes Tailwind no JSX

## 5. Passo 6 — Predador

- [x] 5.1 Para Sangue Fraco, esconder cartões e opções e mostrar o aviso em caixa com filete e fundo `bg-wash`
- [x] 5.2 Atualizar a dica do passo 6 em `wizard-shell.tsx`

## 6. Passo 7 — Vantagens e defeitos

- [x] 6.1 Contadores "X/7 pts em vantagens" / "Y/2 pts em defeitos" e, para Sangue Fraco, "N qualidades · N defeitos de sangue-ralo"
- [x] 6.2 Texto da regra (com o acréscimo do Sangue-ralo) e linha de status (`meritStatus`) em Moss quando completa
- [x] 6.3 Selo de tipo: ciclo pelos tipos do clã a partir do tipo efetivo; rótulos "Vantagem", "Defeito", "Qualidade SR", "Defeito SR"; fundo Moss para vantagem/qualidade, Blood para defeito/defeito SR
- [x] 6.4 Passar o tipo efetivo ao `InfoButton` da linha
- [x] 6.5 Atualizar a dica do passo 7 em `wizard-shell.tsx`

## 7. Perdição e Compulsão no painel

- [x] 7.1 `InfoTarget` ganha `{ kind: "bane" | "comp"; key; potencia }`; `buildInfo` monta Perdição (selo "Gravidade N", `{G}` substituído, nota da Potência) e Compulsão (lista e nota de falha bestial), com fallback para o texto curto do clã sem lista
- [x] 7.2 `build-info` trata `qualidade-sr` como vantagem e `defeito-sr` como defeito
- [x] 7.3 No passo 1, trocar o título de `ClanTrait` por `InfoTrigger` com `potencia` calculada da geração do formulário
- [x] 7.4 Testes em `build-info.test.ts`: Perdição Brujah com Gravidade, Compulsão Ventrue, Perdição Caitiff sem lista, Defeito SR

## 8. Verificação

- [x] 8.1 Testes de componente em `wizard.test.tsx`: filtro por clã e exclusão entre slots, 2+1 automático, Sangue-ralo avança nos passos 5 e 6, ciclo de tipo SR, gatilho da Perdição
- [x] 8.2 Rodar `pnpm test`, `pnpm exec tsc --noEmit` e `pnpm dlx ultracite check` em `web/` e corrigir o que falhar
