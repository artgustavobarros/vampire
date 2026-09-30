## 1. Barra recolhível

- [x] 1.1 Em `bottom-bar.tsx`, adicionar estado `expanded` (useState, inicia `false`)
- [x] 1.2 Criar helper de resumo da trilha: caixas vazias (`trackBoxes(...).filter((m) => m === 0).length`) e máximo (`trackMax`)
- [x] 1.3 Criar a linha recolhida: um único `<button>` de largura total com `aria-expanded={false}`, `aria-label="Expandir barra"`, mostrando "VIT x/y", "FOME n" (cor brasa) e "VONT x/y" centralizados e `ChevronUpIcon` à direita; classes `expanded ? "hidden" : "flex"` + `sm:hidden`
- [x] 1.4 Envolver a aba "Checagem de sangue" e a grade dos três blocos em um contêiner com `expanded ? "block" : "hidden"` + `sm:block`, sem mudar o layout expandido atual
- [x] 1.5 Ajustar o padding da barra para que, recolhida, ela tenha só a altura da linha (o `pt-12` vale apenas no estado expandido e em `sm:`)
- [x] 1.6 Adicionar o botão de recolher (`ChevronDownIcon`, `aria-expanded={true}`, `aria-label="Recolher barra"`) no canto superior direito, visível só quando `expanded`, sempre `sm:hidden`

## 2. Layout da página

- [x] 2.1 Em `sheet-layout.tsx`, trocar `pb-84` pelo espaço da barra recolhida (ex.: `pb-16`), mantendo `sm:pb-52`

## 3. Testes

- [x] 3.1 Atualizar `bottom-bar.test.tsx` para evitar ambiguidade entre o resumo e os blocos (usar `within` / consultas por papel)
- [x] 3.2 Testar o resumo: ficha sem dano mostra "5/5" para VIT e VONT e a Fome atual; com 1 superficial + 1 agravado na Vitalidade, mostra "3/5"
- [x] 3.3 Testar a alternância: clicar em "Expandir barra" leva a `aria-expanded` true e mostra "Recolher barra"; clicar em "Recolher barra" volta ao estado recolhido
- [x] 3.4 Rodar lint (ultracite) e testes do web

## 4. Verificação visual

- [x] 4.1 Conferir no navegador em 390px (recolhida → expandida → recolhida) e em 1024px (sempre completa, sem setas)
