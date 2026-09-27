## ADDED Requirements

### Requirement: Estilo declarado no componente
O visual de cada elemento SHALL ser declarado por utilitários Tailwind no `className` do próprio componente (ou do elemento `<html>`/`<body>` em `__root.tsx`). O CSS global (`web/src/styles.css`) MUST conter apenas imports, tokens (`:root`), `@theme` e keyframes, sem regras em `@layer base` nem `@layer components` e sem classes utilitárias próprias (como `.vtm-field`). A migração MUST preservar o visual existente.

#### Scenario: CSS global sem regras de estilo
- **WHEN** `web/src/styles.css` é inspecionado
- **THEN** ele não contém `@layer base`, `@layer components` nem seletores de elemento ou classe fora de `:root` e `@theme`

#### Scenario: Campo de texto estilizado por variante
- **WHEN** um `Input`, `Textarea` ou `NativeSelect` é renderizado
- **THEN** seu `className` vem de `fieldVariants` (fundo `field`, borda de 1px `line`, padding de 12px, serifada 18px com entrelinha 1.4, cantos retos) e não contém `vtm-field`

#### Scenario: Estados do campo
- **WHEN** um campo recebe hover, foco, `disabled` ou `aria-invalid="true"`
- **THEN** a borda passa respectivamente a `line-strong`, `line-focus`, (opacidade .45 e cursor `not-allowed`) e `blood`, sem sombra de foco

#### Scenario: Campo validado
- **WHEN** um campo é renderizado com `state="ok"`
- **THEN** sua borda é `moss`, inclusive em hover e foco

#### Scenario: Borda sem cor explícita
- **WHEN** um elemento usa `border`, `border-{lado}` ou `divide-*` e não é um estado com cor própria
- **THEN** ele declara `border-line` (ou outra cor) no próprio `className`, exibindo borda `rgba(13,13,13,.25)` e não `currentColor`

#### Scenario: Cursor em botões
- **WHEN** o usuário passa o ponteiro sobre um botão habilitado (`Button`, `<button>` nativo ou `role="button"`)
- **THEN** o cursor é `pointer`, declarado por `cursor-pointer` no `className` do elemento

#### Scenario: Documento
- **WHEN** qualquer rota é carregada
- **THEN** `<body>` tem fundo `paper`, texto `ink`, fonte serifada, antialiasing e `overflow-x-hidden`, e `<html>`/`<body>` ocupam no mínimo 100% da altura, tudo via `className`
