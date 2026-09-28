## Why

Quando o Mestre abre a ficha de um jogador, a única pista de que ele está no "modo Mestre" é a palavrinha "MESTRE" ao lado do nome, e voltar para a Lista de personagens ou sair exige abrir o menu. A referência enviada troca isso por uma faixa sangue no topo da ficha, com o contexto e as duas ações sempre à vista. Além disso, a aba Notas é pouco usada na mesa, enquanto os testes que o jogador repete toda sessão (Destreza + Armas de Fogo, Raciocínio + Percepção…) precisam ser remontados de cabeça a cada vez; a aba passa a ser "Rolagens", com paradas de dados salvas que acompanham a ficha.

## What Changes

- **Faixa do Mestre**: na ficha de um jogador aberta pelo Mestre (`/personagens/<userId>/<aba>`), uma faixa sangue acima do cabeçalho mostra "Modo Mestre · <nome do personagem> · Ficha de jogador" e, à direita, o botão contornado "Lista de personagens" e o botão branco "Sair".
- **Cabeçalho da ficha**: o rótulo "MESTRE" ao lado do nome do personagem sai. O cabeçalho fica igual para jogador e Mestre (nome + menu).
- **BREAKING — aba Notas vira Rolagens**: a aba "Notas" (`notas`) é removida e em seu lugar entra "Rolagens" (`rolagens`), na mesma posição do menu. O endereço antigo `notas` redireciona para `rolagens`. O campo de texto livre `notas` sai da ficha no web (o valor já gravado na API não é apagado, só deixa de aparecer).
- **Paradas de dados** (aba Rolagens):
  - título "Paradas de dados" e o texto "Salve os testes que você usa sempre. O total acompanha a ficha quando atributos ou perícias mudam.";
  - botão tinta de largura total "+ Nova parada", que acrescenta uma parada vazia ao fim da lista;
  - cada parada é um cartão com: nome do teste (placeholder "Nome do teste"), quadrado tinta com o total, seleção de Atributo e de Perícia (agrupadas por Físicos/Sociais/Mentais, cada opção com o valor atual, ex. "Vigor · 2"), Modificador com − e +, a fórmula por extenso (ex. "Autocontrole 3 + Armas de Fogo 0") ou "Escolha atributo e perícia", e o botão "Remover";
  - total = atributo + perícia + modificador, recalculado quando a ficha muda;
  - cartões em até 2 por linha; em telas menores, uma coluna;
  - as paradas são gravadas na ficha (salvamento automático) e editáveis pelo jogador e pelo Mestre.

## Capabilities

### New Capabilities

- `dice-pools`: aba Rolagens — paradas de dados salvas (atributo + perícia + modificador) com total que acompanha a ficha.

### Modified Capabilities

- `character-sheet`: o cabeçalho perde o rótulo "MESTRE"; a lista de abas troca Notas por Rolagens (com redirecionamento de `notas`); o requisito "Aba Notas" é removido.
- `dm-mode`: nova faixa do Mestre na ficha de um jogador; o cenário de recarregar a ficha passa a usar a aba Rolagens.

## Impact

- **Web — ficha**: `web/src/features/sheet/sheet-layout.tsx` (faixa do Mestre, sem o rótulo), `tabs.ts` (`notas` → `rolagens`, legado), `tab-content.tsx`; `tabs/notas-tab.tsx` removido e novo `tabs/rolagens-tab.tsx`.
- **Web — dados e regras**: `web/src/lib/types.ts` (tipo `DicePool`, campo `rolagens`, sem `notas`), `web/src/lib/sheet.ts` (padrões/normalização), `web/src/data/fields.ts` (sai a chave `notas`), nova regra pura de total/fórmula em `web/src/rules/`.
- **Testes**: `tabs.test.ts`, `sheet-layout.test.tsx`, `dm-routes.test.tsx` atualizados; novos testes da regra de parada e da aba Rolagens.
- **API**: nenhuma mudança (a ficha é um objeto JSON livre).
