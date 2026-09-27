## 1. Formulário de entrar/criar conta

- [x] 1.1 Em `web/src/features/auth/auth-card.tsx`, remover `BUSY_MS`, o estado `busy`, o `ref` `timer` e o `useEffect` de limpeza (e os imports `useEffect`/`useRef` que sobrarem)
- [x] 1.2 Reescrever `submit` para, após `preventDefault`, limpar o erro, chamar `authenticate` e mostrar o erro ou limpar a senha e navegar para `homeTarget`, tudo de forma síncrona
- [x] 1.3 Remover o rótulo "Verificando…" e o `disabled={busy}` dos dois botões

## 2. Tela de abertura

- [x] 2.1 Em `web/src/features/auth/use-boot.ts`, remover `MIN_BOOT_MS`, a flag `bootShown`, o estado `elapsed` e o `setTimeout`
- [x] 2.2 Deixar `useBoot` chamando `usePlayerStore.getState().restore()` num `useEffect` e retornando `!ready`; atualizar o comentário do hook

## 3. Verificação

- [x] 3.1 Confirmar com `grep` em `web/src/` que não restam `BUSY_MS`, `MIN_BOOT_MS`, `bootShown`, `elapsed`, `busy`, `timer`, "Verificando…" nem `setTimeout` ligados a essas esperas
- [x] 3.2 Remover tudo o que ficar sem uso depois das tasks 1 e 2: imports (`useEffect`, `useRef`, `useState`), variáveis, ramos condicionais, props, comentários e textos que só existiam para as esperas; nada órfão deve sobrar
- [x] 3.3 Rodar `pnpm check`, `pnpm typecheck` e `pnpm test` em `web/` sem erros
- [x] 3.4 Conferir no navegador: login/cadastro inválido mostra o erro na hora; válido navega na hora; a abertura some assim que a sessão é restaurada
