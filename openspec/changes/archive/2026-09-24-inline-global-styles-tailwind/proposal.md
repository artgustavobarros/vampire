## Why

`web/src/styles.css` hoje carrega regras visuais em `@layer base` (body, links, cursor, cor de borda padrão) e `@layer components` (a classe `.vtm-field`). Isso esconde o visual de um componente fora dele: quem lê `<Input>` vê só `vtm-field` e precisa abrir o CSS global para saber como ele se parece. Queremos que todo estilo esteja no `className` do próprio componente, em utilitários Tailwind, e que o CSS global fique só com configuração (imports, tokens e `@theme`).

## What Changes

- Remover o bloco `@layer components` e a classe `.vtm-field`; o visual de campo passa a ser `fieldVariants` (`cva`, mesmo padrão de `buttonVariants`), aplicado em `Input`, `Textarea` e `NativeSelect` (placeholder, hover, foco, disabled, `aria-invalid="true"` e `resize-y` no textarea).
- **BREAKING** (interno, sem chamadas hoje): `data-ok="1"` é substituído pela prop `state="ok"`.
- Remover o bloco `@layer base`:
  - estilos de `html`/`body` (min-height, fundo, tinta, fonte serifada, antialiasing, `overflow-x-hidden`) passam para o `className` de `<html>`/`<body>` em `__root.tsx`;
  - cor de link (sangue / sangue-hover) passa para o `className` do `Link` que precisar dela;
  - `cursor: pointer` em botões passa para o `className` de `Button` e de cada `<button>`/`role="button"` nativo;
  - cor de borda padrão (`var(--line)`) passa a ser explícita (`border-line`) em cada uso de `border*`/`divide-*` que hoje depende da cor herdada;
  - `font-family: inherit` e `margin: 0` do body são descartados, pois o preflight do Tailwind v4 já os aplica.
- `styles.css` fica apenas com `@import`, `:root` (tokens), `@theme inline` e keyframes.

## Capabilities

### New Capabilities
<!-- nenhuma -->

### Modified Capabilities
- `design-system`: adiciona o requisito de que o visual dos componentes seja declarado por utilitários Tailwind no `className`, sem regras de estilo em camadas globais (`@layer base`/`@layer components`). O visual resultante não muda.

## Impact

- `web/src/styles.css` (remoção de `@layer base` e `@layer components`).
- `web/src/routes/__root.tsx` (`<html>`/`<body>`).
- `web/src/components/ui/input.tsx`, `textarea.tsx`, `button.tsx`; `web/src/components/vtm/fields.tsx` e demais componentes em `components/vtm`.
- Features com `border*`/`divide-*` sem cor ou `<button>` nativo: `features/sheet/**`, `features/wizard/**`, `features/auth/**`, `features/actions/**`.
- Sem mudança de dependências nem de comportamento; risco principal é regressão visual (bordas que passariam a `currentColor`, cursores que voltariam a `default`).
