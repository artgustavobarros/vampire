## 1. Scaffold do projeto

- [x] 1.1 Consultar a documentação atual do TanStack Start (Context7) e gerar o projeto em `web/` com o CLI oficial, pnpm, TypeScript e add-on de Tailwind v4
- [x] 1.2 Inicializar shadcn/ui (`shadcn init`) e adicionar button, input, textarea, select, label, dialog, sheet e separator
- [x] 1.3 Remover rotas, demos e assets de exemplo do starter; deixar `/` renderizando um placeholder
- [x] 1.4 Configurar Ultracite (Biome), Vitest + Testing Library + jsdom e scripts `dev`, `build`, `test`, `check`
- [x] 1.5 Escrever `web/README.md` com o comando de scaffold usado e como rodar localmente (sem deploy)
- [x] 1.6 Confirmar que `pnpm dev`, `pnpm build` e `pnpm test` rodam sem erro

## 2. Design system

- [x] 2.1 Instalar `@fontsource/cormorant-garamond` (400, 400-italic, 600) e `@fontsource/karla` (600) e importá-las na raiz
- [x] 2.2 Definir os tokens do standalone em `src/styles/app.css` e mapear as variáveis do shadcn (`--radius: 0`, primary = tinta, destructive = sangue, foco = borda escura sem anel)
- [x] 2.3 Expor `font-serif`/`font-label` e as cores no `@theme` do Tailwind; aplicar estilos base de `body`, inputs, textarea, select e animações `vfade`/`vpulse`/`vspin`
- [x] 2.4 Criar variantes de botão (primário, contorno, sangue, verde) com `min-h-12` e rótulo Karla em caixa-alta
- [x] 2.5 Criar `Kicker`, `FieldLabel`, `EmptyState` e `SelectableCard`
- [x] 2.6 Criar `DotRating` (clicar no valor atual diminui 1) com testes
- [x] 2.7 Criar `DamageTrack` (ciclo vazio → `/` → `✕`) e `HumanityTrack` (manchas) com testes

## 3. Dados, tipos e regras

- [x] 3.1 Levantar todos os campos da ficha usados em `design/reference/logic.js` e escrever `lib/types.ts` (`Sheet`, `Discipline`, `Power`, `Merit`, `Session`…)
- [x] 3.2 Portar as constantes para `src/data/` como objetos tipados (atributos, habilidades, clãs, disciplinas, poderes, predadores, distribuições, especialidades obrigatórias, gerações, Potência de Sangue, campos biográficos)
- [x] 3.3 Implementar `blank()` e `normalizeSheet()` (completa campos ausentes e descarta disciplinas sem nome)
- [x] 3.4 Criar `src/data/example-sheet.json` com a ficha de exemplo do standalone (Vitória Salles, predador "Extorsionário") e um teste que a valida após `normalizeSheet()`
- [x] 3.5 Implementar regras puras: máximos de trilhas, marcação com transbordo, Potência por geração, humanidade/manchas
- [x] 3.6 Implementar regras puras de ação: Rouse Check, dormir, cura agravada, rendimento da alimentação por fonte e Potência
- [x] 3.7 Implementar cotas do assistente: atributos (4/3/3/3/1) e progresso das distribuições de habilidades
- [x] 3.8 Escrever testes unitários cobrindo os cenários de `vampire-actions` e `character-wizard`

## 4. Persistência e contas locais

- [x] 4.1 Criar `lib/storage.ts` com acesso seguro (try/catch) às chaves `vtm5.accounts`, `vtm5.session`, `vtm5.name.*`, `vtm5.sheet.*`
- [x] 4.2 Criar o store de sessão e ficha (`useSyncExternalStore`) com `patch()` que salva e sinaliza o alerta de Fome em 0 ou 5
- [x] 4.3 Implementar cadastro, login (com atraso de ~420ms e todas as mensagens de erro) e sair; no cadastro, gravar a ficha de exemplo quando `dadosDeExemplo` estiver ligado
- [x] 4.4 Testar o store: normalização, salvamento, alerta de Fome e armazenamento indisponível

## 5. Rotas e telas de entrada

- [x] 5.1 Criar a estrutura de rotas (`/`, `/entrar`, `/criar`, `/ficha`, `/ficha/$aba`) com validação dos search params e guarda de sessão no cliente
- [x] 5.2 Implementar `BootScreen` (mínimo de 600ms) e o redirecionamento conforme sessão e `criada`
- [x] 5.3 Implementar `AuthCard` com os modos entrar/cadastrar conforme o template

## 6. Assistente de criação

- [x] 6.1 Implementar `WizardShell` (título, dica, "Passo N de 8", barra de 8 segmentos, Voltar/Continuar/Concluir) com passo na URL
- [x] 6.2 Passo 1: cartões de clã, Perdição/Compulsão, campos do senhor, seletor de geração com nota de Potência; atributos em 2 ao avançar
- [x] 6.3 Passo 2: atributos com cotas e derivados
- [x] 6.4 Passo 3: distribuições de habilidades e progresso
- [x] 6.5 Passo 4: especialidades obrigatórias ou livre
- [x] 6.6 Passo 5: duas disciplinas, níveis, catálogo de poderes limitado pelo nível e Potência de Sangue
- [x] 6.7 Passo 6: tipos de predador com escolhas de especialidade, disciplina e ajustes
- [x] 6.8 Passo 7: méritos e defeitos com totais e estado vazio
- [x] 6.9 Passo 8: detalhes finais e conclusão (`criada: true`)

## 7. Ficha

- [x] 7.1 Layout da ficha: cabeçalho, gaveta de menu (abas, Refazer personagem, Sair) e barra inferior fixa
- [x] 7.2 Aba Ficha: identificação, atributos, habilidades, Vitalidade, Força de Vontade, Fome, Humanidade e Ressonância
- [x] 7.3 Aba Disciplinas: lista, poderes expansíveis e editáveis, estado vazio e diálogo de adicionar disciplina/poder
- [x] 7.4 Aba Registros: textos longos, História, Convicções/Pilares, painel de Potência de Sangue e biografia
- [x] 7.5 Aba Notas
- [x] 7.6 Aba Sessões & XP (controlada por `mostrarXP`)

## 8. Ações de regra

- [x] 8.1 Criar `RuleDialog` genérico (kicker, título, texto, nota, ações)
- [x] 8.2 Fluxo de Rouse Check (inclui aviso de frenesi) e Surto de Sangue
- [x] 8.3 Fluxo Dormir → Hora de acordar e cura de dano agravado
- [x] 8.4 Fluxo de Alimentação com limites por Potência e escolha de quanto bebeu
- [x] 8.5 Fluxo de Teste de Frenesi
- [x] 8.6 Aba Ações com trilhas e cartões de ação
- [x] 8.7 Alerta de Fome em tela cheia (5 e 0)
- [x] 8.8 Teste de componente do fluxo de alimentação

## 9. Acabamento e verificação

- [x] 9.1 Comparar cada tela lado a lado com `design/reference/ficha-v5-standalone.html` (desktop e 375px) e corrigir desvios
- [x] 9.2 Verificar acessibilidade básica: foco visível, rótulos nos campos, `aria-pressed` nos pontos/cartões, fechamento dos diálogos por Esc
- [x] 9.3 Rodar `pnpm check`, `pnpm test` e `pnpm build` sem erros
