## 1. API: banco e migração

- [x] 1.1 Em `api/src/db/schema.ts`, criar as tabelas `coteries`, `coterie_members` (com `user_id` como chave primária e cascata para `users` e `coteries`), `enemies` e `rounds` (`id` smallint)
- [x] 1.2 Gerar `api/drizzle/0002_chronicle.sql` com `db:generate` e completar à mão com `CHECK (id = 1)` em `rounds` e o `INSERT` da linha inicial `{ "rodada": 1, "vez": 0, "ordem": [] }`; rodar `db:migrate` no ambiente local

## 2. API: módulo chronicle

- [x] 2.1 Criar `chronicle/chronicle.schemas.ts` (zod, com as mensagens do spec):
  - coterie (`nome` ≤ 80, com trim), inimigo (formato, limites, trilha ≤ máximo) e estado da rodada;
  - respostas de coterie, `me/coterie`, inimigo e visão da rodada.
- [x] 2.2 Criar `chronicle/sheet-projection.ts` com `projectSheet(data)`, que devolve `nome`, `cla`, `criada`, `fome`, `vit`, `fdv` e `attrs.{Vigor, Autocontrole, Determinação}`
- [x] 2.3 `CoteriesService` e `CoteriesController` (`@Roles("dm")`), com os erros `404`/`400`/`409` e a idempotência do spec:
  - `GET`, `POST`, `PATCH` e `DELETE /coteries`;
  - `PUT` e `DELETE /coteries/:id/membros/:userId`.
- [x] 2.4 `MyCoterieController` com `GET /me/coterie`, que devolve `{ coterie: null }` ou os membros por ordem de entrada, com `projectSheet`
- [x] 2.5 `EnemiesService` e `EnemiesController` (`@Roles("dm")`) com `GET`, `POST`, `PUT` e `DELETE /enemies`. O `DELETE` tira o inimigo de `rounds.data.ordem` na mesma transação.
- [x] 2.6 `RoundService` e `RoundController`:
  - `GET /round` para qualquer autenticado: visão enriquecida, participantes sumidos omitidos, `vez` recortada, `dados: null` de inimigo oculto para quem não é Mestre;
  - `PUT /round` com `@Roles("dm")`: valida participantes existentes e sem repetição (`400` "Participante inválido na rodada.") e `vez` (`400` "Vez fora da ordem.").
- [x] 2.7 Registrar `ChronicleModule` no `AppModule` (importando `UsersModule`), com tags e respostas de erro no Swagger
- [x] 2.8 Testes:
  - schemas: inimigo inválido, trilha maior que o máximo, vez fora da ordem;
  - serviços: projeção sem e-mail e sem chaves extras, `409` de jogador em outra coterie, filtragem de `dados` por papel, `DELETE` de inimigo limpando a rodada, participante apagado omitido;
  - e2e: `403` do jogador nas rotas do Mestre.

## 3. Web: cliente da API e API falsa

- [x] 3.1 Em `web/src/lib/api.ts`, criar os tipos (`Coterie`, `MyCoterie`, `Enemy`, `EnemyRecord`, `RoundEntry`, `RoundState`, `RoundView`) e as funções das rotas novas (`listCoteries`, `createCoterie`, `renameCoterie`, `deleteCoterie`, `addCoterieMember`, `removeCoterieMember`, `getMyCoterie`, `listEnemies`, `createEnemy`, `saveEnemy` com `keepalive`, `deleteEnemy`, `getRound`, `putRound`)
- [x] 3.2 Estender `web/src/test/fake-api.ts` com coteries, inimigos e rodada em memória, com as mesmas validações, mensagens, projeção e filtragem por papel da API, e helpers de preparo para os testes

## 4. Web: regras puras

- [x] 4.1 Criar `web/src/rules/round.ts`, com a vez seguindo o participante ao reordenar: `next`, `prev`, `canPrev`, `restart`, `sortByInitiative`, `move`, `remove`, `add`, `clear`, `setInitiative` e `currentEntry`
- [x] 4.2 Criar `web/src/rules/round.test.ts` com os cenários do spec `combat-round`: virar e voltar a rodada, ordenar mantendo a vez, remover quem tem a vez, remover o último, "Anterior" sem efeito na rodada 1, esvaziar
- [x] 4.3 Criar `web/src/lib/rich-text.ts` com `sanitizeRichText`: lista de tags permitidas, sem atributos, `script`/`style` descartados com o conteúdo, outras tags trocadas pelos filhos. Testes com negrito, listas, `<a href>`, `<script>`, `onerror` e `<div>` aninhado.

## 5. Web: gerador de NPC — dados e regras

