## Why

Depois de concluir o assistente, o campo "Perdição do Clã" da aba Registros fica vazio, embora o clã (e portanto a Perdição) já tenha sido escolhido no passo 1. O jogador precisa redigitar à mão uma informação que o sistema já conhece, e fichas recém-criadas parecem incompletas.

## What Changes

- Ao salvar o passo 1 do assistente, a ficha grava em `perdicao` o texto da Perdição do clã escolhido, no formato `<nome da Perdição> — <descrição>` (ex.: "Temperamento Violento — …").
- O preenchimento só acontece quando `perdicao` está vazio ou ainda contém o texto automático de algum clã; um texto editado pelo jogador na aba Registros MUST ser preservado.
- Trocar de clã (inclusive no fluxo "Refazer personagem") substitui o texto automático do clã anterior pelo do novo clã.
- Caitiff e Sangue-ralo recebem o texto que o catálogo já define para eles (ex.: "Sangue-ralo — Sem Perdição de clã, …").
- O campo continua editável na aba Registros, como hoje.

## Capabilities

### New Capabilities
<!-- nenhuma -->

### Modified Capabilities
- `character-wizard`: o passo 1 passa a gravar a Perdição do clã em `perdicao` ao ser salvo.

## Impact

- `web/src/data/clans.ts`: helper que monta o texto automático da Perdição de um clã.
- `web/src/features/wizard/schema.ts`: `wizardToPatch` grava `perdicao` quando `cla` está entre os campos salvos.
- `web/src/features/wizard/wizard-shell.tsx`: passa a ficha base (com `perdicao`) para `wizardToPatch`.
- Testes: `schema.test.ts` e `wizard.test.tsx`.
- Sem mudança de API ou de dados do servidor; `perdicao` já é um campo de texto da `Sheet`.
