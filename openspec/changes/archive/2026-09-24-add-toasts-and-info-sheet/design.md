## Context

A referência `Mudancas desde o ultimo standalone.md` descreve quatro mudanças no standalone: (1) toasts de erro, (2) painel lateral de descrição, (3) hover nos gatilhos, (4) lógica de méritos na criação. O standalone implementa toasts e painel à mão (estado + `<div>` fixos). No web, a mesma experiência deve vir dos componentes shadcn: **Sonner** para toasts e **Sheet** (já presente em `components/ui/sheet.tsx`, usado no menu da ficha) para o painel.

Estado atual do web:
- `AuthCard` e `AddDisciplineDialog` guardam `error` em `useState` e renderizam `<p role="alert" class="text-blood">`.
- `lib/storage.ts` engole falhas de `setItem` em silêncio.
- `TraitGrid` renderiza o nome do traço como `<span>`; os rótulos de Fome/Humanidade/Ressonância (`ficha-tab`), Vitalidade/Força de Vontade (`track-panels`) e Potência de Sangue (`registros-tab`, painel escuro) são `<h3>`.
- O passo 7 (méritos) já funciona com `useFieldArray` — o item 4 da referência não se aplica.
- A barra inferior da ficha não mostra Potência de Sangue (só Fome); a exceção Ember da referência vale para o painel escuro de Potência de Sangue em Registros.

## Goals / Non-Goals

**Goals:**
- Reproduzir o comportamento e o visual da referência para toasts e painel usando Sonner e Sheet.
- Uma API de toast única (`notify`, `apiError`) independente do Sonner nos chamadores.
- Catálogo de textos e montagem do conteúdo do painel como dados + função pura testável.

**Non-Goals:**
- Expor `window.vtmToast`/`window.vtmApiError` (globais só existiam porque o standalone não tinha módulos).
- Reescrever a lógica de méritos do passo 7.
- Mostrar Potência de Sangue na barra inferior.
- Revisar o conteúdo dos textos do catálogo (são descrições próprias; "revisar com a mesa").

## Decisions

### 1. Sonner via shadcn, sem `next-themes`
Rodar `pnpm dlx shadcn@latest add sonner` em `web/` e ajustar `components/ui/sonner.tsx` para remover `useTheme` de `next-themes` (o app só tem tema claro). O `Toaster` usa `unstyled` + `toastOptions.classNames` com utilitários Tailwind dos tokens (`bg-surface border-line border-l-2`, sem `shadow`), respeitando a regra "estilo declarado no componente".
- *Alternativa:* toaster próprio como na referência → descartado; o usuário pediu Sonner.

### 2. Conteúdo do toast renderizado por nós (`toast.custom`)
O layout da referência (rótulo colorido, mensagem serifada, ação sublinhada, × 48×48 alinhado ao topo) não bate com o layout padrão do Sonner. `notify` usa `toast.custom((id) => <VToast … />, { id, duration })`, com `VToast` em `components/ui/sonner.tsx`. A cor da borda esquerda vem de um mapa `tom → classe` (`border-l-blood | border-l-moss | border-l-ink`); o × chama `toast.dismiss(id)`.
- *Alternativa:* `classNames` sobre o toast padrão → não permite o × de 48px nem a ordem rótulo/mensagem/ação sem hacks.

### 3. Deduplicação e limite
- **Deduplicação:** o `id` do toast é derivado da mensagem (`"v:" + msg`). O Sonner atualiza um toast existente com o mesmo id em vez de criar outro, e reinicia o tempo.
- **Limite:** `<Toaster visibleToasts={3} expand />` — `expand` mantém os três empilhados (sem o efeito de pilha comprimida), alinhados com gap de 8px.
- **Duração:** erro 6000ms, ok/info 3500ms; `duracao: 0` → `Infinity`.

### 4. Posição
`position="bottom-right"`, `offset={{ right: 24, bottom }}` e `mobileOffset={{ left: 16, right: 16, bottom }}` (Sonner já troca para o layout móvel abaixo de 600px; para bater com os 640px da referência, a largura/centralização móvel é forçada por classes `max-[639px]:` no `className` do `Toaster`, e a largura por `w-[min(420px,calc(100vw-48px))]` nos cards). `bottom` é 96 quando a rota atual começa com `/ficha`, senão 16 — lido com `useRouterState({ select: s => s.location.pathname })` num pequeno wrapper `AppToaster` no `__root.tsx`.

### 5. `lib/toast.tsx`
```ts
type Tom = "erro" | "ok" | "info";
notify(msg, { tom = "erro", titulo, duracao, acao, onAcao }?): string | number
apiError(err: unknown, retry?: () => void)
```
`apiError` porta a tabela de status da referência. Chamadores (`AuthCard`, `AddDisciplineDialog`) chamam `notify(msg)` e removem o `useState` de erro e o `<p>` — e também o `setError("")` nos `onChange` (lógica órfã).

### 6. Falha de gravação
`write()` em `lib/storage.ts` passa a chamar `onWriteFail()` no `catch`. `onWriteFail` usa um flag de módulo (`warned`) e dispara `notify("Suas mudanças ficam só nesta aba até o armazenamento voltar.", { titulo: "Não salvou", duracao: 0 })` uma vez. `storage.ts` importa `notify` de `lib/toast.tsx`, que depende só de `sonner` e do `VToast`.

