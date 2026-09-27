## Context

`web/src/styles.css` (Tailwind v4) tem três partes: tokens (`:root` + `@theme inline` + keyframes), `@layer base` e `@layer components`. As duas últimas aplicam estilo "à distância":

- `.vtm-field` é usada por `ui/input.tsx`, `ui/textarea.tsx` e `NativeSelect` em `vtm/fields.tsx`.
- `@layer base` define cor de borda padrão (`--line`) para todo elemento, estilo do `body`, cor de `<a>`, `font-family: inherit` em controles e `cursor: pointer` em botões.

~120 usos de `border*`/`divide-*` em ~28 arquivos dependem da cor de borda global. O preflight do Tailwind v4 usa `currentColor` como cor padrão e `cursor: default` em botões, então simplesmente apagar a camada base muda o visual.

## Goals / Non-Goals

**Goals:**
- Todo estilo no `className` dos componentes, em utilitários Tailwind.
- `styles.css` só com imports, tokens, `@theme` e keyframes.
- Visual idêntico ao atual.

**Non-Goals:**
- Mudar tokens, paleta ou tipografia.
- Refatorar componentes além do necessário para mover as classes.
- Reestilizar os componentes shadcn que já têm cor de borda própria (`border-input`, etc.).

## Decisions

**1. Campo como `cva` (`fieldVariants`), no mesmo padrão de `buttonVariants`.**
`ui/input.tsx` exporta `fieldVariants`. `Input`, `Textarea` e `NativeSelect` aceitam a prop `state` (`VariantProps<typeof fieldVariants>`) e aplicam `cn(fieldVariants({ state }), className)`. Textarea acrescenta `resize-y`.
Base (tradução de `.vtm-field`):
`w-full rounded-none border border-line bg-field p-3 font-normal font-serif text-ink text-lg leading-[1.4] outline-none transition-[border-color,background-color] duration-150 ease-[ease] placeholder:text-ink-ghost hover:border-line-strong focus:border-line-focus focus:shadow-none focus-visible:border-line-focus disabled:cursor-not-allowed disabled:opacity-45 aria-invalid:border-blood`
Variantes: `state: { default: "", ok: "border-moss hover:border-moss focus:border-moss" }`, `defaultVariants: { state: "default" }`.
- `data-ok="1"` deixa de existir: vira `state="ok"` (hoje nenhum campo o usa, então não há migração de chamadas).
- `aria-invalid` continua como atributo (é semântica de acessibilidade), estilizado pelo prefixo `aria-invalid:`.
- Alternativa: constante `fieldClassName` — equivalente, mas o `cva` segue o padrão do projeto e comporta o estado `ok`.
- Alternativa: `@utility vtm-field` no CSS — descartado; é exatamente o CSS global que queremos eliminar.

**2. Cor de borda explícita por uso.**
Cada `border`/`border-{t,r,b,l,x,y}`/`divide-*` sem classe de cor recebe `border-line` (ou `divide-line`). Usos que já têm cor em todos os estados (`border-ink`, `border-input`, `border-blood`…) ficam como estão; em classes condicionais, a cor base `border-line` vai na parte fixa e a cor de estado sobrescreve (tailwind-merge resolve o conflito no `cn`).
- Alternativa: manter só a regra `* { border-color }` global — descartado; contradiz o pedido.

**3. Documento em `__root.tsx`.**
`<html className="min-h-full">` e `<body className="min-h-full overflow-x-hidden bg-paper font-serif text-ink antialiased">`. `margin: 0`, `-webkit-text-size-adjust` e `font-family: inherit` em controles já vêm do preflight do Tailwind v4 e são descartados.

**4. Links.**
O único `<Link>` (menu da ficha) já define cor própria (`text-ink`/`text-white`) que vence a camada base, então a regra de `a` não tem efeito hoje e é apenas removida. Novos links usarão `text-blood hover:text-blood-hover` no próprio `className`.

**5. Cursor.**
`buttonVariants` ganha `cursor-pointer` (o `disabled:cursor-not-allowed` existente já cobre o desabilitado). Cada `<button>` nativo e `role="button"` recebe `cursor-pointer` (e `disabled:cursor-not-allowed` se puder ficar desabilitado). Os constantes de classe compartilhados (ex.: `MENU_ITEM`) recebem a classe uma vez.

## Risks / Trade-offs

- [Borda esquecida vira `currentColor` (preta)] → Após a migração, `grep` por `border`/`divide-` sem cor na mesma string e revisão visual das telas de login, wizard (7 passos) e abas da ficha.
- [Ordem de variantes: no CSS original `aria-invalid` vem depois de hover/focus e vence] → Conferir no CSS gerado que `aria-invalid:` aparece depois de `hover:`/`focus:`; se não, usar `hover:not-aria-invalid:`. O estado `ok` já declara `hover:`/`focus:` próprios, então não depende da ordem.
- [Consumidor passa `text-base` ou similar e o tailwind-merge remove `text-lg`] → Comportamento desejado (antes o override por classe não funcionava por especificidade; agora funciona).
- [`ease-[ease]` vs `ease-in-out`] → Usar `ease-[ease]` para manter a curva exata.

## Migration Plan

Mudança só de front-end, sem dados. Rollback = reverter os arquivos.
