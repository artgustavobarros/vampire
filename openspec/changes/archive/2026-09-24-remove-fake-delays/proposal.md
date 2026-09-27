## Why

O app segura a interface com esperas artificiais que simulam latência de rede: `BUSY_MS = 420` no envio do formulário de entrar/criar conta e `MIN_BOOT_MS = 600` na tela de abertura. Como tudo é local (`localStorage`) e o projeto está em fase de MVP, essas esperas só deixam o app mais lento e acrescentam timers, estado e casos de borda sem benefício.

## What Changes

- Remover `BUSY_MS` e o `setTimeout` de `auth-card.tsx`: o envio chama `authenticate` e navega na hora. Saem também o estado `busy`, o `ref` do timer, o `useEffect` de limpeza e o rótulo "Verificando…".
- Remover `MIN_BOOT_MS` e o `setTimeout` de `use-boot.ts`: a tela de abertura some assim que a sessão é restaurada (`ready`). Sai também a flag de módulo `bootShown`.
- A tela de abertura continua existindo enquanto a sessão não é restaurada; só deixa de ter duração mínima.

## Capabilities

### New Capabilities
<!-- nenhuma -->

### Modified Capabilities
- `local-accounts`: a tela de abertura deixa de durar no mínimo 600ms; o cenário "Botões ocupados durante o envio" (~420ms desabilitados) é removido.

## Impact

- `web/src/features/auth/auth-card.tsx`
- `web/src/features/auth/use-boot.ts`
- `openspec/specs/local-accounts/spec.md` (via delta)
- Sem mudança de dependências nem de armazenamento.