- [x] 5.1 Criar `web/scripts/npc-lists-from-xlsx.py`, só com a biblioteca padrão. Ele lê `Listas` (linha 1 = nome da coluna, repetições mantidas) e os pesos de `Referência`, deixa de fora `Alcunha_H`, `Alcunha_M`, `Carrega` e `OndeEncontra`, e grava `web/src/data/npc-lists.ts` com o cabeçalho "gerado — não editar"
- [x] 5.2 Rodar o script com `/mnt/c/Users/arthu/OneDrive/Documentos/RPG/Vampiro/Gerador_NPC_Sertao_Alagoano_1936_V10.xlsx` e versionar o `npc-lists.ts` gerado. Formatar o arquivo com o Biome.
- [x] 5.3 Criar `web/src/rules/npc.ts`:
  - `generateNpc(filtros, d)`, na ordem da aba `NPC`: apresentação, estrato por peso, nome, alcunha em d10, ocupação por estrato, idade ativa, condição, alfabetização letrada, vestimenta, virtudes e falhas sem repetir, temperamento → ressonância pela mesma linha, exposição por peso, gancho em d10, objeto composto e demais campos;
  - `npcSummary(npc)`, igual à fórmula `A35`;
  - `moodOf`.
- [x] 5.4 Criar `web/src/rules/npc.test.ts` com dado fixo:
  - regras: ocupação letrada força "lê e escreve bem", ocupação ativa usa `Idade_Ativa`, virtudes diferentes com o mesmo número, estrato fixo "De posses" usa as listas T3 e de posses, temperamento e ressonância na mesma linha, alcunha 10 sem trecho no resumo, gancho composto em 6–10;
  - dados: todas as colunas exigidas existem e não estão vazias.

## 6. Web: componentes compartilhados

- [x] 6.1 `DamageTrack` com `onCycle` opcional: sem ele, caixas não interativas, com `role="img"` e `aria-label` de resumo. Conferir os usos atuais.
- [x] 6.2 Criar `features/dm/status-card.tsx` (`CharacterStatusCard`): nome, clã, Fome e as trilhas "Vitalidade · r/m" e "Força de vontade · r/m" só para leitura, com `footer` opcional. Usa `summarize` e `trackBoxes`.
- [x] 6.3 Criar `components/vtm/rich-text-editor.tsx`: barra N/I/S/• Lista/1. Lista com `aria-pressed`, `contentEditable`, e `sanitizeRichText` no `input` e no `paste`. Criar também `components/vtm/rich-text.tsx` para exibir.
- [x] 6.4 Criar `components/vtm/confirm-dialog.tsx` sobre o `Dialog` existente (texto, botão de confirmar em `blood` e "Cancelar")
- [x] 6.5 Criar `hooks/use-debounced-save.ts` (500 ms; envia o pendente no `unmount` e em `pagehide`) e `hooks/use-polling.ts` (5 s, só com a página visível, recarga no `visibilitychange`), com testes de timers falsos

## 7. Web: painel do Mestre e rotas

- [x] 7.1 `DmShell` com as abas Lista de personagens, Coteries, Ações, Rodada e Bestiário. A `nav` passa a `overflow-x-auto` e os links a `whitespace-nowrap`.
- [x] 7.2 Criar as rotas `personagens._painel.coteries.tsx`, `personagens._painel.rodada.tsx` e `personagens._painel.bestiario.tsx`, e regenerar `routeTree.gen.ts`

## 8. Web: Coteries

- [x] 8.1 Criar `features/dm/coteries/coteries-page.tsx`: texto de abertura, "+ Nova coterie" (com foco no nome novo), estados de carregando, vazio e erro com "Tentar de novo"
- [x] 8.2 Criar `coterie-panel.tsx`:
  - nome com autosave (`PATCH`) e contagem "N membros";
  - "Excluir coterie" com `ConfirmDialog`;
  - seletor "+ Colocar personagem…" só com jogadores livres de personagem criado, desabilitado sem opção;
  - cartões de membro com "Ver ficha" e "Retirar".
- [x] 8.3 Criar `features/sheet/tabs/coterie-tab.tsx`: `GET /me/coterie`, nome ("Coterie sem nome"), cartões só para leitura e os estados sem coterie, carregando e erro

## 9. Web: Bestiário

- [x] 9.1 Criar `features/dm/bestiary/bestiary-page.tsx`: título "Inimigos", "+ Novo inimigo" no fim da lista com foco no nome, e os estados de carregando, vazio e erro. Carrega `GET /enemies` e `GET /round`.
- [x] 9.2 Criar `enemy-editor.tsx`:
  - nome, "Jogadores veem os dados";
  - Vitalidade e Força de Vontade com −/+ (1–20, descartando caixas) e trilhas interativas;
  - paradas (nome, dados 0–30, ×, "+ Parada") e especiais (nome, ×, editor rico, "+ Especial");
  - autosave em `PUT /enemies/<id>`.
- [x] 9.3 Rodapé do editor:
  - "Colocar na rodada" / "Na rodada · tirar", com `rules/round.add`/`remove` e `PUT /round`;
  - "Duplicar", com "(cópia)", sem dano e fora da rodada;
  - "Excluir", com `ConfirmDialog`.

