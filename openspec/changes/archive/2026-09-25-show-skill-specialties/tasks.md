## 1. Regra

- [x] 1.1 Criar `web/src/rules/specialties.ts` com `specialtiesBySkill(sheet)` juntando `espec` (sem vazios) e `predEspec` interpretado como "Habilidade (Especialidade)", sem duplicar
- [x] 1.2 Cobrir em `rules/rules.test.ts`: só `espec`, só `predEspec`, duplicado, vazio e `predEspec` fora do formato

## 2. Componente

- [x] 2.1 Adicionar a prop opcional `specialties` ao `TraitGrid`: com itens, selos numa linha (`flex-row flex-wrap`) abaixo do nome e pontos alinhados ao topo; sem itens, markup atual
- [x] 2.2 Renderizar cada especialidade como selo só de leitura com classes Tailwind no JSX (sem `styles.css`)
- [x] 2.3 Teste em `components/vtm/components.test.tsx`: selos aparecem abaixo do nome e ausentes quando não há especialidades

## 3. Ficha

- [x] 3.1 Em `ficha-tab.tsx`, passar `specialtiesBySkill(sheet)` ao grid de Habilidades
- [x] 3.2 Rodar testes e lint (`ultracite check`) e conferir visualmente contra o layout de referência (Persuasão com Negociação e Sedução)
