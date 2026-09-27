## Why

A API (`api/`) já está no ar com contas JWT e a ficha no Postgres, mas o `web` continua guardando contas (com senha em texto puro) e fichas só no `localStorage`. O jogador fica preso a um navegador, perde tudo ao limpar os dados do site e não tem autenticação de verdade. Esta mudança liga o `web` à API e aposenta o armazenamento local.

## What Changes

- Novo cliente HTTP no `web` (`lib/api.ts`): URL base por `VITE_API_URL` (padrão `http://localhost:3333/api`), token em `Authorization: Bearer`, erros da API viram um `ApiError` com `status` e a `message` em português do corpo.
- **BREAKING** Cadastro e entrada passam a chamar `POST /auth/signup` e `POST /auth/login`. A confirmação de senha continua só no `web`; a senha mínima de 6 caracteres passa a valer. Credenciais erradas mostram "E-mail ou senha incorretos." no lugar de "E-mail não cadastrado neste dispositivo." e "Senha incorreta.".
- O formulário de entrada fica ocupado enquanto a requisição corre (botão desabilitado com "Entrando…"/"Criando…"), já que agora há espera real.
- A sessão passa a ser o `accessToken` salvo em `vtm5.token`. Ao abrir, o app chama `GET /auth/me` e `GET /me/sheet`; a tela de abertura cobre essas chamadas. Token inválido ou expirado leva à tela de entrada.
- Cada edição da ficha continua aplicada na hora na tela, e é enviada à API por `PATCH /me/sheet` agrupando as mudanças de um intervalo curto (debounce), com envio imediato ao sair da página e antes do "Sair".
- Falha ao salvar (sem conexão ou 5xx) mantém as mudanças pendentes e mostra o toast "Não salvou" com "Tentar de novo". Um `401` em qualquer chamada encerra a sessão e volta para a entrada com o aviso de sessão expirada.
- Com a opção de dados de exemplo ligada, o `web` grava a ficha de exemplo por `PUT /me/sheet` logo após o cadastro.
- **BREAKING** Removidas as chaves `vtm5.accounts`, `vtm5.session`, `vtm5.name.<email>` e `vtm5.sheet.<email>` e as funções de `lib/storage.ts` que as usavam. Contas e fichas locais antigas não são importadas.

## Capabilities

### New Capabilities
- `api-client`: cliente HTTP do `web` para a API — URL base, token Bearer, tradução de erros e tratamento global de `401`.

### Modified Capabilities
- `local-accounts`: cadastro, entrada, sessão, saída e ficha de exemplo passam a usar a API e o token; saem as contas e fichas no `localStorage`.
- `app-state`: o store do jogador restaura a sessão pela API (de forma assíncrona) e o store do personagem salva a ficha pela API com envio agrupado e mudanças pendentes.
- `character-sheet`: o salvamento automático grava na API em vez de `vtm5.sheet.<email>`.
- `notifications`: o aviso "Não salvou" passa a disparar quando a gravação na API falha, com ação "Tentar de novo".

## Impact

- `web/src/lib/api.ts` (novo), `web/src/lib/auth.ts`, `web/src/lib/storage.ts`, `web/src/stores/player-store.ts`, `web/src/stores/character-store.ts`.
- `web/src/features/auth/auth-card.tsx`, `use-boot.ts`, `web/src/features/sheet/sheet-layout.tsx` e `web/src/features/wizard/wizard-shell.tsx` (logout assíncrono).
- Testes do `web` que dependem de `authenticate`/`writeSheet` passam a usar uma API falsa em memória (fetch substituído), sem nova dependência.
- `web/.env.example` e `web/README.md` com `VITE_API_URL` e como subir a API junto.
- Nenhuma mudança na API: os endpoints, o CORS (`http://localhost:3000`, cabeçalho `Authorization`) e as mensagens de erro já atendem o `web`.
