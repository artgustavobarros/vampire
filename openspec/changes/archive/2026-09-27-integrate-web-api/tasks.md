## 1. Cliente HTTP

- [x] 1.1 Criar `web/src/lib/api.ts` com `API_URL` (`VITE_API_URL` ou `http://localhost:3333/api`), `request<T>(method, path, body?)` com JSON e `Authorization: Bearer` quando há token
- [x] 1.2 Criar `class ApiError extends Error { status }` a partir do corpo `{ statusCode, message, error }`; deixar o `TypeError` de rede passar sem `status`
- [x] 1.3 Guardar o token numa variável do módulo (`getToken`/`setToken`) espelhada em `vtm5.token`
- [x] 1.4 Expor `onUnauthorized(handler)`, chamado em `401` só de chamadas autenticadas (não em `login`/`signup`)
- [x] 1.5 Adicionar as funções por endpoint: `signup`, `login`, `me`, `getSheet`, `putSheet`, `patchSheet` (esta com opção `keepalive`), tipadas com `Sheet` e `{ id, email, name }`
- [x] 1.6 Extrair de `apiError` em `lib/toast.tsx` a função `apiErrorMessage(err)` com o mapeamento por status, sem mudar o comportamento de `apiError`

## 2. Armazenamento local

- [x] 2.1 Reduzir `web/src/lib/storage.ts` a `readToken`/`writeToken`/`clearToken` (chave `vtm5.token`), mantendo o `try/catch`
- [x] 2.2 Remover `readAccounts`, `writeAccounts`, `readSession`, `writeSession`, `clearSession`, `writePlayerName`, `readPlayerName`, `readSheetRaw`, `writeSheet`, o tipo `Accounts` e o aviso "Não salvou" de falha do `localStorage`, junto com imports e testes que só existiam para eles

## 3. Gravação da ficha

- [x] 3.1 Criar `web/src/stores/sheet-sync.ts` com as chaves pendentes, o timer de 600 ms, `schedule(keys)`, `flush({ keepalive? })` com um envio por vez e reenvio do que mudou durante o envio, e `reset()`
- [x] 3.2 Na falha de rede/5xx, devolver as chaves a pendentes e mostrar `notify` com título "Não salvou", `duracao: 0` e "Tentar de novo" → `flush`; fechar esse toast após um envio bem-sucedido
- [x] 3.3 Mudar `useCharacterStore`: `load(raw)` recebe a ficha da API e normaliza; `patch` mescla na hora, atualiza o alerta de Fome e, com dono, chama `schedule`; `clear` chama `reset`
- [x] 3.4 Registrar uma vez no cliente `pagehide` e `visibilitychange` (`hidden`) chamando `flush({ keepalive: true })`

## 4. Sessão e autenticação

- [x] 4.1 Mudar `usePlayerStore`: `login(user, sheet)` recebe os dados da API; `restore()` vira assíncrono com guarda de concorrência, busca `me` + `getSheet` em paralelo quando há token, trata `401` (apaga token, `ready: true`) e falha de rede (mantém `ready: false`, toast com "Tentar de novo" → `restore`)
- [x] 4.2 Reescrever `lib/auth.ts`: `authenticate(input): Promise<boolean>` com a validação local (campos vazios, e-mail, nome, senha ≥ 6, senhas iguais) antes da API, toasts de erro da API via `notify(message)` ou `apiError`, `setToken`, `putSheet(exampleSheet())` quando `settings.dadosDeExemplo` e `login` no store
- [x] 4.3 `logout(): Promise<void>`: aguarda `flush` com tempo-limite de 2 s, apaga o token e limpa os stores mesmo se o envio falhar
- [x] 4.4 Registrar em `lib/auth.ts` o handler de `onUnauthorized`: apaga o token, limpa stores e pendências e chama `apiError({ status: 401 })`

## 5. Interface

- [x] 5.1 `AuthCard`: `submit` assíncrono com estado `pending`, botão desabilitado com "Entrando…"/"Criando…", envio ignorado enquanto `pending`, navegação só quando `authenticate` devolve `true`
- [x] 5.2 `useBoot`: chamar o `restore()` assíncrono e registrar os ouvintes de `pagehide`/`visibilitychange`
- [x] 5.3 `SheetLayout` (menu "Sair") e `WizardShell` (voltar no passo 1): `await logout()` antes de navegar para `/entrar`
- [x] 5.4 Conferir que `/`, `/ficha`, `/criar` e `/entrar` seguem redirecionando pelo `user`/`criada` dos stores depois do `401` global

## 6. Testes

- [x] 6.1 Criar `web/src/test/fake-api.ts`: `fetch` substituído por um roteador em memória com os endpoints, mensagens e status da API, mescla rasa no `PATCH`, e `reset`, `seed`, `fail("network" | 500)` e `calls`
- [x] 6.2 Ligar o `fake-api` no `src/test/setup.ts` e em `stores/test-utils.ts` (reset entre testes, limpar token e `sheet-sync`)
- [x] 6.3 Testes do cliente: URL base, cabeçalho Bearer só com token, `ApiError` com status e mensagem, erro de rede sem status, `onUnauthorized` só em chamadas autenticadas
- [x] 6.4 Testes de `sheet-sync`/store com timers falsos: agrupamento em um `PATCH`, alteração durante o envio, falha devolvendo pendências com um único toast "Não salvou", "Tentar de novo", `401` encerrando a sessão
- [x] 6.5 Reescrever `stores.test.ts` e `auth-card.test.tsx` para o fluxo assíncrono: cadastro, entrada, credenciais erradas, senha curta, e-mail duplicado, sem conexão, botão "Entrando…", restauração com/sem token/`401`/sem conexão, ficha de exemplo via `PUT`, sair enviando pendências
- [x] 6.6 Adaptar `wizard.test.tsx` e demais testes que usavam `writeSheet`/`login(email)` para semear a ficha no `fake-api`
- [x] 6.7 Rodar `pnpm test`, `pnpm typecheck` e `pnpm check` no `web`

## 7. Documentação e verificação manual

- [x] 7.1 Criar `web/.env.example` com `VITE_API_URL=http://localhost:3333/api`
- [x] 7.2 Atualizar `web/README.md`: subir a API antes do `web`, `VITE_API_URL`, e que contas antigas do navegador não são importadas
- [x] 7.3 Com a API do compose no ar, verificar no navegador: criar conta, concluir o assistente, editar a ficha, recarregar e entrar em outro navegador com os mesmos dados; derrubar a API e ver "Não salvou"; subir de novo e "Tentar de novo"
