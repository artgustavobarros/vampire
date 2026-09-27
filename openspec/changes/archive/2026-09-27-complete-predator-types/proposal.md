## Why

O passo 6 lista 12 Tipos de Predador, mas os livros da coleção têm 16: os 10 do Livro Básico (p. 175–178) e mais 6 do Players Guide (p. 107–109). Faltam Ceifador (Grim Reaper), Montero, Perseguidor (Pursuer) e Alçapão (Trapdoor). Além disso, os dados dos 12 existentes foram portados de `design/reference/logic.js` e divergem do livro em Disciplinas, especialidades e ajustes. Exemplos: Osíris dá Feitiçaria de Sangue ou Presença, e não Fascinação/Domínio; Sereia não perde Humanidade e dá Fortitude ou Presença; Doméstico (Trinchador) dá Rebanho ••, e não •••. Também faltam restrições do livro: Ventrue não pode ser Fazendeiro nem Saqueador; Fazendeiro exige Potência de Sangue abaixo de 3; e Feitiçaria de Sangue só vale para Tremere e Banu Haqim. Com esses dados, o personagem concluído sai com números errados.

## What Changes

- **4 Predadores novos** em `data/predators.ts`, com os dados do Players Guide: Ceifador, Montero, Perseguidor e Alçapão. O catálogo passa a ter 16 tipos.
- **Os 12 existentes conferidos contra o livro**: especialidades, as duas Disciplinas e os ajustes (Humanidade, Potência, méritos fixos e escolhas) seguem o Livro Básico PT-BR (10 tipos) e o Players Guide (Extorsionário e Ladrão de Túmulos). Os nomes atuais dos 12 ficam como estão (Gato de Rua, Saqueador, Doméstico, João Pestana, Rainha da Cena…), para não invalidar fichas gravadas.
- **Nomes de Disciplina do catálogo**: as opções de Disciplina do Predador usam os mesmos nomes de `DISCIPLINES`/clãs (Dominação, Proteanismo, Oblívio, Feitiçaria de Sangue). Saem "Domínio", "Protean" e "Fascinação", que não é uma Disciplina.
- **Nomes de mérito do catálogo**: os méritos dos ajustes usam o nome de `data/merits.ts` quando o mérito existe lá (ex.: "Bonito", e não "Belíssimo").
- **Restrições do livro no passo 6**:
  - o Predador pode proibir clãs (Fazendeiro e Saqueador: Ventrue) e limitar a Potência de Sangue (Fazendeiro: até 2). O cartão aparece desabilitado com o motivo, e a validação recusa a escolha;
  - uma opção de Disciplina pode ser restrita a clãs (Feitiçaria de Sangue: Tremere e Banu Haqim). O botão aparece desabilitado com o motivo, e a validação recusa a escolha.
- **Especialidade entre as opções do Predador**: Rainha da Cena tem três opções (Etiqueta, Liderança ou Manha), então o passo não assume mais só duas.
- **Méritos repetidos somam**: linhas de mérito do Predador com o mesmo nome e tipo viram uma linha só, com os pontos somados. Exemplo: o Alçapão com o segundo ponto de Refúgio fica com Refúgio 2.
- **BREAKING (dados)**: sai o tipo de ajuste `nota`, que nenhum Predador usa mais. A nota "Exige Humanidade 8 ou mais" do Fazendeiro estava errada e vira a restrição de Potência de Sangue.
- Fora do escopo: renomear os 12 tipos para os nomes do Livro Básico PT-BR; acrescentar ao catálogo de méritos os que faltam (Sabujo de Sangue, Predador Óbvio, defeitos de Refúgio); migrar fichas já concluídas; e a parada de dados de caça de cada Predador.

## Capabilities

### New Capabilities
<!-- nenhuma -->

### Modified Capabilities
- `character-wizard`: o passo 6 lista os 16 tipos, aceita duas ou mais especialidades e aplica as restrições de clã e de Potência de Sangue do Predador e de clã da Disciplina. A validação do passo 6 inclui essas restrições, e os ajustes deixam de ter o tipo `nota`. Ao concluir, méritos do Predador de mesmo nome e tipo são somados. Os cenários passam a usar os dados corrigidos.

## Impact

- Dados: `web/src/data/predators.ts` (16 Predadores; `PredatorAdjustment` sem `nota`; campos novos de restrição no Predador e na opção de Disciplina).
- Regras: `web/src/rules/predator.ts` (disponibilidade do Predador e da Disciplina por clã e Potência; soma de méritos repetidos).
- Assistente: `web/src/features/wizard/step6-predator.tsx` (cartões e botões desabilitados com motivo; sai o caso `nota` do tom); `web/src/features/wizard/schema.ts` (validação das restrições).
- Testes: `web/src/rules/rules.test.ts`, `web/src/features/wizard/schema.test.ts`, `web/src/features/wizard/wizard.test.tsx` e `web/src/lib/sheet.test.ts` usam nomes e rótulos que mudam (ex.: "Fascinação", "Belíssimo", "Perseguido", "Intimidação (Chantagem)", "Persuasão (Seduzir)").
- Fichas gravadas com Disciplina do Predador "Fascinação", ou com um Predador agora proibido para o clã, ficam como estão. No modo refazer, o passo 6 pede a escolha de novo.
