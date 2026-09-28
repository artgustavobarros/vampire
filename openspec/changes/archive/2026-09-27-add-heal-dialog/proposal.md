## Why

Na aba Ações já dá para marcar dano pelo diálogo "Sofrer dano", com pré-visualização e caixas clicáveis, mas para curar o jogador ainda precisa ciclar caixa por caixa na trilha (vazio → superficial → agravado → vazio), passando pelo agravado para limpar uma caixa superficial. Um diálogo "Curar-se" no mesmo formato do "Sofrer dano" deixa a cura tão direta quanto o dano e mostra o resultado antes de gravar.

## What Changes

- Novo cartão de ação **Curar-se** na aba Ações, logo depois de "Sofrer dano", que abre o diálogo de regras nesse fluxo.
- Novo formulário **Curar-se** dentro do diálogo de regras, no mesmo modelo do "Sofrer dano":
  - abas segmentadas **Vitalidade | Força de Vontade**;
  - controle **Dano curado** com botões − e +, começando em 0 e limitado ao número de caixas marcadas com o tipo escolhido;
  - cartões de escolha única **Superficial** e **Agravado**, com o ícone da marca;
  - pré-visualização **"<Trilha> depois"** com a cura aplicada, destacando em vermelho tracejado as caixas alteradas, e caixas clicáveis com o mesmo ciclo da ficha;
  - texto de dica sobre o custo da cura (checagens de sangue pela Potência de Sangue, noite de sono para Força de Vontade), sem aplicar esse custo;
  - botão principal **"Curar R de dano"** (ou "Curar dano" depois de clicar numa caixa) e "Cancelar".
- A cura remove as marcas do tipo escolhido da última caixa para a primeira; cada ponto de Agravado curado deixa a caixa vazia.
- Ao confirmar, a trilha é gravada exatamente como na pré-visualização e o diálogo mostra "Dano curado" com uma nota do que mudou.
- Nova regra pura de cura (generalizando a cura de superficiais já usada ao dormir), com testes.
- Os fluxos existentes "Dormir" e "Curar dano agravado (3 checagens de sangue)" continuam como estão.

## Capabilities

### New Capabilities
<!-- nenhuma -->

### Modified Capabilities
- `vampire-actions`: o diálogo de regras troca os botões também pelo formulário de cura; a aba Ações ganha o cartão "Curar-se"; nova exigência "Curar-se"; a regra de cura manual entra nas funções puras.

## Impact

- `web/src/rules/tracks.ts` (cura por tipo e `healDamage`) e `web/src/rules/rules.test.ts`.
- `web/src/features/actions/flows.ts` (novo `FlowKind` "heal"), `rule-dialog.tsx` (desenha o formulário), novo `web/src/features/actions/heal-form.tsx` + teste; partes comuns com `damage-form.tsx` extraídas para reuso.
- `web/src/features/sheet/tabs/acoes-tab.tsx` (novo cartão).
- Sem mudança de API nem de formato da ficha: grava nos campos `vit` / `fdv` já existentes.
