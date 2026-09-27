## Why

Na criação de personagem, o passo 3 (Habilidades) bloqueia o "Continuar" com "Distribuição incompleta" mesmo quando todas as linhas de progresso estão verdes: o schema recusa habilidades num nível que a distribuição não usa (ex.: uma habilidade em 4 no "Equilibrado", ou em 5 em qualquer formato), mas o progresso só conta os níveis da distribuição, então o jogador não vê o que está errado. O mesmo acontece ao "Refazer personagem" depois de subir habilidades na ficha. Além disso, os erros do assistente aparecem como texto (`FieldError`) no meio do formulário, enquanto o resto do app já usa toasts (`notify`) para erros — o jogador espera o aviso no toast.

## What Changes

- **Passo 3 — lógica**: o progresso da distribuição passa a mostrar habilidades fora do formato (níveis que a distribuição não prevê) numa linha própria em Blood, e a mensagem de erro passa a dizer o que falta ou sobra por nível e quais habilidades estão fora do formato, em vez do genérico "Distribuição incompleta".
- `skillDistributionProgress` (regra pura) ganha a contagem das habilidades fora do formato; schema e tela usam a mesma função, para que "tudo verde" signifique "passo válido".
- **Erros do assistente viram toast**: ao clicar "Continuar"/"Concluir" com o passo inválido, o assistente dispara um toast de erro (`notify`, tom `erro`, rótulo "Passo incompleto") com as mensagens do passo; o passo continua visível e o foco vai para o primeiro campo com erro, como hoje.
- **Remover** todos os `<FieldError>` dos passos 1–8 e de `form-fields.tsx`. Os campos com erro continuam marcados (`aria-invalid="true"`, `data-invalid`) e a marcação some ao corrigir.
- Textos de ajuda (`FieldDescription`) não são erros e continuam inline.
- Fora do escopo: a nota do diálogo de regras (`rule-dialog.tsx`, `role="status"`), que é resultado de rolagem e não erro; o teste quebrado de `potencyFromGeneration` causado pela edição local em `data/generations.ts`.

## Capabilities

### New Capabilities

(nenhuma)

### Modified Capabilities

- `character-wizard`: o passo 3 exibe e valida habilidades fora do formato com mensagem específica; os erros de validação passam a sair como toast em vez de mensagem abaixo do campo (muda o requisito "Formulário único do assistente" e os cenários de "Validação por passo").
- `notifications`: os toasts passam a cobrir também os erros de validação do assistente (novo requisito de uso do `notify` pelo assistente).

## Impact

- `web/src/rules/wizard.ts` (`skillDistributionProgress`), `web/src/features/wizard/schema.ts` (step3 e mensagens)
- `web/src/features/wizard/wizard-shell.tsx` (callback `onInvalid` do `handleSubmit` → `notify`)
- `web/src/features/wizard/step1-clan.tsx` … `step8-final.tsx`, `form-fields.tsx` (remoção de `FieldError` e imports órfãos)
- Testes: `wizard.test.tsx`, `schema.test.ts`, `rules.test.ts` — as asserções de texto inline passam a procurar o toast (com `<Toaster />` montado no teste)
- Sem novas dependências.
