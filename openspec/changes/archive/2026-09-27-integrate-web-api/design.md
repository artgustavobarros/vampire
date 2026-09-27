## Context

O `web` (TanStack Start + Zustand) guarda tudo no `localStorage` por `lib/storage.ts`: `lib/auth.ts` compara a senha em texto puro com `vtm5.accounts`, o `usePlayerStore.restore()` lê `vtm5.session` de forma síncrona e o `useCharacterStore.patch()` mescla a ficha e grava o JSON inteiro em `vtm5.sheet.<email>` a cada mudança — inclusive a cada tecla nos campos de texto.

A API em `api/` (NestJS, mudança `add-nestjs-api`) já tem o contrato pensado para essa troca:

| Hoje no `web` | Na API |
|---|---|
| `authenticate({ mode: "signup" })` | `POST /api/auth/signup` → `{ accessToken, user }` |
| `authenticate({ mode: "login" })` | `POST /api/auth/login` → `{ accessToken, user }` |
| `readSession()` + `readPlayerName()` | `GET /api/auth/me` → `{ id, email, name }` |
| `readSheetRaw(email)` | `GET /api/me/sheet` → `{ sheet \| null, updatedAt }` |
| `writeSheet` depois de `{ ...prev, ...partial }` | `PATCH /api/me/sheet { patch }` (mescla rasa `jsonb \|\| jsonb`, atômica) |
| ficha de exemplo no cadastro | `PUT /api/me/sheet { sheet }` |
| `clearSession()` | descartar o token |

O CORS já libera `http://localhost:3000` com o cabeçalho `Authorization`, os erros vêm sempre como `{ statusCode, message, error }` com `message` em português, e `lib/toast.tsx` já tem `apiError(err, retry?)` que entende `{ status, message }`.

## Goals / Non-Goals

**Goals:**
- Contas e ficha só na API; o navegador guarda apenas o token.
- A ficha continua respondendo na hora na tela; a rede não pode deixar a edição lenta nem perder mudanças silenciosamente.
- Poucas requisições: agrupar edições em vez de uma por tecla.
- Tratamento único de `401` e de falha de rede.
- Testes do `web` sem API real e sem dependência nova.

**Non-Goals:**
- Importar contas ou fichas antigas do `localStorage`.
- Cookie httpOnly, refresh token ou revogação de token.
- Edição simultânea em dois dispositivos (última gravação vence, por chave de primeiro nível).
- Modo offline com fila persistida entre recarregamentos.
- Mudanças na API, compose unificado ou pacote de tipos compartilhado entre `web` e `api`.

## Decisions

### 1. Cliente `fetch` fino em `lib/api.ts`

Um `request<T>(method, path, body?)` sobre `fetch`, com `API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333/api"`, `Content-Type: application/json` e `Authorization: Bearer` quando há token. Resposta fora de 2xx vira `class ApiError extends Error { status }` com a `message` do corpo; falha de rede deixa passar o `TypeError` do `fetch` (sem `status`). Os dois formatos já são entendidos por `apiError`. Funções nomeadas por endpoint: `signup`, `login`, `me`, `getSheet`, `putSheet`, `patchSheet`.

O token vive numa variável do módulo (`getToken`/`setToken`) espelhada em `vtm5.token` por `storage.ts`; assim, com `localStorage` bloqueado, a sessão segue em memória.

- Alternativas: TanStack Query (bom para cache de listas, mas aqui há uma ficha só, já cacheada no Zustand, e a gravação precisa de agrupamento próprio); `ky`/`axios` (dependência a mais para ~40 linhas); server functions do TanStack Start como proxy (adiciona um salto e exigiria sessão no servidor do `web`).

### 2. `401` global via callback, não import circular

`lib/api.ts` expõe `onUnauthorized(handler)`. Em chamada autenticada que recebe `401`, o cliente chama o handler e rejeita. O handler é registrado em `lib/auth.ts`: apaga o token, limpa os stores e chama `apiError({ status: 401 })`. As rotas `/ficha` e `/criar` já redirecionam para `/entrar` quando `user` vira `null`, então não é preciso navegar à mão. `login`/`signup` são chamadas públicas e não disparam o handler — o `401` do login é "E-mail ou senha incorretos.".

