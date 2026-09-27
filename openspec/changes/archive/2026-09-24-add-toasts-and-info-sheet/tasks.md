## 1. Base: Sonner e animações

- [x] 1.1 Em `web/`, rodar `pnpm dlx shadcn@latest add sonner`; remover `next-themes` do `package.json` e o `useTheme` de `components/ui/sonner.tsx`
- [x] 1.2 Criar `VToast` em `components/ui/sonner.tsx`: card Vellum, filete `line`, `border-l-2` por tom (blood/moss/ink), sem sombra, rótulo Karla, mensagem Cormorant 18/1.5, ação sublinhada opcional, × 48×48 com `aria-label="Fechar aviso"`, `role="alert"`, entrada com `animate-in fade-in slide-in-from-bottom-2 duration-200` — tudo em classes Tailwind no JSX, nada em `styles.css`
- [x] 1.3 Configurar o `Toaster` exportado: `position="bottom-right"`, `visibleToasts={3}`, `expand`, `containerAriaLabel="Avisos"`, largura `min(420px, calc(100vw - 48px))`, offset direito 24px, layout móvel (<640px) centralizado com 16px laterais, prop `bottom` (px)

## 2. API de toast

- [x] 2.1 Criar `lib/toast.tsx` com `notify(msg, opts)` usando `toast.custom` + `VToast`, id derivado da mensagem (dedup), duração 6000 (erro) / 3500 (ok, info) / `Infinity` para `duracao: 0`, rótulos padrão "Algo deu errado" / "Feito" / "Aviso"
- [x] 2.2 Implementar `apiError(err, retry?)` com a tabela de status (401/403, 404, 409, 400/422, 5xx, sem status) e ação "Tentar de novo"
- [x] 2.3 Testes unitários de `apiError` (mensagem e rótulo por status) e de dedup/duração em `notify` (mock de `sonner`)

## 3. Toaster na raiz e troca dos erros inline

- [x] 3.1 Criar `AppToaster` em `__root.tsx` que lê o pathname (`useRouterState`) e passa `bottom` 96 em `/ficha*`, 16 nas demais; renderizá-lo junto do `<Outlet />`
- [x] 3.2 `AuthCard`: trocar `setError(err)` por `notify(err)`; remover o estado `error`, o `<p role="alert">` e os `setError("")` em `edit`/`toggleMode` (simplificar `edit` se ficar só com `set`)
- [x] 3.3 `AddDisciplineDialog`: trocar o erro "Selecione ou digite uma disciplina." por `notify(...)`, remover estado `error`, o `<p role="alert">` e os `setError("")`
- [x] 3.4 `lib/storage.ts`: no `catch` de `write`, disparar uma vez por sessão `notify(..., { titulo: "Não salvou", duracao: 0 })`
- [x] 3.5 Teste de componente: login com senha errada renderiza o toast "Senha incorreta." (com `<Toaster />` montado) e nenhum `<p>` de erro no formulário; teste do toast "Não salvou" com `setItem` lançando

## 4. Catálogo e conteúdo do painel

- [x] 4.1 Criar `data/trait-info.ts` com `ATTR_INFO`, `SKILL_SCALE`, `SKILL_INFO`, `DISC_INFO`, `TRAIT_INFO`, `MERIT_INFO`, `MERIT_SCALE_V`, `MERIT_SCALE_D` portados da referência, tipados, com o aviso "descrições próprias, revisar com a mesa"
- [x] 4.2 Criar `features/info/build-info.ts`: tipo `InfoTarget` e `buildInfo(target, sheet)` para attr, skill, disc, poder, merit e os seis estados, usando `ATTRIBUTE_GROUPS`/`SKILL_GROUPS` e `POWERS` (`level`, `name`, `description`, `rouse`, `cost`, `duration`) e `tipo` `vantagem|defeito`
- [x] 4.3 Testes de `buildInfo`: atributo com 3 pontos destaca "•••", habilidade zerada "Sem treino", disciplina fora do catálogo, mérito por prefixo, poder com Rouse, Fome atual destacada

## 5. Painel lateral (Sheet)

- [x] 5.1 Criar `features/info/info-sheet.tsx` com `InfoProvider`/`useInfo().open(target)` e o `Sheet side="right"` (`w-[400px] max-w-[92vw] sm:max-w-[400px] p-6 overflow-y-auto border-l data-[state=open]:slide-in-from-right-6 data-[state=open]:duration-200`, `showCloseButton={false}`, × próprio 48×48), título em `SheetTitle`, selo, descrição, lista de níveis com destaque do atual e nota
- [x] 5.2 Montar `InfoProvider` no `RootComponent` de `__root.tsx`
- [x] 5.3 Criar `components/vtm/info-trigger.tsx`: `InfoTrigger` (texto, sem sublinhado, `hover:text-blood transition-colors duration-150`, variante `onDark` com `hover:text-ember`) e `InfoButton` (**?** 40×40)
- [x] 5.4 Teste de componente: clicar no gatilho abre o painel com nome acessível, Esc fecha

## 6. Gatilhos

- [x] 6.1 `TraitGrid`: prop `infoKind?: "attr" | "skill"` que transforma o nome em `InfoTrigger`; passar em `ficha-tab` e nos passos 2 e 3 do assistente
- [x] 6.2 `disciplinas-tab`: `InfoButton` ao lado do nome de cada disciplina (com `nivel`) e link "Sobre este poder" no poder expandido (com `disc`, `nivel`, `desc`)
- [x] 6.3 `step7-merits`: `InfoButton` em cada linha com `nome`, `tipo` e `pontos` atuais
- [x] 6.4 Rótulos de estado como `InfoTrigger`: Fome, Humanidade e Ressonância (`ficha-tab`), Vitalidade e Força de Vontade (`track-panels`), Potência de Sangue (`registros-tab`, variante `onDark`)

## 7. Verificação

- [x] 7.1 `pnpm typecheck`, `pnpm check` e `pnpm test` passando em `web/`
- [x] 7.2 Conferir no navegador: toast no login (desktop e 375px), toast acima da barra na ficha, dedup, painel abrindo por cada gatilho e hover Blood/Ember
