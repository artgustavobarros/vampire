## Why

No celular o painel de descrição (InfoSheet) abre pela direita ocupando 92% da largura, o que espreme o texto e as tabelas numa coluna estreita e alta, longe do polegar. Em telas de até 640px o padrão esperado é um painel que sobe de baixo, com largura total, deixando o texto e as tabelas mais legíveis.

## What Changes

- Em telas com `max-width: 640px`, o painel de descrição passa a abrir **de baixo para cima**, com largura total, altura máxima de 85% da tela visível, rolagem vertical própria, filete superior e cantos retos como o resto do app.
- Acima de 640px o painel continua exatamente como hoje: pela direita, 400px (ou 760px com tabelas), deslizando 24px em 200ms.
- A posição é escolhida no cliente por um hook novo `useMediaQuery`; o componente `Sheet` shadcn não muda.
- O painel continua fechando no ×, com toque fora ou com Esc. Não há gesto de arrastar para fechar e não entra nenhuma dependência nova (sem vaul).
- O menu lateral da ficha não muda.

## Capabilities

### New Capabilities
<!-- nenhuma -->

### Modified Capabilities
- `trait-info`: o requisito "Painel lateral de descrição" passa a definir a variante de tela estreita (≤ 640px) que abre de baixo com largura total.

## Impact

- `web/src/hooks/use-media-query.ts` — hook novo.
- `web/src/features/info/info-sheet.tsx` — `side` e classes de largura/animação dependem da tela.
- `web/src/test/setup.ts` — stub de `window.matchMedia` (o jsdom não tem), padrão desktop.
- Testes: hook novo e variante mobile do InfoSheet.
- Sem mudança de API, de dados nem de dependências; `web/src/components/ui/sheet.tsx` e `sheet-layout.tsx` ficam como estão.
