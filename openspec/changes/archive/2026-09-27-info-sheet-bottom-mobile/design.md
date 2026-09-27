## Context

O painel de descrição (`web/src/features/info/info-sheet.tsx`) é um `Sheet` shadcn (Radix Dialog) com `side="right"` fixo, largura de 400px ou 760px (quando há tabelas), `max-w-[92vw]` e um deslize curto sobrescrito com `slide-in-from-right-6!`. Ele é montado uma vez no `InfoProvider` (em `__root.tsx`) e aberto por `useInfo().open(target)`.

O `Sheet` em `web/src/components/ui/sheet.tsx` já suporta `side="bottom"` (`inset-x-0 bottom-0 h-auto border-t` + `slide-in-from-bottom`). O app roda com TanStack Start (SSR). O projeto não tem hook de media query, e o jsdom dos testes não implementa `window.matchMedia`.

## Goals / Non-Goals

**Goals:**
- InfoSheet sobe de baixo em `(max-width: 640px)` e continua lateral acima disso.
- Nenhuma mudança visual ou de comportamento no desktop.
- Testes existentes continuam passando sem ajuste.

**Non-Goals:**
- Arrastar para fechar, pontos de parada ou alça de arrasto (sem vaul).
- Mudar o menu lateral da ficha (`sheet-layout.tsx`) ou o componente `ui/sheet.tsx`.
- Tornar outros diálogos responsivos.

## Decisions

**1. Troca de `side` por JS (`useMediaQuery`), não por variantes CSS.**
`side={isMobile ? "bottom" : "right"}` e as classes de largura/animação escolhidas no `cn()` conforme `isMobile`.
- Alternativa: um `side="responsive"` no `ui/sheet.tsx` com classes `max-sm:`/`sm:`. Descartada por escolha do usuário; além disso exigiria um breakpoint custom para incluir 640px (o `sm:` começa em 640) e cuidar para as animações de eixo X e Y não se somarem.
- O risco típico dessa abordagem (SSR renderizar a variante errada) não aparece aqui: o painel começa fechado e o Radix só monta o conteúdo ao abrir, quando o hook já leu o `matchMedia` no cliente.

**2. Hook com `useSyncExternalStore`.**
`web/src/hooks/use-media-query.ts` exporta `useMediaQuery(query: string): boolean`: `subscribe` registra `change` em `matchMedia(query)`, `getSnapshot` devolve `matchMedia(query).matches`, `getServerSnapshot` devolve `false`.
- Alternativa: a versão do shadcn (`useState` + `useEffect`). Descartada: faz um render extra com valor errado e chama setState dentro de effect; `useSyncExternalStore` é a API do React 19 para estado externo.
- O caminho `#/hooks` já está previsto em `components.json`.

**3. Query `(max-width: 640px)`.**
Inclui 640px exatos no mobile, conforme pedido. As classes do InfoSheet são escolhidas pelo JS, então a sobreposição com o `sm:` do Tailwind (≥ 640px) não gera conflito — basta não usar `sm:` nas classes da variante de baixo, e manter `sm:max-w-[400px]`/`sm:max-w-[760px]` só na lateral.

**4. Classes por variante no InfoSheet.**
- Comuns: `gap-0 overflow-y-auto border-line p-6`, duração 200ms.
- Lateral (`!isMobile`): larguras 400/760, `max-w-[92vw]`, `sm:max-w-*`, `slide-in-from-right-6!` (sem mudança).
- Baixo (`isMobile`): `max-h-[85dvh]` e `pb-[calc(1.5rem+env(safe-area-inset-bottom))]`; largura total e `border-t` já vêm do `side="bottom"`. Cantos retos (o `Sheet` não arredonda). Tudo em classes Tailwind no JSX, nada no `styles.css`.

**5. Stub de `matchMedia` no setup dos testes.**
`web/src/test/setup.ts` define `window.matchMedia` devolvendo `matches: false` com `addEventListener`/`removeEventListener` no-op, ou seja, desktop por padrão. Testes que precisam do mobile sobrescrevem com `vi.spyOn(window, "matchMedia")` ou reatribuem o stub no próprio arquivo.

## Risks / Trade-offs

- [Redimensionar com o painel aberto troca o `side` ao vivo, sem animação coerente] → Aceitável; o hook reage a `change` e o painel se reposiciona. Não vale tratar.
- [Sem gesto de arrastar, usuários de mobile podem tentar puxar o painel para baixo] → O × no topo e o toque no fundo escurecido continuam disponíveis; o gesto pode vir num change futuro.
- [`85dvh` em navegadores antigos] → `dvh` é suportado nos navegadores atuais; o fallback do navegador sem suporte é ignorar a classe, e o `overflow-y-auto` ainda funciona com a altura do conteúdo.
- [Stub global de `matchMedia` esconder erros de uso real] → O teste do hook usa um stub controlado que dispara `change` de verdade.

## Migration Plan

Mudança só de front-end, sem dados. Deploy normal; rollback é reverter o commit.

## Open Questions

Nenhuma.
