## Why

No passo 2 do assistente de criação, a linha de derivados mostra "Vitalidade N · Força de Vontade N" como texto puro. Na ficha, os mesmos rótulos já abrem o painel lateral de descrição, mas no assistente o jogador vê os números sem conseguir entender o que Vitalidade e Força de Vontade significam no momento em que eles são definidos.

## What Changes

- No passo 2 — Atributos, os rótulos "Vitalidade" e "Força de Vontade" da linha de derivados passam a ser gatilhos (`InfoTrigger`) que abrem o painel lateral pela direita.
- O painel aberto é o mesmo da ficha (tipos `vitalidade` e `vontade`), com o selo "Máximo N" usando o valor calculado a partir dos atributos atuais do assistente.
- Os números continuam visíveis ao lado de cada rótulo; clicar no rótulo não altera nenhum atributo.

## Capabilities

### New Capabilities
<!-- nenhuma -->

### Modified Capabilities
- `trait-info`: o requisito "Gatilhos do painel" passa a incluir os rótulos Vitalidade e Força de Vontade da linha de derivados do passo 2 do assistente.

## Impact

- `web/src/features/wizard/step2-attributes.tsx`: a linha de derivados usa `InfoTrigger` nos dois rótulos.
- `web/src/features/wizard/wizard.test.tsx`: testes de abertura do painel a partir do passo 2.
- Sem mudança em `build-info.ts`, no catálogo nem nos dados gravados.
