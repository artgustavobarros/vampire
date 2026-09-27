## 1. Pré-requisito

- [x] 1.1 Confirmar que `sync-standalone-round-2` foi arquivada (ou arquivar antes de arquivar esta)

## 2. Regras puras

- [x] 2.1 Em `rules/wizard.ts`, criar `powerLimitHint(nivel, escolhidos)` com os textos da dica (singular/plural e sem pontos)
- [x] 2.2 Criar `trimPowers(powers, nivel)`: remove poderes acima do nível, ordena por nível e corta em `nivel` itens
- [x] 2.3 Criar `powerToggleBlock(nome, nivel, count)` → `null` ou `{ titulo, msg }` para "Sem pontos" / "Limite de poderes"
- [x] 2.4 Em `rules/generation.ts`, criar `generationCategory(n)` e a variante curta de `potencyNote` para o passo 5 ("Potência de Sangue N.")
- [x] 2.5 Testes em `rules.test.ts` para as funções acima (1 e 2 pontos, sem pontos, corte ao inverter, categorias 16ª/12ª/4ª)

## 3. Painel lateral

- [x] 3.1 Em `build-info.ts`, criar `splitRoll(description, duration)` e usá-lo no ramo `poder`: linhas Rolagem/Custo/Duração, título "Rolagem, custo e duração", descrição sem a frase da rolagem
- [x] 3.2 Adicionar `{ kind: "geracao"; geracao: string }` a `InfoTarget` e o ramo `geracao` (kicker "Sangue", selo, tabela com categoria, linha atual destacada, nota)
- [x] 3.3 Testes em `build-info.test.ts`: rolagem com "vs.", poder passivo, poder ativo sem rolagem, Geração 12ª e sem Geração; atualizar o teste existente de "Custo e duração"

## 4. Schema

- [x] 4.1 No passo 5 de `schema.ts`, rejeitar slot com mais poderes que pontos: "Escolha no máximo N poder(es) em <Disciplina>" em `disc.i.powers`
- [x] 4.2 Conferir se `test-fixtures.ts`/`example-sheet` respeitam o limite e cobrir o cenário em `schema.test.ts`

## 5. Passo 5 — UI

- [x] 5.1 `onChange` do `DotRating`: gravar o complemento e aplicar `trimPowers` aos poderes dos dois slots
- [x] 5.2 Toggle de poder com `powerToggleBlock` + `notify(msg, { tom: "info", titulo })`; remover sempre permitido
- [x] 5.3 Dica acima dos cartões com `powerLimitHint`
- [x] 5.4 Cartão de poder: `div` com o visual do `SelectableCard`, `<button aria-pressed>` com `after:absolute after:inset-0` e nome em `InfoTrigger` (`relative z-10`, `onDark` quando selecionado) abrindo `{ kind: "poder", key, disc, nivel }`
- [x] 5.5 Bloco de Potência de Sangue: rótulo como `InfoTrigger` do estado `potencia`; nota com `InfoTrigger` "Geração <g>" abrindo `{ kind: "geracao" }` e o texto curto

## 6. Passo 1 — Geração

- [x] 6.1 Trocar o `FieldLabel` "Geração" por `InfoTrigger` com estilo de label abrindo o painel da Geração com a geração do formulário; `<select>` com `aria-label="Geração"`

## 7. Verificação

- [x] 7.1 Testes de componente em `wizard.test.tsx`: toast "Limite de poderes", toast "Sem pontos", contador da dica, corte ao inverter 2/1, nome do poder abre o painel sem alternar, "Geração" abre o painel nos passos 1 e 5
- [x] 7.2 Rodar `pnpm test`, `pnpm exec tsc --noEmit` e `pnpm dlx ultracite check` em `web/` e corrigir o que falhar
