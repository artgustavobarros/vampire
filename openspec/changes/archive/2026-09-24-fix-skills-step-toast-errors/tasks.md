## 1. Regra do passo 3

- [x] 1.1 Em `web/src/rules/wizard.ts`, criar `skillDistributionCheck(sheet)` que retorna `{ lines, stray, message }`: `lines` = `skillDistributionProgress(sheet)`, `stray` = habilidades de `SKILLS` com pontos num nível fora de `dist.targets` (`{ name, level }`), `message` = frases "Nível N: falta/faltam/sobra/sobram X." por linha incompleta + "Fora do formato: Nome (nível), …." (vazia quando válido)
- [x] 1.2 Testes em `rules.test.ts`: Equilibrado completo → válido; 2 em 3 → "Nível 3: falta 1."; completo + Briga 4 → stray `[{Briga,4}]` e "Fora do formato: Briga (4)."; Especialista completo com 4 → válido; nível com excesso → "sobra"
- [x] 1.3 Em `features/wizard/schema.ts`, trocar a lógica do `step3.superRefine` por `skillDistributionCheck`, emitindo um issue em `["skills"]` com `message`; remover o `stray` local e imports órfãos (`SKILLS` se sobrar sem uso)
- [x] 1.4 Em `step3-skills.tsx`, usar `skillDistributionCheck` para as linhas e renderizar "Fora do formato: N" em `text-blood` quando `stray.length > 0`

## 2. Erros do assistente como toast

- [x] 2.1 Criar `features/wizard/error-messages.ts` com `collectErrorMessages(errors: FieldErrors)`: percorre recursivamente, coleta `message` únicas na ordem, garante ponto final, e `formatStepErrors(messages)` que junta as 3 primeiras e acrescenta "e mais N." quando houver mais
- [x] 2.2 Testes unitários de `collectErrorMessages`/`formatStepErrors` (aninhado em `espec.X`, `disc.1.nome`, `meritos.0.nome`; dedup; corte em 3)
- [x] 2.3 Em `wizard-shell.tsx`, passar `onInvalid` para `form.handleSubmit(next, onInvalid)` que chama `notify(formatStepErrors(collectErrorMessages(errors)), { titulo: "Passo incompleto" })`

## 3. Remover mensagens inline

- [x] 3.1 Remover `<FieldError>` de `step1-clan.tsx`, `step2-attributes.tsx`, `step3-skills.tsx`, `step4-specialties.tsx`, `step5-disciplines.tsx`, `step6-predator.tsx`, `step7-merits.tsx` e `form-fields.tsx`; manter `data-invalid`/`aria-invalid` e `FieldDescription`
- [x] 3.2 Remover imports e variáveis que ficarem órfãos (`FieldError`, `fieldState` sem uso) e conferir que nenhum outro erro de formulário é renderizado inline no app (`grep FieldError`/`role="alert"` fora de `components/ui`)

## 4. Testes do assistente e verificação

- [x] 4.1 Em `wizard.test.tsx`, montar `<Toaster bottom={16} />` no `renderWizard` e atualizar as asserções dos cenários de validação para ler o toast "Passo incompleto" e checar `aria-invalid`/`data-invalid` (e ausência de texto de erro dentro do `<form>`)
- [x] 4.2 Adicionar teste de UI: Equilibrado completo + Briga 4 → mostra "Fora do formato: 1", "Continuar" mantém o passo 3 e o toast diz "Fora do formato: Briga (4)."; removendo o ponto extra, avança para o passo 4
- [x] 4.3 Adicionar teste: dois cliques em "Continuar" no passo 1 vazio → um único toast
- [x] 4.4 Rodar `pnpm test`, `pnpm typecheck` e `pnpm check` em `web/` (a falha pré-existente de `potencyFromGeneration` por causa de `data/generations.ts` local não é deste change — reportar se persistir)
