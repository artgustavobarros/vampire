## Context

- O passo 3 valida com `step3.superRefine` em `features/wizard/schema.ts`: reprova se algum nível da distribuição não está completo **ou** se alguma habilidade tem pontos num nível que a distribuição não prevê ("stray"). A tela (`step3-skills.tsx`) mostra só `skillDistributionProgress`, que conta os níveis previstos. Resultado: com uma habilidade em 4 no "Equilibrado" (ou em 5 em qualquer formato), todas as linhas ficam verdes e o passo é recusado com "Distribuição incompleta: ajuste as habilidades ao formato escolhido." — sem dizer o quê. O mesmo ocorre em `/criar?refazer` quando a ficha teve habilidades elevadas depois da criação (`firstIncompleteStep` manda para o passo 3).
- Com uma distribuição completa e sem habilidades fora do formato, o schema e o fluxo real (passo 1 → 3 → 4) passam — verificado com teste descartável. O defeito é a divergência entre progresso exibido e validação, mais a mensagem genérica.
- Os erros do assistente aparecem por `<FieldError>` em `step1`…`step7` e `form-fields.tsx` (usado no passo 8). O resto do app já usa `notify` (`lib/toast.tsx`) — login/cadastro e diálogo de disciplina — e o `<Toaster />` global está montado em `__root.tsx`.
- `WizardShell` usa `form.handleSubmit(next)` sem `onInvalid`; o foco no primeiro erro vem do `shouldFocusError` padrão do RHF, via `ref` de cada `Controller`.

## Goals / Non-Goals

**Goals:**
- Progresso e validação do passo 3 derivados da mesma função pura; "fora do formato" visível.
- Mensagem do passo 3 específica: por nível (falta/sobra) e lista das habilidades fora do formato.
- Todo erro de validação do assistente sai como toast; nenhum `FieldError` no assistente.
- Manter `aria-invalid`/`data-invalid` e o foco no primeiro campo inválido.

**Non-Goals:**
- Afrouxar a regra de distribuição (V5 exige o formato exato).
- Tratar XP/evolução no "Refazer" (continua exigindo o formato; agora ao menos diz o que ajustar).
- Mudar `rule-dialog.tsx` (nota de rolagem, não erro) ou corrigir o teste de geração quebrado pela edição local de `data/generations.ts`.

## Decisions

1. **`skillDistributionProgress` passa a devolver `{ lines, stray }`** (ou uma função irmã `skillDistributionCheck`), onde `stray: { name, level }[]` são habilidades com pontos em nível não previsto. Uma função pura só, em `rules/wizard.ts`, é consumida pelo schema e pela tela.
   - Alternativa: recalcular "stray" só no schema (como hoje) — rejeitada, é exatamente a divergência que causa o bug.
   - Preferir função irmã `skillDistributionCheck(sheet)` que retorna `{ lines, stray, message }` e manter `skillDistributionProgress` retornando as linhas, para não quebrar chamadores/testes existentes. A mensagem também sai da regra pura, testável sem React.

2. **Mensagem do passo 3** montada por `skillDistributionCheck`: para cada linha incompleta, `Nível N: falta X.` / `faltam X.` / `sobra X.` / `sobram X.`; se houver stray, `Fora do formato: Briga (4), Ocultismo (5).` As frases são juntadas com espaço; o schema emite um único issue em `path: ["skills"]` com esse texto.

3. **Toast no `onInvalid`**: `form.handleSubmit(next, onInvalid)`; `onInvalid(errors)` percorre o objeto `FieldErrors` recursivamente (inclui `espec.<skill>`, `disc.<i>.nome`, `meritos.<i>.nome`, `root`), coleta `message` únicas na ordem de aparição e chama `notify(texto, { titulo: "Passo incompleto" })`. Com mais de 3 mensagens, mostra as 3 primeiras e "e mais N.". Cada mensagem ganha ponto final se não tiver.
   - O helper `collectErrorMessages(errors)` fica em `features/wizard/` (puro, testável).
   - Dedup: o `notify` já usa a mensagem como id, então cliques repetidos substituem o toast.
   - O toast sai só no envio; a revalidação `onChange` não dispara toasts (só atualiza a marcação), evitando ruído a cada clique nos pontos.
   - Alternativa: toast por campo — rejeitada, empilharia até 3 toasts e descartaria os mais antigos.

4. **Remover `FieldError`** de todos os passos e de `form-fields.tsx`; remover imports órfãos. `Field`/`FieldSet` continuam com `data-invalid={fieldState.invalid}` e os inputs com `aria-invalid`. `FieldDescription` fica.
   - No passo 2, a mensagem de cota já aparece no resumo (`attributeQuotas.summary`) — segue inline porque é progresso, não erro; o erro do envio vai para o toast.

5. **Testes**: montar `<Toaster bottom={16} />` no `renderWizard` de `wizard.test.tsx` (como em `auth-card.test.tsx`) e trocar as asserções de texto inline por asserções no toast (`findByRole("alert")` dentro da região "Avisos") + `aria-invalid`/`data-invalid`. Testes unitários de `skillDistributionCheck` e `collectErrorMessages`.

## Risks / Trade-offs

- [Sem texto sob o campo, o jogador pode não achar qual campo está errado em passos com vários campos (4, 5, 7)] → foco vai para o primeiro inválido, o campo fica marcado em Blood e o toast lista as mensagens.
- [Toast fecha após 6s] → a marcação do campo continua; clicar "Continuar" de novo reabre o toast.
- [`aria-invalid` sem `aria-describedby` perde a descrição do erro para leitores de tela] → o toast tem `role="alert"` e é anunciado; aceitável e alinhado ao requisito de notificações.
- [Testes existentes dependem do texto inline] → atualizados no mesmo change.
