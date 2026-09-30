## Why

Numa falha bestial, o Mestre precisa sortear a compulsão do vampiro. Hoje a aba Ações só tem a Rolagem de Ressonância e o Gerador de NPC, então ele rola o d10 fora do app e consulta a tabela e a compulsão do clã no livro. Um segundo cartão de rolagem, no mesmo formato do de Ressonância, deixa a consulta dentro da mesa.

## What Changes

- **Rolagem de Compulsão (Mestre, aba Ações)**: novo painel "Rolagem de Compulsão" logo abaixo da Rolagem de Ressonância, com o mesmo formato de duas colunas: à esquerda, o painel de escolha; à direita, "Limpar" e o cartão escuro do resultado.
  - O painel tem o grupo de selos "Clã", com "Não informado" e os clãs de `data/clans.ts`, o botão "Rolar compulsão" e a nota com a tabela do d10.
  - Tabela em d10: 1–3 Fome, 4–5 Dominância, 6–7 Dano, 8–9 Paranoia, 10 Compulsão de Clã.
  - No 10 com um clã escolhido, o cartão mostra a compulsão desse clã (nome e texto de `data/clans.ts`). Com "Não informado", mostra "Compulsão de Clã" e manda usar a do clã do personagem. Caitiff e Sangue-ralo não têm compulsão de clã, então o 10 é rolado de novo até sair outro número.
  - O cartão mostra o nome da compulsão, o efeito (−2 dados no que não for para satisfazê-la), quando ela termina e a linha dos dados ("Compulsão d10: 4", ou "10, 6" quando rolou de novo).
  - O resultado vive só na visita, como na Ressonância.
- **Layout da aba Ações**: a ordem passa a ser Rolagem de Ressonância, Rolagem de Compulsão, Gerador de NPC.

## Capabilities

### New Capabilities

- `dm-compulsion-roll`: painel Rolagem de Compulsão na aba Ações do Mestre. Cobre o seletor de clã, a tabela do d10, a regra do 10 para clãs sem compulsão, o cartão de resultado, "Limpar" e os textos das compulsões gerais.

### Modified Capabilities

- `dm-resonance-roll`: o requisito "Layout da aba Ações" passa a colocar a Rolagem de Compulsão entre a Rolagem de Ressonância e o Gerador de NPC.

## Impact

- **Web**:
  - novo `data/compulsions.ts`, com as quatro compulsões gerais (nome, efeito e quando termina);
  - novo `rules/compulsion.ts`: função pura `rollCompulsion(clan, d)` que reaproveita o tipo `Die` e o `rollDie` de `rules/resonance.ts`, mais `compulsionDiceLine`;
  - novo `features/dm/compulsion-roll.tsx`, que reaproveita `ChipGroup` de `resonance-parts.tsx`, `Button` e o estilo do cartão de resultado;
  - `features/dm/resonance-roll.tsx` passa a renderizar `<CompulsionRoll d={d} />` antes de `<NpcGenerator d={d} />`;
  - testes em `rules/compulsion.test.ts` e `features/dm/compulsion-roll.test.tsx`.
- **API**: nenhuma mudança.
- **Dependências**: nenhuma nova.
