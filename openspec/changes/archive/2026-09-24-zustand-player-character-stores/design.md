## Context

`web/src/lib/store.ts` é um store externo feito à mão: um objeto `state: AppState` (`user`, `ready`, `sheet`, `hungerAlert`), um `Set` de listeners e `useAppState()` via `useSyncExternalStore`, com `getServerSnapshot` devolvendo o estado inicial. Os componentes usam `useAppState()` (estado inteiro), `useSheet()` e `patchSheet()`; `auth.ts` chama `store.load`/`store.logout`; `use-boot.ts` chama `store.restore()` depois da hidratação.

Os tipos em `web/src/lib/types.ts` só descrevem o personagem (`Sheet` e subtipos: `Discipline`, `Merit`, `Conviction`, `SessionLog`, `DamageMark`…). O "jogador" hoje é só o e-mail da sessão (`user`) mais o nome gravado em `vtm5.name.<email>`, que nunca é lido de volta.

O app roda em TanStack Start (SSR), então os stores são módulos compartilhados no servidor; só o estado inicial pode aparecer lá.

## Goals / Non-Goals

**Goals:**
- Trocar o store feito à mão por Zustand v5.
- Separar **jogador** (sessão: `user`, `name`, `ready`) de **personagem** (`sheet`, `hungerAlert`).
- Permitir seletores para que mudanças na ficha não re-renderizem quem só lê a sessão.
- Manter `useSheet`/`patchSheet` com a mesma assinatura para limitar a mudança nos componentes.
- Manter chaves e formato do `localStorage` e o comportamento visível.

**Non-Goals:**
- Vários personagens por jogador (continua uma ficha por e-mail).
- Mudar `storage.ts` para outro backend ou usar o middleware `persist`.
- Reescrever componentes para seletores finos campo a campo (pode vir depois).
- Mover `settings.ts`, estado do assistente ou estado de diálogos para stores.

## Decisions

### 1. Dois stores em `web/src/stores/`

```
stores/
  player-store.ts     usePlayerStore   { user, name, ready } + restore, login, logout
  character-store.ts  useCharacterStore { owner, sheet, hungerAlert } + load, clear, patch, dismissHungerAlert
```

Cada um criado com `create<State>()((set, get) => …)`. Alternativa considerada: um único store com *slices* — rejeitada porque o pedido é justamente separar jogador e personagem, e dois stores deixam as assinaturas independentes.

### 2. Direção da dependência: jogador → personagem

O store do jogador orquestra: `login(email)` grava `user`/`name` e chama `useCharacterStore.getState().load(email)`; `logout()` limpa a si mesmo e chama `clear()`; `restore()` lê `vtm5.session` e chama `login` se houver sessão. O store do personagem **não importa** o do jogador: guarda o próprio `owner` (e-mail recebido em `load`) e usa ele em `patch` para gravar `vtm5.sheet.<owner>`. Evita import circular e deixa o store do personagem testável sozinho.

Alternativa: `patch` ler `usePlayerStore.getState().user` — rejeitada pelo ciclo de imports e pelo acoplamento.

### 3. Persistência explícita, sem middleware `persist`

`load` usa `normalizeSheet(readSheetRaw(email))`; `patch` usa `writeSheet(owner, sheet)`. O `persist` do Zustand usa uma chave fixa por store e hidrata sozinho, mas aqui a chave depende do jogador (`vtm5.sheet.<email>`), a ficha precisa de `normalizeSheet` e a leitura tem que esperar a hidratação (`restore` no `useBoot`). `storage.ts` já trata exceções do `localStorage`.

### 4. `hungerAlert` fica no store do personagem

O alerta é derivado de `patch` (`hungerAlertFor(prev.fome, next.fome)`), então fica junto da ficha para que a mudança seja atômica.

### 5. API pública e SSR

- `useSheet = () => useCharacterStore((s) => s.sheet)`.
- `patchSheet = (p) => useCharacterStore.getState().patch(p)` — função estável, usada fora de componentes (`flows.ts`).
- Leitura imperativa (`store.get().sheet`) vira `useCharacterStore.getState().sheet`.
- `useAppState()` some; quem precisa de sessão usa `usePlayerStore((s) => s.user)` etc. Onde precisar de vários campos, `useShallow`.
- No servidor, o `useStore` do Zustand v5 usa `getInitialState()` como snapshot do servidor, equivalente ao `getServerSnapshot` atual. Como só `restore()` (no cliente, em `useEffect`) lê o armazenamento, o estado compartilhado no servidor nunca sai do inicial.
- Testes: `reset` vira `useX.setState(useX.getInitialState(), true)` num helper `resetStores()` em `web/src/stores/test-utils.ts`.

### 6. `homeTarget({ user, criada })`

Recebe só o necessário em vez de `AppState`, já que o estado agora vem de dois stores.

## Risks / Trade-offs

- [Componentes que leem a ficha inteira continuam re-renderizando a cada `patch`] → aceitável agora; seletores por campo podem vir depois sem mudar a API.
- [Esquecer `login`/`logout` pelo store do jogador e ficar com personagem de outro jogador] → só o store do jogador chama `load`/`clear`; teste cobrindo "sair limpa jogador e personagem".
- [Estado compartilhado entre requisições no servidor] → nenhuma ação de escrita roda no servidor; spec "Estado inicial no servidor".
- [`useSheet` selecionando um objeto novo a cada `patch`] → é a mesma referência até o próximo `patch`, então não há loop de render.

## Migration Plan

Mudança só de código, sem migração de dados. Rollback: reverter o commit (as chaves `vtm5.*` não mudam).

## Open Questions

Outros stores que podem valer a pena depois (não fazem parte desta mudança):
- **UI store**: alerta de Fome, menu aberto da ficha, diálogo de regra — tiraria estado de interface do store do personagem.
- **Settings store**: `settings.ts` hoje é `as const`; viraria store se as opções forem editáveis pelo usuário.
- **Wizard store**: passo atual e rascunho do assistente, se quisermos desacoplar o rascunho da ficha salva.
