## Why

O formulário "Sofrer dano" tem dois problemas de uso. Primeiro, o "Dano recebido" começa em 1, então ao abrir a pré-visualização já mostra um dano que o jogador ainda não informou, em vez de partir do dano que já está acumulado na trilha. Segundo, o formulário divide o dano Superficial de Vitalidade por 2 sozinho: com 5 de Vitalidade, 5 superficiais marcam só 3 caixas, e dano aplicado de 1 em 1 nunca é dividido. A divisão depende da fonte do dano, então quem decide é o jogador, não o app.

## What Changes

- O "Dano recebido" começa em **0** e vai de 0 a 20. Com 0, a pré-visualização "<Trilha> depois" mostra a trilha como está agora, sem caixas destacadas, e cada + soma dano novo por cima do que já está marcado.
- Com 0, o botão principal fica desativado.
- **BREAKING (regra)**: o app deixa de dividir o dano automaticamente. O valor marcado é sempre o "Dano recebido" escolhido, em qualquer trilha e tipo. O botão passa a dizer "Marcar R de dano", em que R é o dano recebido.
- A divisão do Superficial em Vitalidade continua só no texto, como dica para o jogador ajustar o valor se ela valer ("Vampiros dividem dano Superficial por 2, arredondando para cima: 3 virariam 2. Ajuste o dano recebido se for o caso.").
- A regra pura de "dano efetivo" (`effectiveDamage`) e o campo `effective` do resultado saem do código e dos testes.

## Capabilities

### New Capabilities
<!-- nenhuma -->

### Modified Capabilities
- `vampire-actions`: "Sofrer dano" começa com 0 de dano recebido, marca exatamente o valor escolhido e deixa a divisão do Superficial só como dica; "Aba Ações" abre o diálogo com "Dano recebido" 0; "Regras como funções puras" deixa de listar o dano efetivo.

## Impact

- `web/src/rules/tracks.ts` (remove `effectiveDamage`, `takeDamage` marca o valor recebido) e `web/src/rules/rules.test.ts`.
- `web/src/features/actions/damage-form.tsx` (stepper de 0 a 20, botão desativado em 0, texto de dica) e `damage-form.test.tsx`.
- Sem mudança de API nem de formato da ficha.
