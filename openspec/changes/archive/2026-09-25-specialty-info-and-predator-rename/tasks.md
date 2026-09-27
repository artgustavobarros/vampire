## 1. Dados e regras

- [x] 1.1 Adicionar `predEspecNome?: string` à `Sheet` em `web/src/lib/types.ts` (nome confirmado da especialidade do Predador)
- [x] 1.2 Em `web/src/rules/specialties.ts`, mudar `specialtiesBySkill` para devolver `Record<string, SpecialtyEntry[]>` com `{ nome, pendente }`, usando `predEspecNome` no lugar do nome da lista quando existir
- [x] 1.3 Adicionar `predatorSpecialty(sheet)` (habilidade, nome da lista, pendente) e `confirmPredatorSpecialty(sheet, nome)` que devolve `{ patch, skill, nome } | null` (nome aparado; vazio → `null`)
- [x] 1.4 Em `wizardToPatch` (`web/src/features/wizard/schema.ts`), apagar `predEspecNome` quando o passo grava um `predEspec` diferente do da ficha
- [x] 1.5 Testes em `web/src/rules/rules.test.ts` (ou `lib/sheet.test.ts`): pendente sem `predEspecNome`, nome confirmado substitui o selo, dedup, confirmar vazio devolve `null`, refazer com outra especialidade limpa o nome e com a mesma mantém

## 2. Painel de especialidade

- [x] 2.1 Em `build-info.ts`, adicionar o alvo `{ kind: "espec"; key; skill; nivel; predador? }` e `specialtyInfo` (kicker, título, selo "<Habilidade> N", descrição genérica, nota do Predador quando pendente); `InfoContent` ganha `renomear?: boolean`
- [x] 2.2 Criar `web/src/features/info/specialty-rename.tsx`: filete, rótulo "Nome da especialidade", `Input` pré-preenchido, botões "Confirmar nome" (tinta, desabilitado com texto vazio) e "Manter atual" (borda); ao confirmar chama `patchSheet`, `notify("Especialidade <Nome> fixada em <Habilidade>.", { tom: "ok", titulo: "Especialidade" })` e fecha o painel — estilos só em classes Tailwind no JSX
- [x] 2.3 Em `info-sheet.tsx`, renderizar o formulário abaixo da nota quando `info.renomear`, passando o fechamento do painel
- [x] 2.4 Testes em `build-info.test.ts` e `info-sheet.test.tsx`: conteúdo comum, conteúdo pendente com nota do Predador, botão desabilitado com nome vazio

## 3. Selos na aba Ficha

- [x] 3.1 Em `trait-grid.tsx`, aceitar `specialties?: Record<string, readonly SpecialtyEntry[]>` e renderizar cada selo como `InfoTrigger` (alvo `espec` com a habilidade, o nível atual e o nome do Predador quando pendente)
- [x] 3.2 Selo pendente com `border-blood text-blood`; os demais com `border-ink text-ink`
- [x] 3.3 Ajustar `ficha-tab.tsx` se necessário para passar o nome do Predador ao `TraitGrid`
- [x] 3.4 Atualizar `components.test.tsx`: clicar num selo abre o painel sem mudar pontos; "Manter atual" e "Confirmar nome" gravam `predEspecNome`, mostram o toast e o selo perde o estilo Blood; com `predEspecNome` o painel não mostra o formulário

## 4. Verificação

- [x] 4.1 Rodar lint (Ultracite/Biome) e a suíte de testes em `web/`
- [ ] 4.2 Conferir no app: Erudição "Direito" abre o painel comum; "Chantagem" do Predador aparece em Blood, renomeia uma vez e dispara o toast
