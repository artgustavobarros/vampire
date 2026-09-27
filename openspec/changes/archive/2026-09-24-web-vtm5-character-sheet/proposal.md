## Why

A ficha de Vampiro: A Máscara V5 existe hoje apenas como um HTML standalone empacotado (`Ficha de Vampiro V5 (offline).html`), gerado por um bundler de protótipo: um único arquivo de ~580 KB com template próprio (`sc-if`/`sc-for`), estilos inline e toda a lógica numa classe de 1.100 linhas. Não dá para evoluir, testar ou versionar esse arquivo com conforto. Precisamos de um projeto web de verdade, que reproduza fielmente o design e o comportamento do standalone e sirva de base para as próximas features.

## What Changes

- Criar a pasta `web/` com um projeto **TanStack Start** (React + TypeScript), **Tailwind CSS v4** e **shadcn/ui**, usando pnpm.
- Traduzir a identidade visual do standalone em tokens de design (papel `#EDEDEB`/`#F4F3F0`, tinta `#0D0D0D`, sangue `#7A1220`, verde `#2F6B3C`, bordas `rgba(13,13,13,.25)`, cantos retos) e nas fontes **Cormorant Garamond** (texto) e **Karla** (rótulos em caixa-alta), aplicados ao tema do shadcn.
- Reimplementar as telas do standalone como rotas e componentes React tipados:
  - Abertura (boot), entrar/criar conta local.
  - Assistente de criação de personagem em 8 passos (clã e geração, atributos, habilidades, especialidades, disciplinas, predador, méritos/defeitos, dados finais).
  - Ficha com abas Ficha, Disciplinas, Ações, Registros, Notas e Sessões & XP, menu lateral, barra fixa inferior (Rouse Check · Fome · Dormir).
  - Diálogos de regras: Rouse Check, Dormir/acordar, cura de dano agravado, Alimentação, Teste de Frenesi, Surto de Sangue, alerta de Fome 5.
- Extrair os dados do jogo (clãs, disciplinas e poderes, predadores, distribuições de habilidades, gerações, tabela de Potência de Sangue) e as regras (vitalidade, Força de Vontade, humanidade/manchas, fome) para módulos TypeScript puros e testados.
- Manter o funcionamento 100% local: contas e fichas persistidas no `localStorage` do navegador (chaves `vtm5.*`). Fichas salvas pelo standalone **não** são migradas nem importadas.
- Levar do standalone só a ficha de exemplo (Vitória Salles, Ventrue), como `web/src/data/example-sheet.json`, carregada ao criar conta quando a opção de dados de exemplo estiver ligada.
- Guardar o standalone original e o código extraído em `design/reference/` como referência de design.

## Capabilities

### New Capabilities
- `design-system`: tokens visuais, tipografia, tema shadcn e componentes base (pontos/dots, caixas de dano, cartões selecionáveis, rótulos) que reproduzem o standalone.
- `local-accounts`: criação de conta, login, sessão e saída, com contas e fichas guardadas apenas no dispositivo.
- `character-wizard`: assistente de criação de personagem em 8 passos com as regras de distribuição de V5.
- `character-sheet`: ficha jogável com abas, edição de traços, disciplinas/poderes, registros, notas e sessões/XP, com salvamento automático.
- `vampire-actions`: ações de regra (Rouse Check, dormir e curar, cura agravada, alimentação por fonte e Potência, frenesi, surto de sangue, marcação de dano e alerta de fome).

### Modified Capabilities
<!-- Nenhuma: não há specs existentes em openspec/specs/. -->

## Impact

- **Código novo**: `web/` inteiro (projeto independente, sem backend). `design/reference/` com o HTML original, o template extraído e `logic.js`.
- **Dependências**: `@tanstack/react-start`, `@tanstack/react-router`, `react`/`react-dom` 19, `tailwindcss` v4, `shadcn` (Radix, `class-variance-authority`, `tailwind-merge`, `lucide-react`), `@fontsource/cormorant-garamond`, `@fontsource/karla`, Vitest + Testing Library, Ultracite (Biome) para lint/format.
- **Dados do usuário**: nenhum dado sai do navegador; fichas existentes do standalone ficam de fora (começa do zero ou pela ficha de exemplo).
- **Não afeta** nenhum sistema existente (o repositório ainda não tem código de aplicação).
