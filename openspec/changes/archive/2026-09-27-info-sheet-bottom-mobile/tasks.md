## 1. Hook de media query

- [x] 1.1 Criar `web/src/hooks/use-media-query.ts` com `useMediaQuery(query)` usando `useSyncExternalStore` (`subscribe` no evento `change` de `matchMedia`, `getSnapshot` = `matches`, `getServerSnapshot` = `false`)
- [x] 1.2 Adicionar stub de `window.matchMedia` em `web/src/test/setup.ts` (`matches: false`, listeners no-op), mantendo os testes atuais em modo desktop
- [x] 1.3 Criar `web/src/hooks/use-media-query.test.ts`: devolve o valor inicial de `matchMedia` e atualiza quando o evento `change` dispara

## 2. InfoSheet responsivo

- [x] 2.1 Em `web/src/features/info/info-sheet.tsx`, ler `useMediaQuery("(max-width: 640px)")` e passar `side={isMobile ? "bottom" : "right"}` ao `SheetContent`
- [x] 2.2 Condicionar a `!isMobile` as classes só da lateral: `w-[400px]`/`w-[760px]`, `max-w-[92vw]`, `sm:max-w-*` e `data-[state=open]:slide-in-from-right-6!`
- [x] 2.3 Na variante de baixo, adicionar `max-h-[85dvh]` e o espaço inferior da área segura (`pb-[calc(1.5rem+env(safe-area-inset-bottom))]`), mantendo cantos retos e sem tocar em `styles.css` nem em `components/ui/sheet.tsx`

## 3. Testes do InfoSheet

- [x] 3.1 Em `web/src/features/info/info-sheet.test.tsx`, com `matchMedia` devolvendo `true`, abrir "Força" e verificar as classes de baixo (`bottom-0`, `border-t`, `max-h-[85dvh]`) e a ausência de `w-[400px]` e `slide-in-from-right-6!`
- [x] 3.2 Com `matchMedia` devolvendo `true`, abrir "Potência de Sangue" e verificar a ausência de `w-[760px]`
- [x] 3.3 Com `matchMedia` devolvendo `true`, verificar que Esc e clique no fundo escurecido fecham o painel
- [x] 3.4 Confirmar que os testes existentes de largura 400px/760px continuam passando no modo desktop padrão

## 4. Verificação

- [x] 4.1 Rodar lint/format (Ultracite) e a suíte do `web` sem falhas
- [ ] 4.2 Conferir no navegador em 640px e 641px de largura: painel de baixo em 640, lateral em 641
