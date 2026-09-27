## 1. Renderizador

- [x] 1.1 Criar `web/src/features/info/rich-text.tsx` com o parser (`**` negrito, `*` itálico, `\n` quebra, `\n\n` parágrafo; marcador sem par literal) e os componentes `RichText` (em linha, para níveis/células) e `RichParagraphs` (descrição/nota), usando `<strong className="font-bold">` e `<em className="italic">`
- [x] 1.2 ~~Exportar `plainText(s)`~~ dispensado: a descrição acessível vem do texto do DOM, já sem marcadores (coberto no teste 3.2)
- [x] 1.3 Testes unitários em `rich-text.test.tsx`: negrito, itálico, combinado, quebra de linha, parágrafos, asterisco sem par, texto sem marcação inalterado

## 2. Painel

- [x] 2.1 Em `info-sheet.tsx`, trocar a descrição para `SheetDescription asChild` com `<div>` e `<RichParagraphs>`, mantendo as classes atuais de fonte
- [x] 2.2 Usar `RichText` no texto de cada nível, na nota (com parágrafos) e nas células de tabela (removendo o `whitespace-pre-line` das células)
- [x] 2.3 Conferir que `splitRoll` segue extraindo a rolagem quando a descrição tem marcação fora da frase de rolagem (teste em `build-info.test.ts`)

## 3. Catálogo e verificação

- [x] 3.1 Documentar a marcação no comentário do topo de `web/src/data/trait-info.ts` (e avisar para não marcar a frase "Atributo + Disciplina")
- [x] 3.2 Teste em `info-sheet.test.tsx`: painel com descrição marcada mostra `<strong>`/`<em>`, sem `*` visível, e parágrafos separados
- [x] 3.3 Rodar testes, typecheck e `ultracite check`
