## Context

O ponto de partida é `Ficha de Vampiro V5 (offline).html`, um arquivo gerado por um bundler de protótipo. Descompactado, ele contém:

- React 18 via UMD e um runtime próprio (`x-dc`) que liga um template HTML com `sc-if`/`sc-for`/`{{ }}` a uma classe `Component extends DCLogic`.
- O template (`design/reference/template.html`) com todos os estilos inline: é a **fonte de verdade do design**.
- A lógica (`design/reference/logic.js`, ~1.100 linhas): constantes do jogo (`ATTRS`, `SKILLS`, `CLANS`, `DISCS`, `POWERS`, `PREDADORES`, `DIST`, `ESPEC_OBRIG`, `GERACOES`, `BP`, `BIOF`), estado de UI, regras e um `renderVals()` gigante que monta os valores do template.
- 12 arquivos woff2 (Cormorant Garamond e Karla) e as props de configuração `mostrarXP`, `curaAoDormir`, `avisoFrenesi`, `dadosDeExemplo`.

Tudo roda no navegador; a persistência é `localStorage` com chaves `vtm5.*`. Não há backend nem código de aplicação no repositório; o `openspec/` é o único conteúdo.

## Goals / Non-Goals

**Goals:**
- Projeto `web/` com TanStack Start + React 19 + TypeScript estrito + Tailwind v4 + shadcn/ui, gerenciado com pnpm.
- Paridade visual e funcional com o standalone (mesmas telas, textos em pt-BR, regras e fluxos).
- Separar dados do jogo, regras puras, persistência e UI, com testes nas regras.
- Trazer do standalone apenas a ficha de exemplo, como JSON versionado.

**Non-Goals:**
- Autenticação real, backend, sincronização entre dispositivos ou multiusuário.
- Rolagem de dados automática (o standalone só registra resultados informados pelo jogador).
- Internacionalização além de pt-BR, modo escuro, PWA/instalação offline (podem vir depois).
- Redesenhar a interface: o objetivo é reproduzir o standalone, não reinterpretá-lo.
- Migrar, importar ou exportar fichas salvas pelo standalone.
- Criptografar ou fazer hash das senhas locais (fica para uma mudança futura).
- Deploy/publicação: nesta mudança o app roda só localmente (`pnpm dev` / `pnpm build` + `pnpm preview`).

## Decisions

### 1. Scaffold pelo CLI oficial do TanStack Start, dentro de `web/`
Gerar o projeto com o criador oficial (`pnpm create @tanstack/start@latest web`, ou o CLI `@tanstack/cli` equivalente disponível no momento), escolhendo Tailwind e shadcn como add-ons, e depois rodar `pnpm dlx shadcn@latest init`/`add` para os componentes. Remover as rotas e demos de exemplo.
- *Alternativa:* Vite + TanStack Router puro (SPA). Descartada porque o pedido é explicitamente o starter do TanStack Start; o Start também deixa aberta a porta para server functions no futuro.

### 2. App client-only apesar do SSR do Start
Toda a leitura de `localStorage` acontece no cliente. A rota raiz renderiza a tela de abertura no servidor e no primeiro render do cliente; a sessão é restaurada num efeito após a hidratação (a abertura de 600ms do standalone esconde isso naturalmente). Componentes que dependem da ficha não leem armazenamento durante o render.
- *Alternativa:* desligar SSR (`ssr: false` nas rotas). Mantida como plano B se aparecerem problemas de hidratação; SSR da casca ainda ajuda no primeiro paint.

### 3. Rotas
```
/                 → redireciona conforme sessão (abertura enquanto decide)
/entrar           → login / cadastro (search param ?modo=cadastro)
/criar            → assistente; ?passo=1..8 (validado com schema)
/ficha            → layout da ficha (cabeçalho, menu, barra inferior, diálogos)
/ficha/$aba       → ficha | disciplinas | acoes | registros | notas | sessoes
```
Rotas protegidas verificam a sessão no cliente e redirecionam para `/entrar`. A aba e o passo ficam na URL (recarregar mantém o lugar), diferente do standalone, que guardava só em memória.
- *Alternativa:* uma rota com máquina de estados de telas, como no standalone. Descartada: perde histórico do navegador e links diretos.

