## Context

O novo standalone (`Ficha de Vampiro V5 (offline).html`) é um bundle: a lógica (`class Component extends DCLogic`) e a marcação ficam no `__bundler/template` em JSON, e os recursos no `__bundler/manifest` em base64/gzip. O `design/reference` do repositório está defasado (é anterior até às changes `sync-standalone-round-2` e `disciplines-power-limit-and-info`), mas os arquivos de dados do web dizem "Portado de design/reference/logic.js".

Estado atual do web:
- `data/generations.ts` usa a tabela antiga (14ª = 1, 10ª = 2, 8ª = 3, 6ª = 4, 5ª = 5, 4ª = 6) e `potencyFromGeneration` devolve 7 abaixo da 4ª.
- `data/blood-potency.ts` tem valores e textos antigos (Potência 1 com bônus de poder "+1 dado", Gravidade 3 na Potência 2…).
- O painel da Geração (`build-info.ts#generationInfo`) é uma lista de níveis com categoria (`generationCategory`); a Potência de Sangue usa a entrada genérica `TRAIT_INFO.potencia` com `kind: "potencia"` e `atual`.
- `InfoContent` só tem lista de níveis; o `InfoProvider` fixa 400px.
- O commit `1a1f8e2` apagou `Step5Disciplines` junto com o bloco de Potência; `wizard-shell.tsx` ainda importa o componente, então o passo 5 não compila. `potencyNote(…, inWizard)` e os imports que o bloco usava ficaram órfãos.

## Goals / Non-Goals

**Goals:**
- Tabela Geração → Potência e tabela de Potência de Sangue iguais às do livro/referência.
- Painel de Geração e de Potência com a tabela 0–10 e a linha do personagem destacada.
- Linha do senhor no passo 1.
- Passo 5 funcionando de novo, sem o bloco de Potência, com a dica nova.
- `design/reference` atualizado para o novo standalone.

**Non-Goals:**
- Portar as demais mudanças de layout do standalone fora de Geração/Potência.
- Migrar `potencia` gravado nas fichas: a Potência já é sempre derivada da Geração em `bloodPotency`.
- Usar `GER_TABELA` (a tabela Geração × Potência da referência existe no código dela, mas não é exibida).

## Decisions

### 1. Referência extraída do bundle
Um script em Python decodifica `__bundler/manifest` (base64 + gzip) e `__bundler/template` (JSON), grava o bundle em `design/reference/ficha-v5-standalone.html`, o template inteiro em `template.html` e o trecho `class Component … </script>` em `logic.js`. O script não entra no repositório. Assim os comentários "Portado de design/reference/logic.js" voltam a apontar para a fonte certa.

### 2. Dados portados da referência
- `GENERATIONS`: mesma ordem (16ª → 4ª) com as Potências novas. `potencyFromGeneration`: `n > 16 → 0`, `n < 4 → 5`.
- `BloodPotencyRow` ganha `feedingList: readonly string[]` e os textos passam a ser os do `static BP` da referência. `feedingPenalty` continua existindo (é o texto corrido usado na aba Registros). `mend` numérico não muda (1,1,2,2,3,3,3,3,4,4,5).

### 3. Um builder para Geração e Potência
`InfoTarget` troca `{ kind: "geracao"; geracao }` e o estado `potencia` por `{ kind: "geracao" | "potencia"; geracao: string; potencia: number }`, onde `potencia` é a Potência já resolvida por quem abre (`bloodPotency(sheet)` na aba Registros; `bloodPotency({ geracao, potencia: 0 })` no passo 1). Um `bloodInfo(target)` monta os dois, mudando só título e descrição, como a referência faz com `inf.kind === 'geracao' || 'potencia'`. `potencia` sai de `StateKind`/`TRAIT_INFO`, e `generationCategory` sai de `rules/generation.ts` (ficam sem uso). Alternativa: manter `TRAIT_INFO.potencia` e só anexar a tabela — descartada porque a descrição, o selo e a nota dependem da Geração.

### 4. Tabelas no `InfoContent`
`InfoContent` ganha `tabelas?: InfoTable[]`, com `InfoTable = { titulo; colunas: string[]; linhas: { cells: string[]; current: boolean }[]; grid: string; minW: string }`. O builder não conhece estilos: `grid` e `minW` são os valores da referência (`64px repeat(5, minmax(88px,1fr)) minmax(180px,2fr)` e `700px`), aplicados via `style` inline como o `autoFit` já faz. O `InfoProvider` escolhe `w-[760px] sm:max-w-[760px]` quando há tabelas, senão os 400px atuais; tudo em classes Tailwind no JSX, sem tocar em `styles.css`. A lista de níveis passa a ser omitida quando vazia (título incluso).

### 5. Nota do Surto
Com o texto do livro ("Adicione 2 dados"), `bloodSurgeNote` passa a `Surto de Sangue: ${bloodSurge em minúscula} ao teste.` → "Surto de Sangue: adicione 2 dados ao teste.". Alternativa: guardar um texto curto separado ("+2 dados") só para a nota — descartada para não manter duas fontes do mesmo dado. (A referência tem um bug aqui, `BP[…][0]`, que não é portado.)

### 6. Passo 1
Nova função pura `sireNote(geracao)` em `rules/generation.ts` com as duas frases da referência. O `FieldDescription` do seletor ganha a segunda linha abaixo da nota de Potência, com `mt-1`, sem estilos globais.

### 7. Passo 5
Recriar `Step5Disciplines` a partir da versão anterior a `1a1f8e2` sem o bloco de Potência: aviso de `clanDisciplineOptions`, os dois `DisciplineRow` e a linha de `disciplineDistribution`. `DisciplineRow` volta a ser interno (não exportado). Os imports de `bloodPotency`, `potencyNote`, `DotRating` de 10 pontos e `InfoTrigger` de Geração/Potência saem do arquivo; `potencyNote` perde o parâmetro `inWizard`. A dica em `wizard-shell.tsx` vira "Duas Disciplinas do clã: dois pontos em uma, um na outra.".

## Risks / Trade-offs

- [Fichas de 14ª, 10ª, 8ª, 6ª, 5ª e 4ª Geração perdem 1 de Potência e a Gravidade/Surto mudam] → é a regra do livro; a mudança é visível na aba Registros e no painel, sem migração porque a Potência é derivada.
- [Tabela de 7 colunas não cabe em 92vw no celular] → rolagem horizontal só dentro da tabela (`overflow-x-auto`, `min-width: 700px`), como na referência.
- [Textos da tabela vêm da referência, não do livro original] → manter o comentário "Portado de design/reference/logic.js" em `blood-potency.ts`, agora apontando para a referência atualizada.
- [Testes que citam "+2 dados", "Neófito" e o painel da Geração no passo 5] → atualizados junto com as tarefas.
