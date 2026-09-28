## Why

Hoje o Mestre só tem a Lista de personagens e a Rolagem de Ressonância. Ele não tem como montar as coteries da crônica, conduzir um combate em rodadas nem improvisar um mortal do sertão na hora. Os jogadores também não enxergam nada da mesa além da própria ficha. As referências enviadas mostram as três peças: Coteries, Rodada (com inimigos) e Gerador de NPC do Sertão alagoano de 1936. Esse gerador hoje existe só como planilha do Excel (`Gerador_NPC_Sertao_Alagoano_1936_V10.xlsx`).

## What Changes

- **Painel do Mestre com mais abas**: "Lista de personagens", "Coteries", "Ações", "Rodada" e "Bestiário" (`/personagens`, `/personagens/coteries`, `/personagens/acoes`, `/personagens/rodada`, `/personagens/bestiario`).
- **Coteries (Mestre)**: "+ Nova coterie", nome editável, contagem de membros e "Excluir coterie". Um seletor "+ Colocar personagem…" lista só os jogadores com personagem criado que ainda não estão em nenhuma coterie. Cada membro aparece num cartão com nome, clã, Fome, Vitalidade e Força de Vontade em caixas, e os botões "Ver ficha" e "Retirar". Cada jogador fica em no máximo uma coterie.
- **Bestiário (Mestre)**: lista de inimigos salvos. "+ Novo inimigo" cria um inimigo no fim da lista. Cada inimigo tem nome, "Jogadores veem os dados", Vitalidade e Força de Vontade (máximo com −/+ e caixas de dano), paradas de dados (nome + dados) e especiais (nome + texto rico com negrito, itálico, sublinhado e listas). Os botões são "Colocar na rodada" / "Na rodada · tirar", "Duplicar" e "Excluir". Criar um inimigo **não** o põe na rodada.
- **Rodada (Mestre)**: título "Rodada N" com "Vez de <nome>", e os botões "◀ Anterior", "Próximo ▶" e "Reiniciar". Cartões na ordem, com o da vez destacado ("Vez de agir"). O painel "Ordem da rodada" tem iniciativa por linha, ↑/↓, ×, "Ordenar por iniciativa" e "Esvaziar", mais os seletores "+ Colocar personagem…" e "+ Colocar inimigo…" (este puxa do Bestiário).
- **Ficha do jogador ganha duas abas**:
  - "Coterie": nome da coterie e cartões (somente leitura) dos membros, ou "Você ainda não está em uma coterie.".
  - "Rodada": a mesma rodada em leitura, atualizada sozinha a cada poucos segundos. De um inimigo, o jogador vê só o nome, a menos que o Mestre tenha marcado "Jogadores veem os dados".
- **Gerador de NPC (Mestre, aba Ações)**: seção "Gerador de NPC · Sertão alagoano, 1936" abaixo da Rolagem de Ressonância. Tem os filtros Apresentação (Aleatória/Homem/Mulher), Estrato social (Aleatório/Pobre/Remediado/De posses) e Exposição ao oculto (Aleatória/0–4), e o botão "Gerar NPC". O resultado mostra um cabeçalho escuro (apresentação · idade · ocupação, nome, alcunha e "Rolar intensidade · <Ressonância>"), os cartões Identidade, Personalidade, Dramaturgia e O Oculto, e "Resumo para ler na mesa" com "Copiar", seguidos da nota de créditos. As listas, os pesos e as regras de coerência vêm da planilha. O NPC **não** é salvo: gerar outro substitui o anterior.
- **Persistência na API**: coteries e membros, inimigos (Bestiário) e o estado da rodada (número, vez, ordem com iniciativa). NPCs não são salvos.

## Capabilities

### New Capabilities

- `coteries`: aba Coteries do Mestre (criar, renomear, excluir, colocar e retirar membros) e aba Coterie da ficha do jogador.
- `bestiary`: aba Bestiário do Mestre, com inimigos persistentes, o editor, o texto rico dos especiais e a entrada e saída da rodada.
- `combat-round`: aba Rodada do Mestre (ordem, iniciativa, vez, rodada) e aba Rodada do jogador (leitura, atualização periódica, dados de inimigo só quando permitidos).
- `npc-generator`: Gerador de NPC do Sertão alagoano de 1936 na aba Ações. Cobre as listas convertidas da planilha, as regras de sorteio, o cartão, o resumo e o botão de rolar intensidade.
- `api-chronicle`: rotas e tabelas da API para coteries, inimigos e rodada, com filtragem dos dados de inimigo para jogadores.

### Modified Capabilities

- `dm-mode`: o Painel do Mestre passa a ter as abas "Lista de personagens", "Coteries", "Ações", "Rodada" e "Bestiário".
- `character-sheet`: a navegação da ficha do jogador ganha as abas "Coterie" (`coterie`) e "Rodada" (`rodada`). Na ficha de um jogador aberta pelo Mestre, essas duas abas não aparecem.
- `dm-resonance-roll`: o layout da aba Ações ganha, abaixo da Rolagem de Ressonância, a seção do Gerador de NPC.

## Impact

- **API**:
  - novas tabelas `coteries`, `coterie_members`, `enemies` e `rounds` (linha única), com a migração `0002_chronicle.sql`;
  - novo módulo `chronicle` com os controllers `coteries` e `enemies` (só Mestre), `round` (leitura para todos, gravação só do Mestre) e `me/coterie`;
  - schemas zod e Swagger das novas rotas; testes de serviço e de schema.
- **Web**:
  - rotas `personagens._painel.{coteries,rodada,bestiario}.tsx`;
  - `dm-shell.tsx` com cinco abas;
  - novos `features/dm/{coteries,bestiary,round,npc}/…`, `features/sheet/tabs/{coterie,rodada}-tab.tsx`, `rules/round.ts`, `rules/npc.ts`, `data/npc-lists.ts` (gerado), `lib/rich-text.ts` (sanitização);
  - novas funções em `lib/api.ts`, `tabs.ts` com abas por contexto, e o `fake-api.ts` dos testes com as novas rotas.
- **Ferramentas**: script `web/scripts/npc-lists-from-xlsx.py`, só com a biblioteca padrão do Python, que converte a planilha em `data/npc-lists.ts`.
- **Dependências**: nenhuma nova. O texto rico usa `contentEditable` com uma lista de tags permitidas, sem biblioteca de editor.
