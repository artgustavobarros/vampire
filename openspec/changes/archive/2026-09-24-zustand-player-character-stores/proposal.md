## Why

Hoje todo o estado do app vive num único store feito à mão em `web/src/lib/store.ts` (`useSyncExternalStore` + `Set` de listeners), misturando a sessão do jogador (`user`, `ready`) com a ficha do personagem (`sheet`, `hungerAlert`). Qualquer mudança na ficha re-renderiza todo componente que só queria saber do usuário, e o código de assinatura/notificação é nosso para manter. Queremos usar o Zustand para o estado dos personagens, separando claramente o **jogador** (quem está logado) do **personagem** (a ficha `Sheet`), com seletores para re-renderizar só o necessário.

## What Changes

- Adicionar a dependência `zustand` (v5) em `web/package.json`.
- Criar `web/src/stores/player-store.ts` (`usePlayerStore`): e-mail da sessão, nome do jogador (`vtm5.name.<email>`), flag `ready`, e ações `restore`, `login`, `logout`.
- Criar `web/src/stores/character-store.ts` (`useCharacterStore`): a `Sheet` do personagem, o alerta de Fome pendente, e ações `load`, `clear`, `patch`, `dismissHungerAlert`. `patch` continua mesclando, salvando em `vtm5.sheet.<email>` e sinalizando o alerta de Fome.
- Novo `readPlayerName` em `web/src/lib/storage.ts` (hoje o nome é só gravado, nunca lido).
- **BREAKING** (interno): remover `web/src/lib/store.ts` (`store`, `useAppState`, `AppState`). `useSheet` e `patchSheet` continuam existindo, agora exportados do character store, para limitar a mudança nos componentes.
- `homeTarget` passa a receber `{ user, criada }` em vez de `AppState`.
- Migrar `auth.ts`, `use-boot.ts`, rotas (`index`, `entrar`, `criar`, `ficha`), `sheet-layout`, `hunger-alert`, `wizard-shell`, `disciplinas-tab` e testes para os novos stores.
- Formato e chaves do `localStorage` não mudam; o comportamento visível do app não muda.

## Capabilities

### New Capabilities
- `app-state`: estado do cliente dividido em store do jogador (sessão) e store do personagem (ficha), com persistência por jogador e estado inicial estável no servidor.

### Modified Capabilities
<!-- nenhuma: login, ficha e assistente mantêm o mesmo comportamento -->

## Impact

- Dependência nova: `zustand`.
- Código: `web/src/lib/store.ts` (removido), `web/src/stores/*` (novo), `web/src/lib/auth.ts`, `web/src/lib/storage.ts`, `web/src/features/auth/*`, `web/src/routes/*`, `web/src/features/sheet/*`, `web/src/features/wizard/wizard-shell.tsx`, `web/src/features/actions/hunger-alert.tsx`, `web/src/lib/store.test.ts`.
- Dados salvos: nenhum impacto (mesmas chaves `vtm5.*` e mesmo JSON).
