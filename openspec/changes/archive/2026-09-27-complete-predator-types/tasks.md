## 1. Modelo de dados do Predador

- [x] 1.1 Em `web/src/data/predators.ts`, tirar a variante `nota` de `PredatorAdjustment`
- [x] 1.2 Acrescentar a `Predator` os campos opcionais `clasProibidos?: readonly string[]` e `potenciaMaxima?: number`
- [x] 1.3 Trocar `disciplines: readonly string[]` por opções `{ nome: string; clas?: readonly string[] }` e ajustar quem lê `disciplines` (`step6-predator.tsx`, `schema.ts`, `rules/predator.ts`)

## 2. Dados dos 16 tipos (tabela da Decisão 1 do design)

- [x] 2.1 Corrigir os 10 tipos do Livro Básico: Gato de Rua, Saqueador, Sanguessuga, Doméstico, Consensualista, Fazendeiro, Osíris, João Pestana, Rainha da Cena e Sereia (especialidades, Disciplinas, ajustes, rótulos e descrição)
- [x] 2.2 Corrigir Extorsionário e Ladrão de Túmulos conforme o Players Guide
- [x] 2.3 Acrescentar Ceifador, Montero, Perseguidor e Alçapão
- [x] 2.4 Usar nos Predadores os nomes de Disciplina de `DISCIPLINES` (Dominação, Proteanismo, Oblívio, Feitiçaria de Sangue) e os nomes de mérito de `data/merits.ts` quando o mérito existe lá (Bonito, Estômago de Ferro, Vegano, Presa Excluída, Segredo Obscuro, Inimigo, Evitado…)
- [x] 2.5 Marcar as restrições: Feitiçaria de Sangue com `clas: ["Tremere", "Banu Haqim"]` no Saqueador e no Osíris; `clasProibidos: ["Ventrue"]` no Fazendeiro e no Saqueador; `potenciaMaxima: 2` no Fazendeiro
- [x] 2.6 Conferir que toda especialidade usa uma habilidade de `SKILL_GROUPS` e que toda Disciplina tem entrada em `POWERS`

## 3. Regras

- [x] 3.1 Em `web/src/rules/predator.ts`, criar `predatorBlock(predator, { cla, geracao })`, que devolve o motivo ("Ventrue não pode ser <Predador>", "Exige Potência de Sangue 2 ou menos") ou `null`. A Potência vem de `potencyFromGeneration`, sem o Predador
- [x] 3.2 Criar `disciplineBlock(option, cla)`, que devolve "só Tremere e Banu Haqim" ou `null`
- [x] 3.3 Em `predatorMerits`, juntar as linhas de mesmo nome e mesmo tipo, somando os pontos

## 4. Passo 6 e validação

- [x] 4.1 Em `step6-predator.tsx`, desabilitar os cartões de Predador bloqueados (opacidade reduzida, motivo em Blood no lugar da descrição, clique sem efeito) e manter marcado, com o motivo, um Predador gravado que ficou bloqueado. Usar só classes Tailwind no JSX
- [x] 4.2 Desabilitar o cartão de Disciplina restrito, com a linha de contexto "só Tremere e Banu Haqim" em Blood
- [x] 4.3 Tirar o caso `nota` de `adjustmentTone` e o painel "Sem poderes catalogados para…" do Poder do Predador
- [x] 4.4 Em `schema.ts`, ler a Geração do passo 1 como contexto no passo 6. Validar `predatorBlock` (mensagem igual ao motivo) e `disciplineBlock` ("Feitiçaria de Sangue: só Tremere e Banu Haqim"), aceitar só a Disciplina entre as opções e exigir sempre `predPoder` elegível (sai a exceção sem poderes elegíveis)

## 5. Testes

- [x] 5.1 Atualizar `rules/rules.test.ts`, `features/wizard/schema.test.ts`, `features/wizard/wizard.test.tsx` e `lib/sheet.test.ts` para os dados novos ("Fortitude" no lugar de "Fascinação", "Bonito", "Defeito Mítico", "Intimidação (Coerção)", "Persuasão (Sedução)", Sereia sem perda de Humanidade)
- [x] 5.2 Testar os 16 tipos: cada especialidade em `SKILL_GROUPS`, cada Disciplina com poderes em `POWERS`, e cada mérito com nome do catálogo quando o mérito existe lá
- [x] 5.3 Testar `predatorBlock`: Ventrue com Fazendeiro e Saqueador, Fazendeiro na 7ª Geração, Brujah livre
- [x] 5.4 Testar `disciplineBlock` e o cartão desabilitado de Feitiçaria de Sangue (Brujah bloqueado; Tremere e Banu Haqim liberados)
- [x] 5.5 Testar a soma de méritos iguais com o Alçapão (Refúgio 2) e a validação do passo 6 com Predador proibido depois de trocar o clã e com `predDisc: "Fascinação"` antigo
- [x] 5.6 Rodar a suíte inteira e o lint (`ultracite check`) em `web/`
