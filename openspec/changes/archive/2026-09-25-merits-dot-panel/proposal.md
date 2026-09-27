## Why

As vantagens e os defeitos escolhidos no assistente (passo 7 e os do Predador) ficam gravados em `meritos`, mas a aba Registros só mostra um campo de texto livre "Vantagens & Defeitos" que não tem relação com esses dados. Na mesa o jogador precisa ver o que tem e quantos pontos, e saber o que cada ponto do mérito significa, do mesmo jeito que já acontece com as habilidades.

## What Changes

- **Aba Registros · layout**: "Princípios da Crônica" e "Perdição do Clã" ficam lado a lado em duas colunas; logo abaixo, um painel de largura total "Vantagens & Defeitos".
- **Painel Vantagens & Defeitos**: duas colunas, "Vantagens" (vantagem e Qualidade SR) e "Defeitos" (defeito e Defeito SR), no mesmo estilo do grid de habilidades: título do grupo com filete, uma linha por mérito com o nome à esquerda e 5 pontos à direita. Coluna vazia mostra "Nenhuma vantagem." / "Nenhum defeito.". Linhas sem nome não aparecem.
- **Pontos editáveis**: clicar nos pontos muda `pontos` do mérito na ficha, como nas habilidades.
- **Nome abre o painel lateral**: o nome do mérito é um gatilho de texto (sem sublinhado, Blood no hover) que abre o painel de descrição à direita.
- **Descrição por ponto**: o painel de mérito lista os 5 níveis com o texto próprio de cada ponto daquele mérito (ex.: Recursos •, ••, … •••••), com o nível atual destacado. Méritos fora do catálogo continuam com a escala genérica de vantagem/defeito.
- **BREAKING (dados)**: o campo de texto `vantagens` sai da ficha (`LONG_FIELDS` e `TextFieldKey`). O texto antigo que já estiver salvo deixa de aparecer.
- Fora do escopo: adicionar, renomear ou remover méritos pela ficha (continua no assistente); o passo 7 do assistente não muda.

## Capabilities

### New Capabilities
<!-- nenhuma -->

### Modified Capabilities
- `character-sheet`: a aba Registros troca o texto livre de Vantagens & Defeitos por um painel com pontos a partir de `meritos`, e Princípios/Perdição passam a ficar em duas colunas.
- `trait-info`: o painel de Vantagem/Defeito passa a usar descrições por ponto de cada mérito do catálogo, e o nome do mérito na aba Registros vira gatilho do painel.

## Impact

- Dados: `data/trait-info.ts` — `MERIT_INFO` ganha os 5 textos por ponto de cada mérito; `data/fields.ts` perde `vantagens`.
- Info: `features/info/build-info.ts` (`meritInfo`) usa os níveis do catálogo com fallback para `MERIT_SCALE_V`/`MERIT_SCALE_D`.
- Componentes: novo painel de méritos (ex.: `features/sheet/merits-panel.tsx`) usado em `features/sheet/tabs/registros-tab.tsx`; reaproveita `DotRating` e `InfoTrigger`.
- Tipos: `lib/types.ts` via `TextFieldKey` (sem `vantagens`); formato de `meritos` não muda.
