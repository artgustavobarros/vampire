## Context

A especialidade do Predador é gravada em `predEspec` como "Habilidade (Nome)", um item da lista do livro. O nome final fica em `predEspecNome`, hoje gravado só na aba Ficha: `specialtiesBySkill` marca a especialidade como `pendente` quando falta `predEspecNome`, `trait-grid` pinta o selo em Blood e passa `predador` ao alvo `espec`, `build-info` liga `renomear`, e `info-sheet` renderiza `SpecialtyRename`, que chama `confirmPredatorSpecialty` e dispara o toast. `wizardToPatch` apaga `predEspecNome` quando o passo 6 grava outra `predEspec`.

O poder da Disciplina do Predador já é escolhido no passo 6 (`predPoder`). A mudança leva o nome da especialidade para o mesmo lugar, conforme o mockup (painel "Especialidade em Ofícios", marca ✓, campo, dica).

## Goals / Non-Goals

**Goals:**
- `predEspecNome` vira campo do formulário do assistente, gravado e validado no passo 6.
- Painel de nome logo abaixo dos botões de especialidade, igual ao mockup, com Tailwind no JSX.
- Retirar da ficha todo o fluxo pendente/confirmar e o código que só existia para ele.

**Non-Goals:**
- Renomear a especialidade do Predador pela ficha depois de criada.
- Mudar `predEspec`, a lista de especialidades do Predador ou `applyPredator`.
- Migrar dados gravados: fichas sem `predEspecNome` mostram o nome sugerido.

## Decisions

1. **Guardar o nome em `predEspecNome` (campo existente), não reescrever `predEspec`.** `predEspec` continua sendo a chave da lista do Predador, usada pela validação (`p.specialties.includes`) e pelo botão selecionado. Alternativa descartada: gravar "Ofícios (Laços)" em `predEspec`, que quebraria a validação e o refazer.

2. **Sugestão preenchida no clique do botão.** O `onClick` do botão de especialidade faz `setValue("predEspecNome", sugestão)` só quando a opção muda (mesmo padrão de `predDisc` limpando `predPoder`). Trocar de Predador limpa `predEspecNome` junto com os demais campos. Nos valores iniciais (`sheetToWizard`), `predEspecNome` vem de `sheet.predEspecNome` ou, se ausente e houver `predEspec`, da sugestão — assim fichas antigas abrem com o campo cheio e passam na validação.

3. **Função pura única para separar habilidade e nome.** `rules/specialties.ts` expõe `splitPredatorSpecialty(predEspec)` → `{ skill, nome } | null` (a regex atual). O passo 6, `sheetToWizard` e `predatorSpecialty` a usam. `predatorSpecialty` passa a devolver `{ skill, nome }` com `nome = predEspecNome?.trim() || sugestão`, sem `pendente`.

4. **Validação no `superRefine` do passo 6.** Com especialidade válida escolhida e `predEspecNome.trim()` vazio, erro "Informe o nome da especialidade do Predador" no caminho `predEspecNome`, para o foco cair no campo. `wizardToPatch` apara o valor ao gravar e grava vazio para Sangue Fraco.

5. **Remoção do fluxo da ficha.** Saem: `SpecialtyEntry.pendente` (vira lista de nomes ou entrada só com `nome`), `confirmPredatorSpecialty`, `features/info/specialty-rename.tsx`, `InfoContent.renomear`, o campo `predador` do alvo `espec`, a nota do Predador em `specialtyInfo`, a prop `predador` de `trait-grid` e o ramo Blood do selo, e a limpeza de `predEspecNome` em `wizardToPatch`. Testes dessas partes são removidos ou reescritos.

6. **Painel no passo 6 como componente local `SpecialtyNamePanel`.** Dentro de `step6-predator.tsx`, com `Controller` em `predEspecNome`, `Input` do design system, `useId` para ligar rótulo e campo, e a marca quadrada no mesmo idioma do `PowerSlot` (tinta sólida com ✓ / tracejado Blood).

## Risks / Trade-offs

- [Jogador que queria renomear depois perde o atalho na ficha] → O passo 6 do refazer mostra o nome atual e permite editar.
- [Fichas com `predEspecNome` pendente-confirmado divergente] → Não há divergência: o valor gravado é usado como está; ausência cai na sugestão.
- [Tocar de novo no mesmo botão sobrescrever o nome digitado] → O `onClick` só repõe a sugestão quando a opção muda.
