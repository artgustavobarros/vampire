## Why

No passo 6 o jogador escolhe o Tipo de Predador, a Disciplina que recebe um ponto e vê os ajustes obrigatórios, mas hoje nada disso chega aos valores da ficha: o "+1" da Disciplina, o ±1 de Humanidade, o +1 de Potência de Sangue do Sanguessuga e as Vantagens, Defeitos e Antecedentes do Predador ficam só como escolha gravada (`predador`, `predDisc`) ou como texto solto em `data/predators.ts`. Só a especialidade do Predador já aparece na ficha. O personagem concluído fica com números diferentes dos que o livro manda, e o texto livre dos ajustes não permite aplicá-los por código.

## What Changes

- **Ajustes estruturados**: `adjustments` de cada Predador deixa de ser uma lista de textos e passa a ser uma lista de objetos com tipo (`kind`), valores e rótulo (`label`) de exibição:
  - `humanidade` / `potencia` com `valor` (ex.: −1, +1);
  - `merito` com `tipo` (vantagem ou defeito), `nome`, `pontos` e `detalhe` opcional (ex.: Belíssimo 2; Inimigo 1 "amante preterido"; Contatos 2 "criminosos");
  - `escolha` com `id`, `tipo`, `pontos`, `opcoes` e `modo`: `uma` (escolher uma opção, ex.: "Segredo Obscuro •• (diabolista) ou Evitado ••") ou `dividir` (dividir os pontos entre as opções, ex.: "3 pontos entre Rebanho e Fama");
  - `nota` só informativa (ex.: "Exige Humanidade 8 ou mais").
  A cor de cada ajuste no passo 6 passa a sair do tipo, não de regex sobre o texto.
- **Passo 6 — escolhas do Predador**: cada ajuste do tipo `escolha` mostra um seletor (botões para `uma`, pontos por opção para `dividir`). As escolhas ficam em `predEscolhas` e são obrigatórias para avançar. Trocar de Predador limpa as escolhas; Sangue Fraco grava `predEscolhas` vazio.
- **Concluir aplica o Predador** por cima dos valores finais da ficha:
  - +1 ponto na Disciplina de `predDisc` (acrescentada com nível 1 se não existir, limite 5);
  - ajuste de Humanidade (0–10) e de Potência de Sangue (somado à Potência da Geração);
  - Vantagens, Defeitos e Antecedentes fixos e escolhidos acrescentados a `meritos` como linhas marcadas `origem: "predador"`, que não contam na cota 7/2 do passo 7.
- O que foi aplicado a Disciplina, Humanidade e Potência fica em `predBonus`, e as linhas de mérito ficam marcadas pela origem, para que o Predador nunca seja aplicado duas vezes e possa ser desfeito.
- **Refazer personagem**: o assistente trabalha sobre a ficha sem o Predador aplicado (passo 5 com os 2 + 1 originais, passo 7 sem as linhas do Predador) e o reaplica ao concluir, com o Predador e as escolhas desse momento. Voltar do passo 1 para a ficha no modo refazer reaplica.
- A nota de Potência de Sangue na ficha indica o ponto do Predador quando houver.
- Fora do escopo: exibir os méritos na ficha em jogo (a ficha ainda não tem essa seção; os dados ficam prontos para ela); migrar fichas concluídas antes desta mudança.

## Capabilities

### New Capabilities
<!-- nenhuma -->

### Modified Capabilities
- `character-wizard`: o passo 6 ganha seletores para as escolhas do Predador e a validação delas; "Concluir" aplica o Predador; o modo refazer trabalha sem o Predador aplicado e o reaplica.
- `character-sheet`: a Potência de Sangue soma o ponto do Predador e a nota indica isso.

## Impact

- Dados e tipos: `data/predators.ts` (novo tipo `PredatorAdjustment`, os 12 Predadores reescritos com ajustes estruturados), `lib/types.ts` (`predEscolhas` e `predBonus` na `Sheet`, `origem` no `Merit`).
- Regras: novo `rules/predator.ts` (aplicar/remover, méritos resultantes das escolhas, status das escolhas); `rules/generation.ts` (`bloodPotency`, `potencyNote`); `rules/wizard.ts` (`meritTotals` ignora linhas do Predador).
- Assistente: `features/wizard/step6-predator.tsx` (rótulos e cores pelo tipo, seletores de escolha; sai a regex `COST`/`GAIN`), `features/wizard/schema.ts` (`predEscolhas` no passo 6, `sheetToWizard` sem o Predador aplicado), `features/wizard/wizard-shell.tsx` (commit, Concluir, Voltar do refazer).
- Testes: `rules/rules.test.ts`, `schema.test.ts`, `wizard.test.tsx`, `test-fixtures.ts`.
