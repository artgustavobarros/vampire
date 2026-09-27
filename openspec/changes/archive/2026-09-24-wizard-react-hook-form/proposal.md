## Why

Hoje o assistente de criação não é um formulário. Cada passo lê a ficha com `useSheet()` e grava cada tecla com `patchSheet`. Nada é validado: dá para concluir um personagem sem clã, com atributos fora da cota V5 ou sem nome. Também não há uma regra clara de "um personagem por jogador": `/criar` abre mesmo quando a ficha já foi criada. Queremos que criar um personagem seja um fluxo de formulário de verdade, com validação por passo, mensagens de erro nos campos e gravação só de dados válidos.

## What Changes

- O assistente passa a ser **um único formulário `react-hook-form`** que cobre os 8 passos. Os valores iniciais vêm da ficha atual.
- Cada passo tem um **schema `zod`**, ligado ao formulário por `@hookform/resolvers/zod`. "Continuar" valida só o passo atual. Com erro, o usuário fica no passo e vê as mensagens junto dos campos.
- Os campos usam o componente **`Field` do shadcn** (`Field`, `FieldLabel`, `FieldError`, `FieldDescription`, `FieldGroup`). Os controles próprios do projeto (`DotRating`, `SelectableCard`, `NativeSelect`, `Input`) entram no formulário por `Controller`.
- **BREAKING (comportamento)**: o assistente não grava mais a cada tecla. Os valores do passo são gravados na ficha (`patchSheet`) quando o passo é validado em "Continuar". "Voltar" grava o passo atual sem validar, para não perder o que foi digitado. "Concluir" valida o passo 8, grava tudo e marca `criada: true`.
- Regras de validação por passo: clã e geração obrigatórios; distribuição de atributos exata (1×4, 3×3, 1×1, resto em 2); distribuição de habilidades escolhida e completa; especialidades obrigatórias preenchidas; duas disciplinas diferentes com nível ≥ 1 e poderes dentro do nível; predador, especialidade e disciplina do predador escolhidos; méritos e defeitos com nome e pontos de 1 a 5; nome do personagem obrigatório.
- Não dá para pular passos pela URL: `?passo=N` além do primeiro passo incompleto leva a esse passo.
- **Um personagem por jogador**: com a ficha já criada, `/criar` redireciona para a ficha. A única exceção é o modo "Refazer personagem" (`/criar?passo=1&refazer=true`), que edita o mesmo personagem em vez de criar outro.
- Novas dependências: `react-hook-form`, `zod`, `@hookform/resolvers`. Novo componente shadcn: `field`.

## Capabilities

### New Capabilities
<!-- nenhuma -->

### Modified Capabilities
- `character-wizard`: o requisito "Assistente em 8 passos" muda. A gravação acontece ao validar cada passo, não a cada alteração, e "Refazer" passa a ser um modo explícito. Novos requisitos: formulário único com validação por passo, bloqueio de pular passos e um personagem por jogador.

## Impact

- Código: `web/src/features/wizard/*` (shell com `FormProvider` e os 8 passos reescritos com `Controller`/`Field`), novo `web/src/features/wizard/schema.ts` (schemas zod por passo e mapeamento ficha ↔ formulário), `web/src/routes/criar.tsx` (search `refazer`, guarda de personagem criado e de passo), `web/src/features/sheet/sheet-layout.tsx` (link "Refazer personagem"), novo `web/src/components/ui/field.tsx`.
- Regras: os schemas reaproveitam `web/src/rules/wizard.ts` (`attributeQuotas`, `skillDistributionProgress`), que continuam funções puras.
- Dependências: `react-hook-form`, `zod`, `@hookform/resolvers`.
- Dados salvos: mesmas chaves e mesmo formato da `Sheet`. Uma ficha antiga com `criada: false` e dados parciais abre no primeiro passo incompleto.
- Interação com `optimistic-sheet-updates`: o assistente deixa de usar `SheetTextField`, então as duas mudanças não mexem nos mesmos campos. Os commits do assistente continuam passando por `patchSheet`.
