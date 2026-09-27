## Context

`FichaTab` (`web/src/features/sheet/tabs/ficha-tab.tsx`) renderiza, em sequência: identificação, `SectionTitle "Atributos"` + `TraitGrid` de atributos, a grade com `TrackPanel` de Vitalidade e Força de Vontade, `SectionTitle "Habilidades"` + `TraitGrid` de habilidades (com selos de especialidade) e os painéis de Fome, Humanidade e Ressonância. O conteúdo da ficha tem largura máxima de 1000px e as grades usam `auto-fit`, então no celular tudo vira uma coluna longa.

Restrições do projeto: estilo só com classes Tailwind no JSX (nada novo em `styles.css`), tokens existentes (`bg-field`, `text-ink`, `text-ink-soft`, `border-line`, `bg-wash`), cantos retos (`--radius: 0`), rótulos em `font-label` caixa-alta. `radix-ui` já é dependência e fornece `Tabs`.

## Goals / Non-Goals

**Goals:**
- Abaixo de `lg` (1024px), mostrar Atributos e Habilidades como duas abas de um seletor segmentado, um bloco por vez.
- Manter o layout atual idêntico a partir de `lg`.
- Semântica e teclado de abas corretos sem código próprio de acessibilidade.

**Non-Goals:**
- Mudar o assistente (passos 2 e 3 já são telas separadas).
- Guardar a aba escolhida (URL, store ou `localStorage`).
- Mudar `TraitGrid`, dados de traços ou regras.
- Colocar em abas os demais painéis (Fome, Humanidade, Ressonância).

## Decisions

### 1. Radix `Tabs` com `forceMount` e ocultação por CSS
Usar `Tabs.Root`/`List`/`Trigger`/`Content` de `radix-ui`, com `forceMount` nos dois `Content` e a classe `max-lg:data-[state=inactive]:hidden`. Assim os dois blocos ficam sempre no DOM: abaixo de `lg` só o ativo aparece; a partir de `lg` ambos aparecem, e o `TabsList` recebe `lg:hidden`.

- **Por que CSS e não `matchMedia` em JS:** sem hook de mídia, sem flash na primeira renderização e sem duplicar a árvore. Nos testes (jsdom, sem media queries) os dois blocos ficam visíveis, então os testes atuais que buscam traços continuam válidos.
- **Alternativa descartada — renderizar duas árvores (uma com abas e `lg:hidden`, outra sem e `max-lg:hidden`):** duplica cada `DotRating` e `InfoTrigger` no DOM, gera rótulos acessíveis repetidos e dobra o custo de renderização.
- **Alternativa descartada — abas feitas à mão com `useState`:** teria que reimplementar `role`, `aria-selected`, `aria-controls`, roving tabindex e setas, que o Radix já entrega.

Trade-off aceito: a partir de `lg` os blocos continuam com `role="tabpanel"` e `aria-labelledby` apontando para abas ocultas. Para evitar isso, os `Content` usam `aria-labelledby` explícito para o `SectionTitle` visível (que ganha `id`), e o `SectionTitle` tem `max-lg:hidden`; o `tablist` oculto por `display:none` sai da árvore de acessibilidade.

### 2. Componente `SegmentedTabs` em `components/vtm/`
Um wrapper pequeno (`segmented-tabs.tsx`) exporta `SegmentedTabs` (Root), `SegmentedTabsList`, `SegmentedTabsTrigger` e `SegmentedTabsContent`, com as classes da ficha já aplicadas e `className` mesclado por `cn`. Visual, inspirado na referência (sem os cantos arredondados, por causa do design system):

- Lista: `grid grid-cols-2 gap-1 border border-line bg-wash p-1`.
- Aba: `min-h-11 cursor-pointer font-label font-semibold text-xs uppercase leading-none tracking-[.12em] text-ink-soft`, ativa com `data-[state=active]:bg-field data-[state=active]:text-ink data-[state=active]:shadow-sm`, foco com `focus-visible:outline-2 focus-visible:outline-ink`.

Alternativa descartada: gerar `components/ui/tabs.tsx` pelo shadcn — traz estilos padrão (arredondados, `bg-muted`) que teriam de ser todos sobrescritos; o wrapper em `vtm/` segue o padrão de `selectable.tsx` e `text.tsx`.

### 3. Ordem de Vitalidade/Força de Vontade por `order` responsivo
Estrutura dentro de `SegmentedTabs` (um contêiner `flex flex-col`):

```
TabsList            (lg:hidden)
Content "atributos" (lg:order-1)  → SectionTitle + TraitGrid
Content "habilidades" (lg:order-3) → SectionTitle + TraitGrid
Trilhas              (lg:order-2)  → TrackPanel Vit + FdV
```

A ordem do DOM segue o celular (abas → bloco → trilhas), que é o uso principal da ficha em mesa; o desktop reordena só visualmente com `lg:order-*`, recolocando as trilhas entre os blocos como hoje. Os `mb-8` atuais viram `gap-8` no contêiner flex para o espaçamento não depender da ordem.

Alternativa descartada: manter as trilhas entre os dois `Content` no DOM — no celular elas pulariam de posição (abaixo dos atributos, acima das habilidades) ao trocar de aba.

### 4. Estado não controlado
`defaultValue="atributos"` no Root, sem estado externo. Como a rota da aba desmonta `FichaTab` ao sair, voltar para a Ficha reabre em "Atributos", como pede a spec.

## Risks / Trade-offs

- [Diferença entre ordem do DOM e ordem visual a partir de `lg`: quem navega por Tab passa por Habilidades antes das trilhas] → Aceitável: são blocos independentes, e o desktop não é o uso principal; se incomodar, dá para inverter e aplicar `order` no celular.
- [`forceMount` mantém as 27 habilidades montadas mesmo ocultas] → É o mesmo custo de hoje (tudo já está montado).
- [Breakpoint `lg` (1024px) coloca tablets em paisagem de 1024px já no layout desktop] → Coerente com "tablet para baixo" (768–1023px); ajustar o prefixo depois é trocar `lg` por `xl` nas classes.

## Open Questions

- Nenhuma que bloqueie; o visual final do seletor pode ser ajustado na revisão da implementação.
