## 1. Setup

- [x] 1.1 Adicionar `zustand` (v5) em `web/` com `pnpm add zustand`
- [x] 1.2 Adicionar `readPlayerName(email)` em `web/src/lib/storage.ts` (lê `vtm5.name.<email>`, `null` se ausente)

## 2. Store do personagem

- [x] 2.1 Criar `web/src/stores/character-store.ts` com `useCharacterStore` (`owner`, `sheet`, `hungerAlert`) e ações `load(email)`, `clear()`, `patch(partial)`, `dismissHungerAlert()` (design decisões 2–4)
- [x] 2.2 Exportar `useSheet` e `patchSheet` do character store (design decisão 5)

## 3. Store do jogador

- [x] 3.1 Criar `web/src/stores/player-store.ts` com `usePlayerStore` (`user`, `name`, `ready`) e ações `restore()`, `login(email)`, `logout()`, que chamam `load`/`clear` do character store
- [x] 3.2 Criar `web/src/stores/test-utils.ts` com `resetStores()` usando `getInitialState()`

## 4. Migrar chamadas

- [x] 4.1 `web/src/lib/auth.ts`: `store.load` → `usePlayerStore.getState().login`, `store.logout` → `usePlayerStore.getState().logout`
- [x] 4.2 `web/src/features/auth/use-boot.ts`: ler `ready` do player store e chamar `restore()` dele
- [x] 4.3 `web/src/features/auth/home-path.ts`: `homeTarget({ user, criada })`; ajustar `routes/index.tsx` e `features/auth/auth-card.tsx`
- [x] 4.4 `routes/entrar.tsx`, `routes/criar.tsx`, `routes/ficha.tsx`: trocar `useAppState` pelos stores com seletores
- [x] 4.5 `features/sheet/sheet-layout.tsx` e `features/actions/hunger-alert.tsx`: trocar `useAppState`/`store.dismissHungerAlert`
- [x] 4.6 `features/wizard/wizard-shell.tsx` e `features/sheet/tabs/disciplinas-tab.tsx`: `store.get().sheet` → `useCharacterStore.getState().sheet`
- [x] 4.7 Trocar os imports de `useSheet`/`patchSheet` de `#/lib/store` para `#/stores/character-store` em todos os arquivos
- [x] 4.8 Remover `web/src/lib/store.ts` e confirmar com `grep -rn "lib/store\|useAppState\|AppState" web/src` que não sobrou uso

## 5. Testes e verificação

- [x] 5.1 Migrar `web/src/lib/store.test.ts` para `web/src/stores/stores.test.ts` usando `resetStores()`, mantendo os cenários atuais
- [x] 5.2 Adicionar testes: restauração lê o nome do jogador; restaurar só uma vez; sair limpa os dois stores; `patch` sem jogador não grava
- [x] 5.3 Rodar `pnpm test`, `pnpm typecheck` e `pnpm check` em `web/`
- [ ] 5.4 Abrir o app (`pnpm dev`) e conferir: entrar, criar ficha, editar Fome até 5 (alerta), recarregar (ficha persiste), sair
