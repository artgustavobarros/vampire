## 1. Catálogo (`web/src/data/merits.ts`)

- [x] 1.1 Adicionar `meritPointOptions`, `meritRangeLabel` e `meritGroupLabel` ("Antecedente" → "Antecedentes")
- [x] 1.2 Adicionar `meritOptions(thin)` (SR só para Sangue Fraco), `filterMeritOptions({ tab, query })` sem acento/maiúsculas sobre nome, categoria e descrição (acerto no nome primeiro) e `groupMeritOptions` preservando a ordem do catálogo
- [x] 1.3 Remover `getMeritSuggestions` e qualquer teste/import que dependa dele
- [x] 1.4 Testes unitários das funções novas (faixa "•–•••••", custo fixo "••", filtro por aba, busca "mascara" → "Máscara", SR ausente para Ventrue)

## 2. `DotRating` com valores permitidos

- [x] 2.1 Prop opcional `allowed` em `web/src/components/vtm/dot-rating.tsx`: pontos acima do maior valor tracejados (`border-dashed border-ink/25`) e `disabled`, também no modo somente-leitura
- [x] 2.2 Ignorar cliques cujo `nextDotValue` caia fora de `allowed` (não zera abaixo do mínimo)
- [x] 2.3 Casos em `components.test.tsx`: custo fixo `[2]`, mínimo 1 em `[1..5]`, faixa parcial `[1, 2]`

## 3. Combobox (`web/src/features/wizard/merit-combobox.tsx`)

- [x] 3.1 Abas "Todos" / "Vantagens" / "Defeitos" com `aria-pressed` e estilo tinta/contorno
- [x] 3.2 Campo com lupa, placeholder "Buscar vantagem ou defeito…" e "N opções" à direita
- [x] 3.3 Listbox absoluto com rolagem (`max-h-[min(60vh,420px)]`), grupos com cabeçalho `sticky`, opção com nome, faixa, "Na ficha", selo do tipo e descrição em uma linha
- [x] 3.4 ARIA combobox: `aria-expanded`, `aria-controls`, `aria-activedescendant`; setas, Enter, Esc; fechar ao perder o foco; `onMouseDown` com `preventDefault` nas opções
- [x] 3.5 Ações "Adicionar “texto” como vantagem/defeito" no fim da lista quando a busca não bate exatamente com um nome; "Nenhuma opção nesta aba." quando vazio
- [x] 3.6 Callback `onPick({ nome, tipo, pontos })`; opção "Na ficha" é no-op; após escolher, limpar a busca e fechar

## 4. Passo 7 (`web/src/features/wizard/step7-merits.tsx`)

- [x] 4.1 Trocar o botão "Adicionar" e os `<datalist>` pelo `MeritCombobox` ligado a `append`, com o conjunto "Na ficha" derivado de `meritos` via `findMerit`
- [x] 4.2 Reescrever a linha: selo (fixo para catálogo, alternável fora dele), nome como `InfoTrigger` do mérito, legenda "<grupo> · <faixa>" ou "Fora do catálogo", `DotRating size="sm"` com `allowed`, "Remover"
- [x] 4.3 Remover o `Input` de nome, o autopreenchimento por digitação e o `InfoButton` da linha, e limpar imports órfãos (`Input`, `Field` se não usado, `InfoButton`, `getMeritSuggestions`)
- [x] 4.4 Atualizar o estado vazio para "Busque acima e escolha no catálogo. Vantagens custam pontos; defeitos devolvem pontos."
- [x] 4.5 Manter totais, regra, status e regras de Sangue Fraco como estão

## 5. Testes e verificação

- [x] 5.1 Reescrever os casos do Passo 7 em `wizard.test.tsx`: escolher "Recursos" por busca, "Bonito" com 2 pontos fixos, aba "Defeitos", "Na ficha" sem duplicar, teclado (↓ ↓ Enter), item fora do catálogo, nome abre o painel, SR só em Sangue Fraco, ciclo SR em item fora do catálogo
- [x] 5.2 Manter os cenários de totais, distribuição completa e SR exibida como Vantagem para outros clãs
- [x] 5.3 Rodar `pnpm test` e o lint (ultracite/biome) em `web/`
- [ ] 5.4 Conferir no app o Passo 7 em largura de celular e desktop contra as duas imagens do layout
