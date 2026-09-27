## 1. Regra pura

- [x] 1.1 Em `web/src/rules/feeding.ts`, trocar `feed(sheet, amount, sourceName)` por `feed(sheet, amount, resonance?)`, devolvendo `{ fome }` (mínimo 0) e, com Ressonância, `ressonancia` e `resIntensidade`, com a nota "Fome X → Y." e, se houver, " Ressonância <tipo> · <intensidade>."
- [x] 1.2 Remover `FEEDING_SOURCES`, `feedingYield` e os tipos `FeedingKind`, `FeedingSource` e `FeedingYield`
- [x] 1.3 Reescrever o bloco "alimentação" de `web/src/rules/rules.test.ts`: saciar parcial, Fome nunca negativa, patch com Ressonância e sem Ressonância (não mexe nos campos). Remover o helper `source` e os imports que ficarem sem uso

## 2. Controle segmentado de valor

- [x] 2.1 Criar `web/src/components/vtm/segmented-control.tsx` (`SegmentedControl` + `SegmentedControlItem`) sobre `ToggleGroup` `type="single"` do `radix-ui`, com as mesmas classes Tailwind de `SegmentedTabsList`/`Trigger`, `data-[state=on]` para o item ativo, estilo desativado e `onValueChange` que ignora `""`

## 3. Formulário de alimentação

- [x] 3.1 Criar `web/src/features/actions/feed-form.tsx` com o estado local (`amount` = Fome, `resonance` = "", `intensity` = `RESONANCE_INTENSITIES[0]`) e as props `sheet`, `onApply(result)` e `onCancel`
- [x] 3.2 Stepper "Saciar": faixa `bg-wash`, botões − / + quadrados brancos com `aria-label`, valor em `<output>` com o rótulo "SACIAR", limites `[min(1, fome), fome]`
- [x] 3.3 Seção "Ressonância da presa": rótulo em caixa-alta e grade `grid-cols-2` de `SelectableCard filled` (serif, centralizado) com `RESONANCES` sem "Sem ressonância", em que tocar de novo desmarca
- [x] 3.4 Intensidade com `SegmentedControl` sobre `RESONANCE_INTENSITIES`, desativado sem Ressonância marcada
- [x] 3.5 Botões: principal `variant="destructive"` com "Alimentar · Fome X → Y" ou "Registrar ressonância" (Fome 0), desativado com `amount === 0` e sem Ressonância; "Cancelar" `variant="outline"`

## 4. Integração no diálogo

- [x] 4.1 Em `web/src/features/actions/flows.ts`, reescrever `feedView`: estágio "ask" com kicker "Alimentação", título "Registrar alimentação", texto "Fome atual: N." ou "Você está saciado. Nada a reduzir." e `actions: []`; estágio "done" igual ao atual. Remover o estágio "pessoa", `FEEDING_SOURCES`/`feedingYield` e o import de `bloodPotency`
- [x] 4.2 Em `web/src/features/actions/rule-dialog.tsx`, renderizar `<FeedForm>` no lugar da lista de botões quando `flow.kind === "feed" && flow.stage === "ask"`, com `onApply` fazendo `patchSheet(r.patch)` e indo para "done" com `r.note`, e `onCancel` fechando o diálogo
- [x] 4.3 Atualizar o Purpose de `openspec/specs/vampire-actions/spec.md` ("alimentação por fonte e Potência" → "alimentação com Ressonância da presa") no arquivamento

## 5. Testes e verificação

- [x] 5.1 Criar `web/src/features/actions/feed-form.test.tsx` cobrindo os cenários da spec: alimentar com Ressonância (Fome e campos da ficha), saciar parcial sem Ressonância, limites do −/+, rótulo do botão, intensidade desativada sem Ressonância, desmarcar, Fome 0 com "Registrar ressonância" e cancelar sem mudar a ficha
- [x] 5.2 Cobrir a abertura pela aba Ações: "Registrar" em Alimentar-se abre "Registrar alimentação"
- [x] 5.3 Buscar referências restantes a "De onde veio o sangue?", `FEEDING_SOURCES`, `feedingYield` e "Quanto você bebeu?" em `web/src` e removê-las
- [ ] 5.4 Rodar lint (Ultracite/Biome), typecheck e `vitest` do `web`, e conferir no navegador o diálogo no celular e no desktop, e que a aba Ficha mostra a Ressonância gravada