### 3. Sessão: token + restauração assíncrona

- `usePlayerStore` troca `restore()` síncrono por `restore(): Promise<void>` com guarda contra chamadas concorrentes (`restoring`). Sem token: `ready: true` na hora. Com token: `Promise.all([me(), getSheet()])`, depois `set({ user: email, name })`, `useCharacterStore.getState().load(sheet)` e `ready: true`.
- `login(user, sheet)` do store recebe os dados já buscados; quem busca é `lib/auth.ts`, para o store não depender da ordem das chamadas.
- `401` na restauração: token apagado, `ready: true`, sem jogador → `/entrar`.
- Falha de rede na restauração: `ready` fica `false` (a `BootScreen` continua) e aparece `apiError(err, () => restore())`. Sair para `/entrar` com um token possivelmente válido confundiria o jogador.
- `user` continua sendo o e-mail (é o que as rotas e a barra usam); `name` vem da API.

### 4. `authenticate` assíncrono, validação local antes

`authenticate(input): Promise<boolean>` passa a mostrar os próprios toasts e devolver se entrou. Antes de chamar a API confere, na ordem das mensagens atuais: campos vazios, e-mail inválido, nome, senha < 6 e senhas iguais — as mesmas mensagens da API, sem ida e volta. Depois chama a API: `ApiError` 400/401/409 vira `notify(message)` (erro do formulário); erro de rede ou 5xx vai para `apiError` (rótulo "Sem conexão"/"Erro 5xx"). Concentrar os toasts em `authenticate` evita que o `AuthCard` precise distinguir os dois tipos de erro.

No cadastro com `settings.dadosDeExemplo`, `putSheet(exampleSheet())` roda antes de entrar; a resposta é a ficha carregada.

O `AuthCard` guarda `pending` num `useState`, desabilita o botão com "Entrando…"/"Criando…" e ignora submits enquanto `pending`.

### 5. Gravação agrupada no `useCharacterStore`

O estado ganha `pending: Set<keyof Sheet>` (fora do estado reativo, num módulo `sheet-sync.ts` junto do store, para não re-renderizar a cada tecla). Fluxo:

1. `patch(partial)` mescla na hora como hoje, atualiza o alerta de Fome e, se há dono, adiciona as chaves de `partial` a `pending` e reinicia um timer de **600 ms**.
2. `flush()`: se já há um envio em andamento, marca "de novo depois" e retorna a mesma promessa. Senão, tira um instantâneo das chaves pendentes, limpa `pending`, monta `{ [k]: sheet[k] }` com os valores **atuais** e chama `patchSheet`.
3. Sucesso: nada a fazer (valores mudados durante o envio já voltaram a `pending` pelo passo 1). Se havia "de novo depois", chama `flush()` outra vez.
4. Falha de rede/5xx: devolve as chaves do instantâneo a `pending` e mostra `notify(msg, { titulo: "Não salvou", duracao: 0, acao: "Tentar de novo", onAcao: flush })`. A mensagem sai do mesmo mapeamento de `apiError`, extraído para uma função `apiErrorMessage(err)` reaproveitada. Como `notify` deduplica por mensagem, falhas seguidas não empilham toasts; um sucesso fecha o toast (`toast.dismiss`).
5. `401`: tratado pelo handler global (decisão 2), que limpa `pending`.

Campos apagados (ex.: `predBonus: undefined` ao desfazer o Predador) vão como `null`, já que o JSON descarta `undefined`; o `normalizeSheet` trata `null` como campo ausente ao carregar.

Um `PATCH` só com as chaves mudadas combina com a mescla rasa atômica da API: dois envios nunca apagam um ao outro, e a ficha no banco converge para a da tela. `attrs`, `skills`, `disc` etc. vão inteiros quando mudam, como o `patch` do store já faz.

