## 1. Renomear a aba

- [x] 1.1 Em `web/src/features/sheet/tabs.ts`, trocar `{ id: "registros", label: "Registros" }` por `{ id: "resumo", label: "Resumo" }`, mantendo a posição entre "Ações" e "Notas"
- [x] 1.2 Adicionar em `tabs.ts` o alias de id legado (`registros` → `resumo`) e uma função para resolvê-lo
- [x] 1.3 Renomear `tabs/registros-tab.tsx` para `tabs/resumo-tab.tsx` e `RegistrosTab` para `ResumoTab`; atualizar import e `case "resumo"` em `tab-content.tsx`
- [x] 1.4 Em `routes/ficha.$aba.tsx`, redirecionar `/ficha/registros` para `/ficha/resumo` com `replace`, antes do fallback para `/ficha/ficha`

## 2. Mover o painel de identificação

- [x] 2.1 Remover de `tabs/ficha-tab.tsx` o `Panel` com `IDENTITY_FIELDS` e os imports que ficarem sem uso (`IDENTITY_FIELDS`, `SheetTextField` se for o caso)
- [x] 2.2 Inserir o mesmo `Panel` (classes Tailwind, `autoFit(220)`, placeholders removidos) como primeiro bloco de `ResumoTab`, antes dos `LONG_FIELDS`

## 3. Testes e verificação

- [x] 3.1 Em `tabs/ficha-tab.test.tsx`, cobrir que a aba Ficha não mostra os campos "Nome" e "Clã"
- [x] 3.2 Criar `tabs/resumo-tab.test.tsx` cobrindo: painel de identificação antes de "Princípios da Crônica" com os 9 campos, e edição do Nome gravando `nome` na ficha
- [x] 3.3 Cobrir `tabs.ts`: "Resumo" nas abas visíveis, `registros` não é aba válida e o alias resolve para `resumo`
- [x] 3.4 Buscar e atualizar referências restantes a "Registros"/`registros` no `web/src` (exceto textos de dados sem relação com a aba)
- [ ] 3.5 Rodar lint (Ultracite/Biome), typecheck e `vitest` do `web` e conferir no navegador `/ficha/resumo`, `/ficha/registros` e a aba Ficha no celular e no desktop
