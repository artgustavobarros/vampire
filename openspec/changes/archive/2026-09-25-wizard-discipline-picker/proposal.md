## Why

No passo 5 do assistente, o seletor de Disciplinas ainda deixa aparecer Disciplinas de fora do clã: quando o jogador troca de clã no passo 1, a Disciplina do clã antigo continua gravada e o slot a reinsere na lista ("uma disciplina gravada de fora do clã continua visível"). Além disso, os níveis são marcados com um `DotRating` de 2 pontos cujo clique no valor atual **diminui** 1 — clicar no 2º ponto de um slot que já tem 2 inverte a distribuição, e clicar no 1º ponto de um slot com 1 zera o ponto clicado mas grava 1. O resultado são pontos que "pulam" e não batem com o que o jogador clicou. Como a regra é só "2 em uma, 1 na outra", botões explícitos "+2" e "+1" são mais claros que pontos.

## What Changes

- **Lista só do clã**: cada slot MUST listar apenas as Disciplinas do clã escolhido (Caitiff: todas), sem reinserir uma Disciplina gravada de fora do clã.
- **Troca de clã limpa os slots**: ao escolher outro clã no passo 1, cada slot cuja Disciplina não pertence ao novo clã é esvaziado (nome, nível e poderes). Slots com Disciplina que continua válida são mantidos.
- **Botões "+2" e "+1" no lugar dos pontos**: cada slot troca o `DotRating` por dois botões de alternância, "+2" e "+1", no mesmo visual dos botões de especialidade do Predador (passo 6). Escolher "+2" num slot põe 1 no outro; escolher "+1" põe 2 no outro. Clicar no botão já ativo não muda nada (não há "desmarcar"), o que elimina o comportamento de diminuir ao clicar.
- Validação, linha de status, regras de poderes (corte ao inverter a distribuição, limite por ponto) continuam as mesmas.

## Capabilities

### New Capabilities
<!-- nenhuma -->

### Modified Capabilities
- `character-wizard`: o requisito "Passo 5 — Disciplinas" muda — slots listam estritamente as Disciplinas do clã, a troca de clã limpa slots inválidos e o `DotRating` de 2 pontos vira botões "+2" / "+1".

## Impact

- `web/src/features/wizard/step5-disciplines.tsx`: remove a reinserção da Disciplina fora do clã; troca `DotRating` pelos botões "+2" / "+1".
- `web/src/features/wizard/step1-clan.tsx`: ao trocar de clã, limpa slots de Disciplina fora do novo clã.
- `web/src/rules/wizard.ts`: nova regra pura para limpar slots fora do clã (reaproveitando `clanDisciplineOptions`).
- `web/src/features/wizard/wizard.test.tsx` e `web/src/rules/rules.test.ts`: testes que hoje clicam em "Nível … Disciplina N" passam a usar os botões.
- Sem mudança de dados gravados: `disc[i].nivel` continua 1 ou 2.
