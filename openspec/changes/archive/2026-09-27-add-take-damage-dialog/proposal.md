## Why

Na aba Ações, a única forma de aplicar dano é tocar caixa por caixa nas trilhas, ciclando vazio → superficial → agravado. Isso obriga o jogador a lembrar que vampiros dividem o dano Superficial físico por 2 (arredondando para cima) e a resolver o transbordo na mão. Um diálogo "Sofrer dano" no mesmo formato do "Registrar alimentação" resolve a conta e mostra o resultado antes de gravar.

## What Changes

- Novo cartão de ação **Sofrer dano** na aba Ações, que abre o diálogo de regras nesse fluxo.
- Novo formulário **Sofrer dano** dentro do diálogo de regras, no lugar dos botões, como o da alimentação:
  - abas segmentadas **Vitalidade | Força de Vontade** para escolher a trilha;
  - controle **Dano recebido** com botões − e +;
  - dois cartões de escolha única, **Superficial** e **Agravado**, cada um com o ícone da marca (traço / X);
  - pré-visualização **"<Trilha> depois"** com as caixas da trilha já com o dano aplicado, destacando com borda tracejada vermelha as caixas alteradas;
  - texto explicativo da conta (ex.: "Vampiros dividem dano Superficial por 2, arredondando para cima: 3 viram 2.");
  - botão principal **"Marcar N de dano"** (N = dano efetivo) e "Cancelar".
- Ao confirmar, o dano é gravado na trilha usando a regra de transbordo já existente, e o diálogo mostra o resultado com uma nota do que mudou.
- Nova regra pura que calcula o dano efetivo (divisão do Superficial em Vitalidade) e o resultado na trilha, com testes.
- A marcação manual caixa a caixa nas trilhas continua disponível para correções.

## Capabilities

### New Capabilities
<!-- nenhuma -->

### Modified Capabilities
- `vampire-actions`: o diálogo de regras passa a trocar os botões também pelo formulário de dano; a aba Ações ganha o cartão "Sofrer dano"; nova exigência "Sofrer dano" com a divisão do Superficial, pré-visualização e gravação; a regra de dano efetivo entra nas funções puras.

## Impact

- `web/src/rules/tracks.ts` (nova função de dano efetivo/aplicação) e `web/src/rules/rules.test.ts`.
- `web/src/features/actions/flows.ts` (novo `FlowKind` "damage"), `rule-dialog.tsx` (renderiza o formulário), novo `web/src/features/actions/damage-form.tsx` + teste.
- `web/src/components/vtm/tracks.tsx` (caixas de pré-visualização somente leitura com destaque das alteradas).
- `web/src/features/sheet/tabs/acoes-tab.tsx` (novo cartão).
- Sem mudança de API nem de formato da ficha: grava nos campos `vit` / `fdv` já existentes.
