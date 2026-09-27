## Why

No celular e no tablet, a aba Ficha empilha os 9 atributos e as 27 habilidades numa única coluna, e o jogador precisa rolar muito para passar de um bloco ao outro (com Vitalidade e Força de Vontade no meio). Em mesa, isso atrasa a consulta rápida de um traço. Um seletor de abas "Atributos | Habilidades" mostra um bloco por vez e troca com um toque.

## What Changes

- Em telas abaixo de `lg` (1024px — tablet e celular), a aba Ficha substitui os títulos de seção "Atributos" e "Habilidades" por um seletor segmentado com duas abas, "Atributos" (padrão) e "Habilidades", que mostra um bloco por vez.
- Nessas telas, os painéis de Vitalidade e Força de Vontade passam a vir logo abaixo do bloco das abas, em posição fixa, qualquer que seja a aba ativa.
- A partir de `lg`, a ficha continua como hoje: os dois blocos visíveis com seus títulos, Vitalidade/Força de Vontade entre eles e nenhum seletor.
- A aba escolhida vale só enquanto a aba Ficha está aberta; ao voltar para a Ficha, ela abre em "Atributos". Nada é gravado na ficha nem na URL.
- O seletor segue a identidade visual da ficha (cantos retos, rótulo Karla em caixa-alta, aba ativa em fundo branco com texto tinta e inativa em texto suave), com a semântica e o teclado de abas acessíveis.

## Capabilities

### New Capabilities
<!-- nenhuma -->

### Modified Capabilities
- `character-sheet`: nova exigência de layout responsivo na aba Ficha — abas "Atributos | Habilidades" abaixo de `lg`.

## Impact

- `web/src/features/sheet/tabs/ficha-tab.tsx`: reorganiza atributos, habilidades e trilhas dentro das abas, com classes responsivas.
- Novo componente de abas segmentadas em `web/src/components/vtm/` sobre o `Tabs` do pacote `radix-ui` (já instalado; nenhuma dependência nova).
- `TraitGrid`, dados e regras não mudam; o assistente (passos de atributos e habilidades) não muda.
- Testes: componente de abas e aba Ficha (troca de aba, estado padrão).
- Sem mudança de API nem de dados da `Sheet`.