### 4. Estado: store da ficha com `useSyncExternalStore`, sem biblioteca extra
Um módulo `lib/storage` encapsula `localStorage` (try/catch em tudo) e um pequeno store (`sessionStore`, `sheetStore`) com `subscribe/getSnapshot`, exposto por hooks `useSession()`, `useSheet()` e `usePatchSheet()`. `patch()` mescla, grava e dispara o alerta de Fome quando ela muda para 0 ou 5, como o `patch` original. Estado efêmero de UI (menu, diálogo aberto, estágio do diálogo) fica em `useState`/contexto local.
- *Alternativas:* Zustand (boa, mas uma dependência a mais para um único documento) e TanStack Query (feito para estado de servidor, não para um documento local). Podem entrar depois se houver backend.

### 5. Organização do código
```
web/src/
  data/        clans.ts, disciplines.ts (POWERS), predators.ts, traits.ts,
               distributions.ts, generations.ts, blood-potency.ts, bio-fields.ts
  rules/       tracks.ts (máximos, marcar, transbordo), sleep.ts, feeding.ts,
               aggravated.ts, rouse.ts, generation.ts, wizard-quotas.ts, humanity.ts
  lib/         storage.ts, sheet-store.ts, types.ts (Sheet, Discipline, Power…), settings.ts
  components/
    ui/        shadcn (button, input, textarea, select, dialog, sheet, label, separator)
    vtm/       DotRating, DamageTrack, HumanityTrack, SelectableCard, Kicker,
               FieldLabel, EmptyState, BloodPotencyDots
  features/
    auth/      BootScreen, AuthCard
    wizard/    WizardShell + Step1Clan … Step8Final
    sheet/     SheetHeader, SheetMenu, BottomBar, tabs/*
    actions/   RuleDialog + fluxos rouse, sleep, agg, feed, frenzy, HungerAlert
  routes/      arquivos do TanStack Router conforme a seção 3
```
Os dados são portados literalmente de `logic.js` para objetos tipados (tuplas viram objetos nomeados, ex.: `{ name, disciplines, bane, baneText, compulsion, compulsionText }`). As regras recebem e devolvem `Sheet` imutável; a UI só chama regras e `patch`.

### 6. Design: tokens em CSS, shadcn tematizado, estilos inline viram utilitários
- `src/styles/app.css` define os tokens em `:root` (`--paper`, `--surface`, `--ink`, `--ink-soft`, `--line`, `--line-soft`, `--blood`, `--moss`) e mapeia as variáveis do shadcn (`--background`, `--card`, `--primary` = tinta, `--destructive` = sangue, `--border`, `--ring`, `--radius: 0`). O `@theme` do Tailwind v4 expõe `font-serif` (Cormorant Garamond) e `font-label` (Karla).
- Os padrões repetidos do template viram componentes ou variantes `cva`: rótulo Karla 12px caixa-alta, botão primário/contorno/sangue com `min-h-12`, cartão `bg-surface border border-line`.
- Fontes via `@fontsource/cormorant-garamond` (400, 400-italic, 600) e `@fontsource/karla` (600), empacotadas pelo Vite: nada depende do Google Fonts.
- Diálogos de regra usam `Dialog` do shadcn; o menu usa `Sheet` (gaveta à direita, 280px); o alerta de Fome é um `Dialog` em tela cheia.
- Sempre consultar `design/reference/template.html` para medidas exatas; a comparação lado a lado com o standalone é o critério de aceite visual.

