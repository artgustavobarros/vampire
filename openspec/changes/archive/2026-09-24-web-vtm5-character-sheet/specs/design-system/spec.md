## ADDED Requirements

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