### 7. Painel com Sheet + provider
`features/info/info-sheet.tsx`:
- `InfoProvider` guarda `info: InfoTarget | null` em `useState` e expõe `useInfo().open(target)`; renderiza um `<Sheet open={!!info} onOpenChange={…}>` com `SheetContent side="right"` ajustado por `className` (`w-[400px] max-w-[92vw] sm:max-w-[400px] p-6 overflow-y-auto`, `showCloseButton={false}` e um × próprio de 48×48 como na referência). Esc, clique fora e retorno de foco vêm do Radix.
- Montado uma vez no `RootComponent` de `__root.tsx`, cobrindo ficha e assistente com um só provider.
- `InfoTarget = { kind: "attr"|"skill"|"disc"|"poder"|"merit"|"fome"|"humanidade"|"vitalidade"|"vontade"|"ressonancia"|"potencia", key?, nivel?, disc?, desc?, tipo?, pts?, atual? }`.
- Cada gatilho passa o valor atual no `InfoTarget` (`nivel`, `pontos`, `marca`, `atual`), então `buildInfo(target)` não depende do store e funciona igual na ficha e no assistente (onde os valores estão no formulário). O painel é modal, então o valor não muda com ele aberto.

### 7a. Animações só com classes no JSX
Nada é adicionado a `styles.css` (sem keyframes, sem `@theme`, sem classes próprias). As animações da referência são reproduzidas com utilitários padrão do Tailwind + `tw-animate-css` no `className`:
- Toast (`vtoast`, sobe 8px, 200ms): `animate-in fade-in slide-in-from-bottom-2 duration-200 ease-out`.
- Painel (`vpanel`, 24px da direita, 200ms): sobrescrever no `className` do `SheetContent` com `data-[state=open]:slide-in-from-right-6 data-[state=open]:fade-in-0 data-[state=open]:duration-200`.
- Tamanhos e cores com classes padrão ou valores arbitrários (`w-[400px]`, `w-[min(420px,calc(100vw-48px))]`), nunca `style` inline nem CSS global.

### 8. Catálogo e função pura
- `data/trait-info.ts`: `ATTR_INFO`, `SKILL_SCALE`, `SKILL_INFO`, `DISC_INFO`, `TRAIT_INFO`, `MERIT_INFO`, `MERIT_SCALE_V`, `MERIT_SCALE_D`, portados da referência (tipados).
- `features/info/build-info.ts`: `buildInfo(target) → InfoContent` com `{ kicker, titulo, desc, atual, nivelTit, niveis: {n, txt, current}[], nota }`. Usa `ATTRIBUTE_GROUPS`/`SKILL_GROUPS` de `data/traits.ts` para o grupo e `POWERS` de `data/disciplines.ts` (campos `level/name/description/rouse/cost/duration` no lugar dos índices da referência).
- Mapeamento de tipo de mérito: no web `tipo` é `"vantagem" | "defeito"` (não `V`/`D`).

### 9. Gatilhos
- Componente `InfoTrigger` (`components/vtm/info-trigger.tsx`): `<button type="button">` sem estilo de botão, `cursor-pointer text-inherit no-underline transition-colors duration-150 hover:text-blood`, variante `onDark` → `hover:text-ember`. Um `InfoButton` para o **?** 40×40 (borda `line`, Karla).
- `TraitGrid` recebe `infoKind?: "attr" | "skill"`; quando presente, o nome vira `InfoTrigger`. Usado na ficha e nos passos 2 e 3.
- Disciplinas: `InfoButton` ao lado do nome editável; "Sobre este poder" dentro do poder expandido.
- Passo 7: `InfoButton` em cada linha, passando `nome`, `tipo`, `pontos` atuais.
- Estados: o texto do `<h3>` vira `InfoTrigger` (o `<h3>` continua como heading). Humanidade passa `atual` "N / 10"; Vitalidade/Vontade passam o total de caixas.

### 10. Toast sobre modal aberto
Radix trata o clique num toast como "clique fora" e fecharia o diálogo por baixo. `DialogContent` e `SheetContent` chamam `ignoreToastInteraction` (exportado de `components/ui/sonner.tsx`) no `onInteractOutside`, e o `VToast` usa `pointer-events-auto`.

## Risks / Trade-offs

- [Sonner muda o layout móvel em 600px, não 640px] → forçar a largura/centralização com utilitário `max-[639px]:` no `className` do `Toaster`; aceitar 40px de diferença se o override não pegar no `<ol>` interno, e registrar.
- [Com um modal aberto, o Radix marca o resto da página `aria-hidden`, então leitores de tela podem não anunciar o toast do diálogo de disciplinas] → aceito; o foco segue no diálogo e o toast é visível.
- [`toast.custom` perde o `role="alert"` automático] → `VToast` define `role="alert"` no próprio card; o `Toaster` define `containerAriaLabel="Avisos"`.
- [Testes que procuram `role="alert"` inline no login] → os testes de auth ficam no nível do store (`stores.test.ts`) e não dependem do `<p>`; `wizard.test.tsx:110` só verifica ausência. Adicionar teste de componente que renderiza `<Toaster />` e confirma o toast.
- [Painel dentro do `__root` precisa do store da ficha antes do login] → `buildInfo` tolera ficha vazia; os gatilhos só existem em telas autenticadas.
- [Textos do catálogo não são do livro] → manter o aviso como comentário no arquivo de dados.

## Migration Plan

Sem migração de dados. Rollback = reverter o commit; `sonner` pode ficar como dependência órfã e deve ser removido junto.

## Open Questions

- Nenhuma bloqueante. Se a mesa quiser, os textos do catálogo podem ser revisados depois sem mudar código.
