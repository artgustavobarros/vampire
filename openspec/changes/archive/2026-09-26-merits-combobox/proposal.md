## Why

O Passo 7 ainda é um formulário de texto livre: o jogador clica em "Adicionar", alterna o tipo num selo, digita o nome com ajuda de um `<datalist>` e marca os pontos à mão. Agora que o catálogo canônico (`web/src/data/merits.ts`) existe e os nomes abrem o painel de informações como links (`InfoTrigger`), dá para trocar a digitação por uma escolha direta no catálogo: o tipo, a categoria e a faixa de pontos passam a vir dos dados, e a descrição fica a um clique do nome.

## What Changes

- **Combobox de busca no Passo 7**: abas "Todos", "Vantagens" e "Defeitos" acima de um campo "Buscar vantagem ou defeito…" com a contagem "N opções". Ao focar, abre uma lista agrupada por categoria (cabeçalho fixo, ex.: "ANTECEDENTES"); cada opção mostra nome, faixa de pontos em pontinhos (ex.: "•–•••••"), a marca "Na ficha" quando já foi escolhida, o selo do tipo (Vantagem em Moss, Defeito em Blood) e uma linha de descrição. Navegação por teclado (setas, Enter, Esc) no padrão ARIA combobox.
- **Lista de escolhidos**: cada linha mostra o selo do tipo, o nome como link que abre o painel de informações, a legenda "<Categoria> · <faixa>", um `DotRating` que só aceita os valores permitidos pelo catálogo (pontos fora da faixa ficam tracejados e desativados) e "Remover".
- **Escolha pelo catálogo**: selecionar uma opção acrescenta a linha com o tipo do catálogo e os pontos mínimos da faixa (ou o custo fixo). Uma opção que já está na ficha não é duplicada.
- **Entradas fora do catálogo**: quando a busca não bate com nenhum nome, o rodapé oferece "Adicionar “texto” como vantagem" e "… como defeito". Linhas fora do catálogo (novas ou de fichas antigas) continuam com o selo alternável e pontos de 1 a 5.
- **Sangue Fraco**: Qualidades SR entram na aba "Vantagens" e Defeitos SR na aba "Defeitos", no grupo "Sangue-ralo"; para outros clãs essas opções não aparecem.
- **Removidos**: o botão "Adicionar", os `<datalist>` por tipo, o campo de nome editável, o botão **?** das linhas (substituído pelo nome-link) e o autopreenchimento por digitação.
- **`DotRating`**: nova prop opcional com os valores permitidos; pontos fora dela são desenhados tracejados e não clicáveis.

## Capabilities

### New Capabilities
<!-- nenhuma -->

### Modified Capabilities
- `character-wizard`: o requisito "Passo 7 — Vantagens e defeitos" passa a descrever o combobox, a lista de escolhidos e as entradas fora do catálogo no lugar das linhas de texto livre.
- `v5-merits-catalog`: o requisito "Sugestões e preenchimento de pontos no Assistente" troca o `<datalist>` por tipo pela escolha no combobox e define a faixa de pontos permitida por item.
- `design-system`: o `DotRating` ganha valores permitidos, com pontos fora da faixa tracejados e desativados.

## Impact

- `web/src/features/wizard/step7-merits.tsx`: reescrito em torno do combobox e da lista de escolhidos.
- Novo componente de combobox em `web/src/features/wizard/` (sem dependência nova; ARIA feito à mão sobre `Input`).
- `web/src/data/merits.ts`: helpers para faixa de pontos, rótulo de categoria e opções por clã; `getMeritSuggestions` deixa de ser usado pelo passo.
- `web/src/components/vtm/dot-rating.tsx`: prop de valores permitidos.
- `web/src/features/wizard/wizard.test.tsx` e `web/src/components/vtm/components.test.tsx`: testes do Passo 7 e do `DotRating` atualizados.
- Formato de `meritos` na ficha não muda (`nome`, `pontos`, `tipo`, `origem`); fichas existentes continuam válidas.
