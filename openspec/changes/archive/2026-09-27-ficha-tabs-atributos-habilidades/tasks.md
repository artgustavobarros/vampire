## 1. Componente de abas segmentadas

- [x] 1.1 Criar `web/src/components/vtm/segmented-tabs.tsx` sobre `Tabs` de `radix-ui`, exportando `SegmentedTabs`, `SegmentedTabsList`, `SegmentedTabsTrigger` e `SegmentedTabsContent`, com as classes Tailwind do design (lista `grid-cols-2` em `bg-wash` com borda, aba ativa `bg-field text-ink`, inativa `text-ink-soft`, cantos retos, foco visível) e `className` mesclado via `cn`
- [x] 1.2 Adicionar em `components.test.tsx` testes do componente: aba padrão ativa (`aria-selected`), clique troca o painel ativo, seta para a direita move foco e ativa a próxima aba

## 2. Aba Ficha

- [x] 2.1 Em `ficha-tab.tsx`, envolver atributos, habilidades e trilhas num `SegmentedTabs` (`defaultValue="atributos"`, contêiner `flex flex-col gap-8`) com `SegmentedTabsList` `lg:hidden` e as abas "Atributos" e "Habilidades"
- [x] 2.2 Colocar `SectionTitle` + `TraitGrid` de cada bloco num `SegmentedTabsContent` com `forceMount`, `max-lg:data-[state=inactive]:hidden`, `aria-labelledby` apontando para o `id` do `SectionTitle`, e `SectionTitle` com `max-lg:hidden`
- [x] 2.3 Posicionar as trilhas de Vitalidade e Força de Vontade depois dos dois blocos no DOM e aplicar `lg:order-1` (atributos), `lg:order-2` (trilhas) e `lg:order-3` (habilidades); trocar os `mb-8` internos pelo `gap` do contêiner
- [x] 2.4 Criar teste da aba Ficha: "Atributos" ativo por padrão, clicar em "Habilidades" ativa o painel de habilidades e editar um ponto de habilidade grava em `skills` sem mudar `attrs`

## 3. Verificação

- [x] 3.1 Rodar lint (Ultracite/Biome), typecheck e a suíte de testes do `web`
- [x] 3.2 Conferir no navegador em 390px, 768px e 1280px: abas e posição das trilhas no celular/tablet, layout atual sem seletor no desktop, e troca de aba pelo teclado
