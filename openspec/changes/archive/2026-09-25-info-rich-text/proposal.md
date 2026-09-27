## Why

Os textos do painel lateral de descrição (aberto pelo `InfoTrigger`) são strings puras: não dá para quebrar linha, nem destacar uma palavra em negrito ou itálico. Descrições longas do catálogo (atributos, clãs, méritos, poderes) viram um bloco único e termos de regra ("Rouse Check", "Força de Vontade") não se destacam do resto.

## What Changes

- Os textos do catálogo exibidos no painel passam a aceitar uma marcação mínima, escrita direto nas strings de `data/*.ts`:
  - `**palavra**` → **negrito**;
  - `*palavra*` → *itálico*;
  - `\n` → quebra de linha; `\n\n` → novo parágrafo.
- A marcação vale para a descrição, o texto de cada nível da lista, a nota e as células de tabela do painel.
- Um componente pequeno de renderização (sem dependência nova, sem `dangerouslySetInnerHTML`) converte a marcação em elementos React.
- Textos sem marcação continuam aparecendo exatamente como hoje.
- O nome acessível e a descrição acessível do diálogo continuam em texto puro (sem os `*`).

## Capabilities

### New Capabilities
<!-- nenhuma -->

### Modified Capabilities
- `trait-info`: novo requisito "Formatação do texto do painel" (negrito, itálico e quebra de linha na descrição, níveis, nota e tabelas).

## Impact

- Novo `web/src/features/info/rich-text.tsx` (parser + componente) e teste.
- `web/src/features/info/info-sheet.tsx`: descrição, níveis, nota e células passam a usar o componente; a descrição deixa de ser um `<p>` único para permitir parágrafos.
- `web/src/features/info/build-info.ts`: `splitRoll` e demais extrações por regex devem continuar funcionando com texto marcado.
- `web/src/data/*.ts`: nenhuma mudança obrigatória; o autor passa a poder usar a marcação.
- Sem dependência nova e sem CSS global.
