## 1. Campos (substituir `.vtm-field`)

- [x] 1.1 Em `web/src/components/ui/input.tsx`, criar e exportar `fieldVariants` (`cva`, base + `state: default | ok`, design decisão 1); `Input` aceita `state` e usa `cn(fieldVariants({ state }), className)`
- [x] 1.2 Em `web/src/components/ui/textarea.tsx`, aceitar `state` e usar `cn(fieldVariants({ state }), "resize-y", className)`
- [x] 1.3 Em `web/src/components/vtm/fields.tsx`, aceitar `state` no `NativeSelect` e usar `fieldVariants`
- [x] 1.4 Confirmar com `grep -rn "vtm-field\|data-ok" web/src` que não sobrou nenhum uso

## 2. Documento e links

- [x] 2.1 Em `web/src/routes/__root.tsx`, aplicar `min-h-full` no `<html>` e `min-h-full overflow-x-hidden bg-paper font-serif text-ink antialiased` no `<body>`
- [x] 2.2 Confirmar que não há `<a>`/`<Link>` dependendo da cor global (hoje só o menu da ficha, que já tem cor própria)

## 3. Cursor em botões

- [x] 3.1 Adicionar `cursor-pointer` à base de `buttonVariants` em `web/src/components/ui/button.tsx`
- [x] 3.2 Adicionar `cursor-pointer` (e `disabled:cursor-not-allowed` onde houver `disabled`) a cada `<button>` nativo e `role="button"` em `components/vtm/*` e `features/**` (constantes como `MENU_ITEM` recebem uma vez)

## 4. Cor de borda explícita

- [x] 4.1 Em `web/src/components/vtm/*`, adicionar `border-line`/`divide-line` a todo `border*`/`divide-*` sem cor na parte fixa da classe
- [x] 4.2 Idem em `web/src/features/wizard/*`
- [x] 4.3 Idem em `web/src/features/sheet/**`
- [x] 4.4 Idem em `web/src/features/auth/*` e `web/src/features/actions/*`
- [x] 4.5 Revisar `web/src/components/ui/{dialog,sheet,select,separator}.tsx` e adicionar cor onde o `border` estiver sem cor
- [x] 4.6 Varredura final: listar strings de classe com `border`/`divide-` sem nenhuma classe de cor e corrigir as restantes

## 5. Limpar CSS global

- [x] 5.1 Remover `@layer base` e `@layer components` de `web/src/styles.css`, mantendo imports, `:root`, `@theme inline` e keyframes

## 6. Verificação

- [x] 6.1 Rodar `npm run typecheck`, `npm run check` e `npm test` em `web/`
- [x] 6.2 Rodar `npm run build` e conferir no CSS gerado que `aria-invalid:` vem depois de `hover:`/`focus:` no campo (ajustar se não)
- [x] 6.3 Revisão visual no navegador: login, os 7 passos do wizard e as abas da ficha (bordas cinza, campos, estados inválido/ok, cursor em botões)