## 10. Web: Rodada

- [x] 10.1 Criar `features/round/round-view.tsx`:
  - título "Rodada N" e "Vez de <nome>";
  - grade de cartões (1/2/3 colunas) com posição, tipo, "Inic.", destaque e selo "Vez de agir";
  - cartão de jogador com `CharacterStatusCard`;
  - cartão de inimigo com trilhas, paradas e especiais (`RichText`), ou "Dados ocultos pelo Mestre." quando `dados` é `null`.
- [x] 10.2 Criar `features/dm/round/round-page.tsx`:
  - carrega `GET /round`, `/sheets` e `/enemies`;
  - botões "◀ Anterior", "Próximo ▶" e "Reiniciar", desabilitados conforme o spec;
  - dano de inimigo pelo cartão, gravado em `PUT /enemies/<id>`;
  - toda ação gravada em `PUT /round`.
- [x] 10.3 Criar `order-panel.tsx`:
  - linhas com iniciativa (autosave de 500 ms), ↑/↓ e ×;
  - seletores "+ Colocar personagem…" e "+ Colocar inimigo…", desabilitados sem opção;
  - "Ordenar por iniciativa" e "Esvaziar" com confirmação;
  - "Ninguém na rodada ainda." com a ordem vazia.
- [x] 10.4 Criar `features/sheet/tabs/rodada-tab.tsx`: `RoundView` no modo jogador com `usePolling(getRound)`, toast só na primeira carga e "Nenhum combate em andamento." com a ordem vazia

## 11. Web: abas da ficha

- [x] 11.1 `tabs.ts`: adicionar `coterie` e `rodada` depois de `acoes`; criar `tabsFor(context)`; passar o contexto a `isSheetTab` e `resolveTab`. Atualizar `tabs.test.ts`.
- [x] 11.2 `SheetLayout` com o menu usando `tabsFor` pelo `tabs.to`. `ficha.$aba.tsx` e `personagens.$id.$aba.tsx` passam o contexto. `tab-content.tsx` renderiza `CoterieTab` e `RodadaTab`.

## 12. Web: Gerador de NPC na aba Ações

- [x] 12.1 Exportar `ResonanceResult` de `resonance-roll.tsx` e colocar a seção do gerador abaixo da grade da Rolagem de Ressonância
- [x] 12.2 Criar `features/dm/npc-generator.tsx`:
  - título entre filetes;
  - filtros com `Chip` (Apresentação, Estrato social, Exposição ao oculto);
  - "Gerar NPC";
  - nota de créditos sempre visível;
  - anúncio `aria-live` "NPC gerado: <nome>".
- [x] 12.3 Cartão do NPC:
  - cabeçalho escuro (kicker, nome, alcunha, "Rolar intensidade · <Ressonância>");
  - cartões Identidade, Personalidade, Dramaturgia e O Oculto em grade de 3 colunas a partir de `md`;
  - "Resumo para ler na mesa" com "Copiar" e os toasts de sucesso e falha.
- [x] 12.4 "Rolar intensidade": `rollResonance` com a ressonância do NPC fixa, `ResonanceResult` abaixo do cabeçalho com "Limpar", resultado apagado ao gerar outro NPC, sem mexer no cartão do topo

## 13. Testes de tela e verificação

- [x] 13.1 `dm-routes.test.tsx`: as cinco abas na ordem, `aria-current` em cada URL e o redirecionamento do jogador nas quatro abas novas
- [x] 13.2 Testes das Coteries:
  - Mestre: criar, renomear, colocar (some dos seletores), retirar, excluir com e sem confirmação;
  - jogador: com coterie, sem coterie e sem e-mail de outros.
- [x] 13.3 Testes do Bestiário: novo inimigo no fim e fora da rodada, −/+ e caixas, parada, especial com negrito, colocar na rodada, duplicar e excluir tirando da rodada
- [x] 13.4 Testes da Rodada:
  - Mestre: próximo, anterior, reiniciar, colocar por seletor, ordenar e esvaziar;
  - jogador: polling com timers falsos, inimigo oculto sem dados, inimigo visível e sem combate;
  - Mestre na ficha em `/personagens/<id>/rodada` redireciona.
- [x] 13.5 Testes do Gerador de NPC com dado fixo: filtros aplicados, novo NPC substitui o antigo, sem alcunha, "Copiar" (com `clipboard` simulado) e "Rolar intensidade" com "Fleumática (escolhida)"
- [x] 13.6 Rodar os testes e o `check` do `web` e da `api`, o `typecheck` e os builds. Conferir no navegador, em desktop e em 375px, com Mestre e jogador lado a lado:
  - Coteries;
  - Bestiário;
  - Rodada, com a atualização no jogador;
  - Ações com o NPC.
