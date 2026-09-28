## 1. Estrutura e modelo

- [x] 1.1 Criar `web/src/data/merits/` com `index.ts` (helpers atuais + `ALL_MERIT_TEMPLATES`) e mover as listas existentes para `backgrounds.ts`, `general.ts` e `thin-blood.ts`, sem mudar o conteúdo; remover `data/merits.ts`; import `#/data/merits` continua funcionando e os testes passam
- [x] 1.2 Estender `MeritTemplate` com `aliases`, `source`, `parent`, `requires`, `clans`, `excludeClans`, `hidden` e permitir custo 0
- [x] 1.3 Reescrever `findMerit`: nome exato → alias exato → "Nome (detalhe)" por nome/alias; remover o prefixo reverso; testes de alias, detalhe e "Arsenal" → `undefined`
- [x] 1.4 `filterMeritOptions` considera aliases com prioridade de nome; `meritRangeLabel` com "—" para 0 e "••/••••" para valores não contíguos
- [x] 1.5 `meritOptions({ cla, disciplinas })` no lugar de `meritOptions(thin)`, filtrando `hidden`, `clans`, `excludeClans` e `requires.discipline`; atualizar chamadas
- [x] 1.6 `meritGroupLabel` para sub-itens: "Antecedente · <parent>"; ordem dos grupos com os sub-itens logo depois de "Antecedentes"
- [x] 1.7 Teste de integridade: nomes e aliases únicos (normalizados), todo item com `source`, alias EN presente, `levels.length` = número de valores permitidos, `requires.merit` aponta para item existente

## 2. Correções no conteúdo atual

- [x] 2.1 Sangue-ralo: mover "Presença do Crepúsculo" e "Fome Infinita" para Defeitos SR; limpar as descrições de "Presença do Crepúsculo", "Fome Infinita" e de qualquer outro item com texto colado (procurar "Méritos de", "BH", nomes de outros itens); `clans: ["Sangue Fraco"]`; aliases EN; "Conta Sobrenatural" → "Sinal Sobrenatural"
- [x] 2.2 Aparência: Feio •, Repulsivo ••, remover Monstruoso
- [x] 2.3 Vegano → Fazendeiro (alias Vegano, `excludeClans: ["Ventrue"]`, descrição do Farmer: gastar 2 FdV para se alimentar de humanos)
- [x] 2.4 Evitado → sub-defeito de Status ••; Assombrado → "Refúgio Assombrado" (alias Assombrado); remover Perseguido
- [x] 2.5 Faixas e `levels` dos Antecedentes: Aliados 2–6 (texto por total de Eficácia + Confiabilidade), Contatos 1–3, Refúgio 1–3, Máscara 1–2, Lacaios 1–3
- [x] 2.6 Atualizar a spec base/testes que citavam 16/14 e custos antigos (`merits.test.ts`)

## 3. Conteúdo novo (ler cada seção inteira do wiki, traduzir, conferir contagem com o Inventário do design)

- [x] 3.1 `general.ts`: Linguística, Aparência, Uso de Substâncias, Arcaicos
- [x] 3.2 `general.ts`: Laço de Sangue, Sobrenatural, Alimentação
- [x] 3.3 `general.ts`: Míticos
- [x] 3.4 `general.ts`: Psicológicos, Contágio, Laços de Linhagem, Diablerie, Outros
- [x] 3.5 `ingrained.ts`: 11 Falhas de Disciplina Enraizada (custo 0, `requires.discipline`)
- [x] 3.6 `caitiff.ts`: 12 itens com `clans: ["Caitiff"]`
- [x] 3.7 `ghouls.ts`: 5 itens com `hidden: true`
- [x] 3.8 `cults.ts`: gerais + Ashfinders, Bahari, Igreja de Caim, Igreja de Set, Culto de Shalim, Mistérios Mitraicos, Nefilim
- [x] 3.9 `backgrounds.ts`: sub-itens de Aliados, Contatos, Fama, Influência
- [x] 3.10 `backgrounds.ts`: sub-itens de Refúgio (inclui Refúgio Móvel e dependentes)
- [x] 3.11 `backgrounds.ts`: sub-itens de Rebanho, Máscara, Mawla, Recursos, Lacaios, Status
- [x] 3.12 Teste de contagem por categoria igual ao Inventário

## 4. Predadores

- [x] 4.1 `data/predators.ts`: "Vegano" → "Fazendeiro"; conferir nomes "Sabujo de Sangue", "Predador Óbvio", "Rejeitado", "Refúgio Assustador", "Refúgio Assombrado", "Evitado" contra o catálogo
- [x] 4.2 `rules.test.ts`: lista de exceções fica só com "Defeito Mítico"; testes que citam "Vegano" atualizados

## 5. Assistente — Passo 7

- [x] 5.1 `merit-combobox.tsx`: passa `{ cla, disciplinas }`, mostra "—"/"••/••••", nota "Exige <Antecedente> <•>" nas opções com `requires.merit`
- [x] 5.2 `step7-merits.tsx`: linha de custo 0 sem `DotRating`; `DotRating` com os valores do item (até 6)
- [x] 5.3 `rules/wizard.ts` `meritStatus`: pendências de pré-requisito, clã e Disciplina; custo 0 fora das somas
- [x] 5.4 `schema.ts`: pontos validados pelos valores permitidos do item (0–6), 1–5 fora do catálogo; passo 7 lê as Disciplinas do passo 5 como contexto
- [x] 5.5 Testes do Passo 7 (`wizard.test.tsx`): cenários de sub-vantagem agrupada, pré-requisito pendente/cumprido, clã trocado, Falha Enraizada, busca em inglês, Aliados até 6

## 6. Painel lateral e ficha

- [x] 6.1 `data/trait-info.ts`: remover as entradas de mérito de `MERIT_INFO` (e o que ficar órfão); "Belíssimo" vira alias de Bonito
- [x] 6.2 `build-info.ts`: só catálogo; nota "Original: <EN> · <livro>"; linha "Exige …"; níveis por valor permitido; custo fixo sem lista
- [x] 6.3 `merits-panel.tsx`: `DotRating` com os valores permitidos do item do catálogo; custo 0 sem pontos
- [x] 6.4 Testes: `build-info.test.ts` (alias, custo fixo sem lista, pré-requisito) e `merits-panel.test.tsx`

## 7. Fechamento

- [x] 7.1 `pnpm` lint/format (ultracite), typecheck e testes do `web` passando
- [x] 7.2 Conferir no app: Passo 7 com Brujah, Caitiff, Ventrue e Sangue Fraco; painel lateral de um sub-item e de um item renomeado
