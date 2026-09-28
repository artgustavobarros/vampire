## 1. Faixa do Mestre

- [x] 1.1 Em `sheet-layout.tsx`, remover o rótulo "MESTRE" do cabeçalho
- [x] 1.2 Extrair o handler de "Sair" (logout + `/entrar`) para reuso entre a gaveta e a faixa
- [x] 1.3 Renderizar a faixa sangue acima do `<header>` quando `tabs.to === "/personagens/$id/$aba"`: texto "Modo Mestre · {nome} · Ficha de jogador" truncado, botão contornado "Lista de personagens" (`Link` para `/personagens`) e botão branco "Sair"; botões descem para a linha de baixo abaixo de `sm`
- [x] 1.4 Atualizar `sheet-layout.test.tsx`/`dm-routes.test.tsx`: sem "MESTRE" no cabeçalho, faixa presente na ficha do Mestre e ausente na do jogador, "Lista de personagens" da faixa envia pendências e abre `/personagens`, "Sair" leva a `/entrar`

## 2. Dados e regra das paradas

- [x] 2.1 Em `lib/types.ts`, adicionar `DicePool` e `rolagens?: DicePool[]` à `Sheet`; remover `notas`
- [x] 2.2 Remover `notas` de `blankSheet()` (`lib/sheet.ts`) e da `TextFieldKey` (`data/fields.ts`); corrigir referências que sobrarem
- [x] 2.3 Criar `rules/dice-pool.ts` com `poolTotal` e `poolFormula` (atributo/perícia desconhecidos contam como nenhum, total mínimo 0, modificador com "+"/"−")
- [x] 2.4 Testes de `dice-pool.ts` cobrindo os cenários de "Total e fórmula da parada"

## 3. Aba Rolagens

- [x] 3.1 Em `tabs.ts`, trocar `notas` por `{ id: "rolagens", label: "Rolagens" }` e adicionar `notas → rolagens` em `LEGACY_TABS`; atualizar `tabs.test.ts`
- [x] 3.2 Em `tab-content.tsx`, trocar `NotasTab` por `RolagensTab`; apagar `tabs/notas-tab.tsx`
- [x] 3.3 Criar `tabs/rolagens-tab.tsx`: título "Paradas de dados", texto explicativo, grade `md:grid-cols-2` e botão "+ Nova parada" (tinta, largura total) que cria uma parada vazia com id local e foca o nome
- [x] 3.4 Cartão de parada: nome ("Nome do teste"), quadrado tinta com o total, `NativeSelect` de Atributo e Perícia com `optgroup` por grupo e opções "Nome · valor", selects empilhados abaixo de `sm`, contador de modificador −10..+10 com limites desativados, fórmula e "Remover" em sangue; toda mudança via `patchSheet({ rolagens })`
- [x] 3.5 Criar `tabs/rolagens-tab.test.tsx`: aba vazia, nova parada com foco, opções com valor, total/fórmula, remover, limite do modificador e total que muda quando o atributo muda

## 4. Rotas, specs e verificação

- [x] 4.1 Atualizar testes/rotas que usam `/notas` (ex.: `dm-routes.test.tsx`) para `/rolagens` e cobrir o redirecionamento de `/ficha/notas`
- [x] 4.2 Rodar lint (Ultracite), typecheck e testes do web e corrigir o que quebrar
- [ ] 4.3 Conferir no navegador: faixa em 1000px e 390px, aba Rolagens com 1 e 2 colunas, persistência após recarregar
