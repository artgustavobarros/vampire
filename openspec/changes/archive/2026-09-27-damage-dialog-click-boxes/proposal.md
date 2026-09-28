## Why

Na ficha, as caixas de Vitalidade e Força de Vontade aceitam marcação direta por toque (vazio → superficial → agravado). Quando o jogador abre "Sofrer dano" pela aba Ações, a pré-visualização é só leitura e o único jeito de marcar é o stepper "Dano recebido" com o tipo. Para quem já sabe quais caixas quer marcar (ou precisa corrigir uma caixa específica), o diálogo obriga a fechar e voltar para a trilha da ficha.

## What Changes

- As caixas da pré-visualização "<Trilha> depois" do formulário "Sofrer dano" passam a ser clicáveis, com o mesmo ciclo da ficha: vazio → superficial → agravado → vazio.
- Clicar numa caixa age sobre o que está na tela: a pré-visualização atual (com o dano do stepper já aplicado) vira o novo ponto de partida, "Dano recebido" volta a 0 e a caixa clicada avança no ciclo. O stepper continua somando dano por cima das caixas clicadas.
- O destaque (borda tracejada e marca vermelhas) continua indicando toda caixa diferente da ficha, venha a mudança do stepper ou do clique.
- Um texto de dica sob a pré-visualização explica o toque ("Toque para marcar: vazio → superficial → agravado", com os ícones), igual ao da trilha da ficha.
- O botão principal diz "Marcar R de dano" enquanto nenhuma caixa foi clicada e "Marcar dano" depois do primeiro clique. Fica desativado quando "Dano recebido" é 0 e nenhuma caixa difere da ficha.
- Ao confirmar depois de clicar, a nota do resultado passa a "<Trilha> atualizada: S superficiais, A agravados.", com os mesmos acréscimos de Debilitado e torpor.
- Trocar a trilha descarta os cliques da trilha anterior; "Cancelar" descarta tudo, sem gravar.

## Capabilities

### New Capabilities
<!-- nenhuma -->

### Modified Capabilities
- `vampire-actions`: o requisito "Sofrer dano" passa a permitir marcar clicando nas caixas da pré-visualização, com as regras de botão, destaque e nota correspondentes.

## Impact

- `web/src/rules/tracks.ts`: `takeDamage` aceita marcas de partida (as caixas clicadas) e gera a nota de trilha atualizada; testes em `web/src/rules/rules.test.ts`.
- `web/src/components/vtm/tracks.tsx`: `DamagePreview` ganha modo interativo (`onCycle`); testes em `components.test.tsx`.
- `web/src/features/actions/damage-form.tsx`: estado das caixas clicadas, regra do botão e dica; testes em `damage-form.test.tsx`.
- Sem mudança de API nem de formato da ficha.
