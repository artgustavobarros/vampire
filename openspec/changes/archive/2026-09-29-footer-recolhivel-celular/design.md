## Context

`BottomBar` (`web/src/features/sheet/bottom-bar.tsx`) é uma barra `fixed` no rodapé com a aba "Checagem de sangue" sobre o filete e três blocos (Vitalidade, Fome, Vontade). Abaixo de `sm` (640px) os blocos empilham em coluna, e a página reserva `pb-84` para não ficar escondida atrás da barra. No celular isso consome boa parte da altura útil. O app usa SSR (TanStack Start), e os estilos são classes Tailwind no JSX, sem regras em `styles.css`.

## Goals / Non-Goals

**Goals:**
- Abaixo de 640px, a barra começa recolhida numa linha compacta (VIT x/y · FOME n · VONT x/y · ^).
- Tocar na linha expande a barra no formato atual, sem mudar o layout expandido.
- Uma seta para baixo na barra expandida a recolhe de novo.
- A partir de 640px o comportamento fica igual ao de hoje.

**Non-Goals:**
- Persistir o estado recolhido/expandido (ficha, localStorage ou URL).
- Animar a transição, gesto de arrastar ou fechar ao tocar fora.
- Mudar a barra em telas `sm` ou maiores.

## Decisions

**Breakpoint só com CSS, sem `useMediaQuery`.** O estado `expanded` (useState, começa `false`) decide as classes, e os prefixos `sm:` garantem o formato completo no desktop:
- linha recolhida: `expanded ? "hidden" : "flex"` + `sm:hidden`
- conteúdo completo (aba Checagem + grade): `expanded ? "block" : "hidden"` + `sm:block`
- seta de recolher: visível só com `expanded`, sempre `sm:hidden`

Alternativa: `useMediaQuery("(max-width: 640px)")`, como em `info-sheet.tsx`. Descartada porque no SSR o hook não sabe a largura e causaria um salto de layout na hidratação. Com CSS, o primeiro render já sai certo em qualquer largura.

**Resumo de caixas vazias.** `x` em "VIT x/y" é `trackBoxes(sheet[track], max).filter((m) => m === 0).length`, e `y` é `trackMax`. Assim, com a ficha sem dano, aparece "5/5", como no mockup, e o número cai conforme o dano é marcado. O cálculo fica num helper pequeno dentro de `bottom-bar.tsx`, reutilizando `trackBoxes`/`trackMax` de `#/rules/tracks`.

**A linha recolhida é um único `<button>`.** O botão ocupa toda a largura, com `aria-expanded={false}` e `aria-label="Expandir barra"`. O texto do resumo fica visível dentro dele e a seta é um ícone (`ChevronUpIcon`/`ChevronDownIcon` do `lucide-react`, já usado em `select.tsx`). O alvo de toque grande facilita o uso com o polegar. A seta de recolher é outro botão, com `aria-expanded={true}` e `aria-label="Recolher barra"`, no canto superior direito da área `pt-12`, sem colidir com a aba centralizada.

**Padding da página.** Em `sheet-layout.tsx`, `pb-84 sm:pb-52` passa a `pb-16 sm:pb-52` (ou outro valor medido para a linha recolhida). A barra expandida cobre o conteúdo, o que é aceitável porque o usuário a abriu de propósito e pode recolher.

## Risks / Trade-offs

- [No jsdom as classes `hidden`/`sm:` não têm efeito, então a linha recolhida e os blocos são renderizados juntos, e `getByText("Fome")` pode achar dois elementos] → Os testes consultam por papel/nome (`button` "Expandir barra") e por `aria-expanded`. O resumo usa o rótulo "Fome" dentro do botão, e os testes existentes passam a usar `within` no bloco correto quando houver ambiguidade.
- [Expandida, a barra esconde o fim da página no celular] → É intencional: a seta para baixo recolhe a barra em um toque.
- [Estado não persistido: ao trocar de aba a barra pode voltar a recolher] → `BottomBar` fica no `sheet-layout`, que não remonta ao trocar de aba, então o estado se mantém durante a sessão da ficha.
