## Why

Ao entrar, o Mestre cai direto numa página solta ("Lista de personagens" com "Sair" no cabeçalho) e não tem onde fazer as rolagens de mesa que são dele — em especial sortear a Ressonância (e a discrasia) da presa quando um personagem se alimenta. A referência enviada organiza a área do Mestre como um painel com cabeçalho próprio e duas abas: "Lista de personagens" (padrão, com o layout de cartões que já existe) e "Ações" (Rolagem de Ressonância).

## What Changes

- **Painel do Mestre**: nova moldura só para o Mestre com cabeçalho (nome do usuário, selo "MESTRE" em sangue e botão contornado "Sair da conta") e uma barra de abas sublinhadas: "Lista de personagens" e "Ações".
- **Aba Lista de personagens (padrão)**: continua em `/personagens`, com o mesmo texto de abertura e os mesmos cartões; o título "Lista de personagens" e o botão "Sair" saem da página e passam a ser, respectivamente, a aba ativa e o "Sair da conta" do cabeçalho.
- **Aba Ações**: nova página `/personagens/acoes` com a Rolagem de Ressonância:
  - escolha de Ressonância (Aleatória, Colérica, Melancólica, Fleumática, Sanguínea) e de Intensidade (Aleatória, Negligenciável, Difusa, Intensa, Aguçada) — o que ficar em "Aleatória" é sorteado;
  - botão sangue "Rolar ressonância" (ou "Rolar discrasia" quando os dois estão fixos em Aguçada);
  - cartão de resultado (fundo tinta, filete sangue): intensidade, humor, emoções, Disciplinas do humor, efeito da intensidade e, em Aguçada, a discrasia sorteada em d3, com a linha dos dados rolados;
  - botão "Limpar" logo acima do cartão, que volta o cartão ao estado inicial (sem histórico de rolagens);
  - nota com as tabelas usadas (d10 de intensidade, d10 de ressonância).
- **Dados**: nova tabela de humores (emoções, Disciplinas), efeitos de intensidade e três discrasias por humor.
- A ficha de um jogador aberta pelo Mestre (`/personagens/:id/:aba`) **não** fica dentro do painel: mantém o layout da ficha.

## Capabilities

### New Capabilities

- `dm-resonance-roll`: aba Ações do Mestre — Rolagem de Ressonância com tabelas de d10, discrasias em d3, cartão de resultado com "Limpar".

### Modified Capabilities

- `dm-mode`: nasce o painel do Mestre (cabeçalho + abas "Lista de personagens" / "Ações"); a Lista de personagens perde o próprio título e o botão "Sair", que vão para o painel.

## Impact

- **Web — rotas**: `web/src/routes/personagens.index.tsx` passa para baixo de um layout sem caminho do painel (ex.: `personagens._painel.tsx`, `personagens._painel.index.tsx`, `personagens._painel.acoes.tsx`); `routeTree.gen.ts` regenerado. `personagens.$id*` não muda.
- **Web — features**: `web/src/features/dm/` ganha o painel (`dm-shell.tsx`) e a aba Ações (`resonance-roll.tsx` e afins); `character-list.tsx` perde o cabeçalho.
- **Web — regras e dados**: novo `web/src/rules/resonance.ts` (sorteio puro, com gerador injetável) e `web/src/data/resonance.ts` (humores, intensidades, discrasias).
- **Testes**: `character-list.test.tsx` e `dm-routes.test.tsx` atualizados; novos testes das regras de sorteio e da aba Ações.
- **API**: nenhuma mudança.