### 7. Formato da ficha e ficha de exemplo
`types.ts` descreve o formato da ficha herdado do standalone, incluindo os campos que ele cria sob demanda (`manchasIdx`, `ressonancia`, `resIntensidade`, `espec`, `dist`, `predador`, `predEspec`, `predDisc`, `meritos`, identificação e biografia). O levantamento exato sai de uma varredura de `s.<campo>` em `logic.js`. `normalizeSheet()` faz `Object.assign(blank(), raw)` e descarta disciplinas sem nome, protegendo contra JSON incompleto no `localStorage`. As chaves `vtm5.*` são mantidas só por conveniência; não há migração de fichas antigas.

A única ficha trazida do standalone é a de exemplo (`dadosDeExemplo`): `src/data/example-sheet.json` com `nome: "Vitória Salles"`, `conceito: "Advogada da noite"`, `cla: "Ventrue"`, `predador: "Extorsionário"`, `geracao: "12ª"` e `criada: false`, o que abre o assistente já preenchido. O original gravava `"Extorsionária"`, que não casa com nenhum tipo de predador; o JSON usa o nome do catálogo. O arquivo é validado por um teste contra o tipo `Sheet` depois de `normalizeSheet()`.

### 8. Configurações do standalone
As props `mostrarXP`, `curaAoDormir`, `avisoFrenesi` e `dadosDeExemplo` viram constantes em `lib/settings.ts` com os mesmos padrões (`true`, `true`, `true`, `false`). Com `dadosDeExemplo` ligado, o cadastro grava a ficha de exemplo para a conta nova.

### 9. Qualidade
TypeScript `strict`, Ultracite (Biome) para lint/format, Vitest para `rules/` e `lib/`, e Testing Library para `DotRating`, `DamageTrack` e o fluxo de alimentação. Os cenários dos specs são a base dos testes.

### 10. Desvios registrados na implementação
- Tokens e tema ficam em `src/styles.css` (caminho que o `components.json` do shadcn já usa), não em `src/styles/app.css`.
- Surto de Sangue: o standalone mostrava "undefined" (lia `BP[n][0]` de um objeto). Aqui usa `bloodSurge` da Potência atual.
- Vantagens e defeitos (passo 7): o standalone não tinha lógica para esse passo. Implementado como `meritos: { tipo, nome, pontos }[]`.
- "Voltar" no passo 1 sem ficha criada encerra a sessão antes de ir para a entrada; o standalone só trocava de tela e a sessão continuava gravada.
- Regras `noJsxPropsBind` e `noArrayIndexKey` do Ultracite desligadas: handlers inline são o padrão aqui e as linhas da ficha são posicionais, sem id.

## Risks / Trade-offs

- [Senhas em texto puro no `localStorage`, herdadas do standalone] → Aceito por decisão do usuário nesta fase; o texto da tela de entrada avisa que tudo fica só neste dispositivo. O acesso às senhas fica isolado em `lib/storage.ts` para que o hash entre depois sem mexer nas telas.
- [Hidratação SSR × dados só no cliente] → Nunca ler armazenamento durante o render; abertura cobre o intervalo; plano B com `ssr: false`.
- [Desvio visual ao trocar estilos inline por utilitários e shadcn] → Tokens exatos, `--radius: 0`, sobrescrever o foco/anel padrão do shadcn para a borda do standalone, e comparar telas lado a lado antes de concluir.
- [CLI do TanStack Start muda com frequência] → Consultar a documentação atual (Context7) ao scaffoldar e registrar o comando usado no README de `web/`.
- [Porte literal de ~70 KB de lógica pode carregar bugs do original] → Testes derivados dos cenários; divergências intencionais ficam registradas.

## Migration Plan

Não há produção. O standalone continua funcionando de forma independente e fica guardado em `design/reference/`. Fichas feitas nele não passam para o app novo. Reverter = apagar `web/`.

## Open Questions

Nenhuma no momento. Decidido: senhas sem criptografia por enquanto (resolver numa mudança futura) e execução só local, sem deploy.
