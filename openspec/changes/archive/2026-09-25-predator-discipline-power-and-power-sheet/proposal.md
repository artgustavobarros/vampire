## Why

No passo 6 do assistente, o ponto de Disciplina do Predador é só um par de botões ("Domínio", "Potência"): o jogador não vê se a Disciplina é do clã, quanto ela passa a valer, nem escolhe o poder que esse ponto dá. Pela regra, cada ponto de Disciplina dá direito a um poder, então hoje o personagem sai do assistente com um ponto a mais e um poder a menos. Na aba Disciplinas, a descrição do poder abre como acordeão dentro do cartão, enquanto o resto do app (atributos, méritos, poderes no passo 5) já usa o painel lateral direito.

## What Changes

- **Passo 6 — Disciplina do Predador**: as opções viram cartões com o nome e uma linha de contexto: "do clã · 2 → 3" (nível atual → novo nível) ou "fora do clã · nível 1" em Blood. O cartão escolhido tem borda Moss.
- **Painel "Poder do Predador"** abaixo dos cartões, quando há Disciplina escolhida: rótulo, nome da Disciplina, selo "DO CLÃ" (tinta) ou "FORA DO CLÃ" (Blood), bolinhas à direita com os pontos que já existem em tinta e o ponto do Predador em Blood, e um texto que explica a conta:
  - do clã e já escolhida no passo 5: "Você já tem N pontos em X pelo clã. O Predador soma +1 e ela vai a N+1. Escolha 1 poder novo de nível N+1 ou inferior."
  - do clã sem pontos no passo 5: entra com 1 ponto e 1 poder de nível 1.
  - fora do clã: "X não é Disciplina do clã Y. Entra com 1 ponto e 1 poder de nível 1. Subir depois custa mais XP."
- **Escolha do poder do Predador**: um slot tracejado em Blood ("1 PODER SEM ESCOLHA · Nível N ou inferior · X · Escolha um poder da lista abaixo.") e cartões com os poderes até o novo nível, sem repetir os já escolhidos no passo 5. Tocar num cartão preenche o slot; o nome abre o painel lateral do poder. O poder é obrigatório para avançar quando o catálogo tem opções.
- **Gravação**: novo campo `predPoder` (nome do poder). Ao concluir, `applyPredator` acrescenta o poder à Disciplina junto com o ponto, e `removePredator` o retira. Trocar de Predador ou de Disciplina do Predador limpa `predPoder`; Sangue Fraco grava vazio.
- **Aba Disciplinas**: a linha de poder deixa de expandir. Tocar na linha abre o painel lateral direito do poder (kicker "Disciplina · Nível N", título, descrição, rolagem/custo/duração). O editor em linha (nome, nível, "Custa Rouse", descrição) e o link "Sobre este poder" saem; a linha ganha um botão "×" para remover o poder. **BREAKING** (UX): poderes já gravados não são mais editáveis na ficha; para corrigir, o jogador remove e adiciona de novo pelo diálogo.

## Capabilities

### New Capabilities
<!-- nenhuma -->

### Modified Capabilities
- `character-wizard`: o passo 6 mostra a Disciplina do Predador em cartões com contexto do clã, o painel "Poder do Predador" e a escolha obrigatória de um poder; a validação do passo 6 e a aplicação do Predador passam a incluir o poder.
- `character-sheet`: a aba Disciplinas troca as linhas expansíveis de poder por linhas que abrem o painel lateral, com remoção direta.
- `trait-info`: o gatilho "Sobre este poder" dá lugar à linha do poder na aba Disciplinas, e os cartões de poder do passo 6 passam a abrir o painel.

## Impact

- Tipos: `lib/types.ts` (`Sheet.predPoder`, `PredatorBonus.poder`).
- Regras: `rules/predator.ts` (`applyPredator`/`removePredator` com o poder; nova função de contexto da Disciplina do Predador e lista de poderes elegíveis).
- Assistente: `features/wizard/schema.ts` (campo `predPoder`, `disc` como contexto do passo 6, validação, limpeza para Sangue Fraco), `features/wizard/step6-predator.tsx` (cartões, painel e seletor de poder), `features/wizard/step5-disciplines.tsx` (extrair `toPower`/`PowerCard` para reuso).
- Ficha: `features/sheet/tabs/disciplinas-tab.tsx` (remove acordeão e `PowerEditor`).
- Testes: `wizard.test.tsx`, `rules.test.ts`, testes da aba Disciplinas.