`flush()` também roda em `pagehide` e `visibilitychange` → `hidden` (registrados uma vez no cliente, no `useBoot`), usando `fetch(..., { keepalive: true })`, e é aguardado pelo `logout()` com tempo-limite de 2 s antes de apagar o token.

- Alternativas: `PUT` da ficha inteira a cada mudança (payload maior e uma aba antiga sobrescreve tudo); sem debounce (uma requisição por tecla); `navigator.sendBeacon` (não manda `Authorization`); guardar pendências no `localStorage` para sobreviver a recarregar (contradiz "só o token no navegador" e fica para uma fase offline).

### 6. `logout()` assíncrono

`logout(): Promise<void>` = `await flush()` com timeout → `setToken(null)` → limpa stores (incluindo `pending` e timer). O menu da ficha e o botão "Voltar" do passo 1 do assistente passam a `await logout()` antes de navegar. Falha no `flush` não impede a saída (a pendência é descartada; o toast "Não salvou" já avisou).

### 7. Limpeza do armazenamento local

`storage.ts` fica só com `readToken`/`writeToken`/`clearToken` (chave `vtm5.token`) e o `try/catch` atual. Saem `readAccounts`, `writeAccounts`, `readSession`, `writeSession`, `clearSession`, `writePlayerName`, `readPlayerName`, `readSheetRaw`, `writeSheet`, o tipo `Accounts` e o aviso "Não salvou" de falha do `localStorage` (esse aviso agora é da gravação na API). Não apagamos as chaves antigas do navegador de ninguém — só deixamos de lê-las.

### 8. Testes com API falsa em memória

`src/test/fake-api.ts` substitui `fetch` por `vi.stubGlobal` com um pequeno roteador que imita os endpoints (contas em `Map`, uma ficha por token, mesma mescla rasa, mesmas mensagens e status). Helpers: `fakeApi.reset()`, `fakeApi.seed({ email, password, sheet })`, `fakeApi.fail("network" | 500)` e `fakeApi.calls` para contar requisições. Os testes com debounce usam `vi.useFakeTimers()`. Isso mantém os testes de `stores`, `auth-card` e `wizard` rodando sem Postgres; os e2e reais continuam na API.

## Risks / Trade-offs

- [Mudanças dos últimos 600 ms se perdem se a aba morrer sem `pagehide` (crash, bateria)] → janela curta; `keepalive` cobre fechar/trocar de aba normalmente.
- [`keepalive` com `Authorization` exige preflight CORS; navegadores antigos podem descartar] → CORS da API já responde ao preflight; na falha, o pior caso é o do item acima.
- [Token no `localStorage` exposto a XSS] → aceito nesta fase, como decidido em `add-nestjs-api`; cookie httpOnly fica em aberto.
- [Dois dispositivos editando ao mesmo tempo sobrescrevem por chave] → um personagem por jogador e uso típico em um aparelho por vez; `updatedAt` já volta da API caso um controle de versão venha depois.
- [JWT expira em 7 dias sem refresh] → `401` leva à entrada com aviso claro; mudanças pendentes nesse instante se perdem.
- [Perda de dados locais de quem já usava o app] → o app ainda é de desenvolvimento; documentar no README que contas antigas precisam ser recriadas.
- [`BootScreen` presa sem API] → o toast "Sem conexão" com "Tentar de novo" deixa claro o que falta; o README explica subir a API.

## Migration Plan

1. Subir a API (`cd api && docker compose up -d`), que já aplica as migrações.
2. Criar `web/.env` a partir de `web/.env.example` se a API não estiver em `http://localhost:3333/api`.
3. Publicar o `web` novo. Jogadores recriam a conta; fichas antigas do navegador ficam intocadas, mas sem uso.
4. Rollback: voltar o commit do `web`; como as chaves antigas não são apagadas, os dados locais continuam lá.

## Open Questions

- Vale oferecer, numa próxima mudança, "importar ficha deste navegador" quando a API devolve `sheet: null` e existe `vtm5.sheet.<email>`?
- O intervalo de 600 ms é bom para digitação e cliques rápidos nos pontos? Ajustável depois de usar.
