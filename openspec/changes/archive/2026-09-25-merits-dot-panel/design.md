## Context

`meritos: Merit[]` (`{ nome, tipo, pontos, origem? }`) é preenchido pelo passo 7 do assistente e pelo Predador, mas a aba Registros ignora esses dados e mostra um `SheetTextArea` "Vantagens & Defeitos" (`LONG_FIELDS` em `data/fields.ts`, chave `vantagens`). As habilidades já têm o padrão desejado em `TraitGrid`: título de grupo com filete, linhas nome + `DotRating`, e nome como `InfoTrigger` que abre o `InfoProvider` (Sheet à direita). O painel de mérito (`meritInfo` em `build-info.ts`) já existe, mas só com escala genérica (`MERIT_SCALE_V` / `MERIT_SCALE_D`).

## Goals / Non-Goals

**Goals:**
- Registros: Princípios e Perdição em duas colunas; painel "Vantagens & Defeitos" com pontos, igual às habilidades.
- Nome do mérito abre o painel lateral com a descrição de cada ponto daquele mérito.
- Remover o campo de texto `vantagens` e tudo que só existia para ele.

**Non-Goals:**
- Adicionar/renomear/remover méritos pela ficha.
- Mudar o passo 7 do assistente ou as cotas de pontos.
- Migrar o texto antigo de `vantagens` para `meritos`.

## Decisions

- **Componente próprio, não `TraitGrid`.** `TraitGrid` indexa por nome (`Record<string, number>`), mas méritos são uma lista que pode repetir nome e cada linha grava num índice. Criar `features/sheet/merits-panel.tsx` que reproduz as mesmas classes de título/linha do `TraitGrid` e usa `DotRating` + `InfoTrigger`. Alternativa (generalizar `TraitGrid` para linhas arbitrárias) mexeria em Ficha e assistente sem ganho.
- **Agrupamento por `effectiveMeritKind`/tipo.** Vantagens = `vantagem | qualidade-sr`; Defeitos = `defeito | defeito-sr`. Guardar o índice original de cada mérito ao filtrar, para o `onChange` atualizar `meritos[i].pontos` via `patchSheet({ meritos: meritos.map(...) })`, preservando `origem` (o desfazer do Predador depende dela).
- **Níveis por mérito no catálogo.** `MeritInfo` passa de `[prefixo, tipo, nome, desc]` para `[prefixo, tipo, nome, desc, niveis]`, com `niveis: readonly string[]` de 5 textos. `meritInfo` usa `hit?.[4] ?? (defeito ? MERIT_SCALE_D : MERIT_SCALE_V)` em `dotLevels`. As entradas duplicadas por grafia (`refúg`/`refug`, `másc`/`masc`, `lacai`/`escrav`) compartilham a mesma constante de níveis para não divergir. Para méritos de custo fixo no livro (ex.: Belíssimo, Estômago de Ferro, Vegano), os níveis fora do custo dizem explicitamente que não existe versão nesse ponto.
- **Layout dos textos longos.** `LONG_FIELDS` fica com dois itens; o grid `autoFit(260)` existente já coloca os dois lado a lado. O painel de méritos entra em seguida com `mb-6`, antes de História.
- **Remoção de `vantagens`.** Sai de `LONG_FIELDS` e de `TextFieldKey`. JSON antigo com a chave continua carregando (o tipo é `Partial`), só não é exibido.

## Risks / Trade-offs

- [Texto antigo em `vantagens` some da tela] → Aceito: os méritos reais vêm de `meritos`; o JSON salvo não é apagado, então dá para recuperar se necessário.
- [Descrições por ponto são texto próprio, não do livro] → Mesmo aviso do cabeçalho de `trait-info.ts` ("Revisar com a mesa").
- [Editar pontos na ficha pode sair das cotas do assistente] → Igual às habilidades na ficha: a ficha não valida cotas.
