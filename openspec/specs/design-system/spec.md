# design-system Specification

## Purpose
Identidade visual da ficha V5 (tokens de cor, tipografia, tema shadcn) e componentes base — pontos, trilhas de dano, cartões selecionáveis e rótulos — que reproduzem o standalone.
## Requirements
### Requirement: Tokens visuais do standalone
O app SHALL definir como tokens de tema (variáveis CSS consumidas por Tailwind e shadcn) a paleta do standalone: fundo `#EDEDEB`, superfície `#F4F3F0`, campo `#FFFFFF`, tinta `#0D0D0D`, tinta suave `rgba(13,13,13,.68)`, borda `rgba(13,13,13,.25)`, divisória `rgba(13,13,13,.1)`, sangue `#7A1220` e verde `#2F6B3C`. O raio de borda padrão MUST ser 0 (cantos retos), exceto nos pontos circulares.

#### Scenario: Superfícies usam os tokens
- **WHEN** qualquer tela é renderizada
- **THEN** o `body` usa o fundo `#EDEDEB`, os cartões usam `#F4F3F0` com borda de 1px `rgba(13,13,13,.25)` e nenhum botão, campo ou cartão tem cantos arredondados

#### Scenario: Estados de erro e sucesso
- **WHEN** um campo está inválido (`aria-invalid="true"`)
- **THEN** sua borda usa a cor sangue `#7A1220`

### Requirement: Tipografia
O app SHALL usar **Cormorant Garamond** (400, 400 itálico, 600) para textos, títulos e campos, e **Karla** (600) para rótulos, botões e abas, em caixa-alta com espaçamento de letras entre `.02em` e `.22em`, conforme o standalone. As fontes MUST ser servidas localmente (sem depender do Google Fonts em tempo de execução).

#### Scenario: Rótulo de seção
- **WHEN** um rótulo de campo é exibido (ex.: "E-mail")
- **THEN** ele aparece em Karla 600, 12px, caixa-alta, espaçamento `.12em`, na cor tinta suave

#### Scenario: Funciona offline
- **WHEN** o app é aberto sem conexão com a internet após o primeiro carregamento
- **THEN** os textos continuam em Cormorant Garamond e Karla

### Requirement: Componentes base compartilhados
O app SHALL oferecer componentes reutilizáveis equivalentes aos elementos do standalone: `DotRating` (pontos circulares de 24px, preenchidos em tinta), `DamageTrack` (caixas de vitalidade/Força de Vontade com estados vazio, `/` superficial e `✕` agravado), `SelectableCard` (cartão que inverte para fundo tinta e texto branco quando selecionado), `Kicker` (rótulo Karla em sangue) e botões primário (fundo tinta), secundário (contorno) e de perigo (fundo sangue), todos com altura mínima de toque de 48px.

#### Scenario: Clique em ponto
- **WHEN** o usuário clica no terceiro ponto de um `DotRating` com valor 1
- **THEN** o valor passa a 3 e os três primeiros pontos aparecem preenchidos

#### Scenario: Clique no ponto já no topo
- **WHEN** o usuário clica no ponto que corresponde ao valor atual
- **THEN** o valor diminui em 1 (permitindo zerar o traço)

#### Scenario: Cartão selecionado
- **WHEN** um `SelectableCard` está selecionado
- **THEN** ele exibe fundo `#0D0D0D`, texto `#FFFFFF` e borda `#0D0D0D`

### Requirement: Layout responsivo
As telas SHALL seguir as larguras máximas do standalone (auth 420px, assistente 820px, ficha 1000px), com grades `auto-fit` que colapsam para uma coluna em telas de celular, sem rolagem horizontal.

#### Scenario: Celular
- **WHEN** a ficha é aberta numa janela de 375px de largura
- **THEN** grupos de atributos e habilidades aparecem em uma coluna e nada transborda horizontalmente

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

### Requirement: Valores permitidos no DotRating
O `DotRating` SHALL aceitar uma lista opcional de valores permitidos. Quando a lista é dada, cada ponto acima do maior valor da lista MUST ser desenhado com borda tracejada em `ink/25`, sem preenchimento, e MUST ficar desativado (`disabled`, fora da ordem de foco). Um clique que levaria a um valor fora da lista (inclusive diminuir abaixo do menor valor) MUST NOT chamar `onChange`. Sem a lista, o comportamento é o atual.

#### Scenario: Custo fixo
- **WHEN** um `DotRating` com valor 2 recebe os valores permitidos `[2]`
- **THEN** os dois primeiros pontos aparecem preenchidos, os três restantes tracejados e desativados, e clicar no segundo ponto não altera o valor

#### Scenario: Faixa com mínimo
- **WHEN** um `DotRating` com valor 1 recebe os valores permitidos `[1, 2, 3, 4, 5]` e o usuário clica no primeiro ponto
- **THEN** o valor continua 1

#### Scenario: Faixa parcial
- **WHEN** um `DotRating` com valor 1 recebe os valores permitidos `[1, 2]` e o usuário clica no segundo ponto
- **THEN** o valor passa a 2 e os pontos 3 a 5 aparecem tracejados
