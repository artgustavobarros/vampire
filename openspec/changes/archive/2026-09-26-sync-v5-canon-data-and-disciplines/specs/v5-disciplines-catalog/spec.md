## ADDED Requirements

### Requirement: Saneamento de duplicatas e mapeamento de aliases canônicos
O catálogo em `web/src/data/disciplines.ts` SHALL eliminar entradas redundantes e duplicadas para o mesmo poder (como variações de tradução de *Corpo Letal*/*Toque Letal*, *Salto Elevado*/*Força Prodigiosa* e *Expulsar a Fera*/*Expelir a Fera*/*Desfazer a Fera*). Para preservar retrocompatibilidade com testes e seleções existentes, o sistema MUST resolver nomes legados através de mapeamento ou busca canônica sem poluir a lista de escolhas apresentada aos jogadores.

#### Scenario: Consulta a poderes desduplicados
- **WHEN** a aplicação consulta a lista `POWERS["Potência"]`
- **THEN** cada poder canônico possui uma única entrada de nível 1 correspondente ("Corpo Letal" e "Salto Elevado"), sem entradas duplicadas de mesmo efeito

#### Scenario: Resolução de aliases legados em testes
- **WHEN** um teste ou componente consulta informações para o alias "Sussurro Ferino"
- **THEN** a função de busca recupera os detalhes correspondentes ao poder canônico sem lançar erro

### Requirement: Auditoria e consistência com compêndio oficial V5 PT-BR
Todas as disciplinas, poderes, clãs e tipos de predadores do projeto SHALL ser auditados e alinhados com o compêndio oficial comunitário V5 PT-BR (`vtm5e-compendio-ptbr`), baseado nas publicações oficiais da Galápagos Jogos. Os clãs em `web/src/data/clans.ts` e tipos de predador em `web/src/data/predators.ts` MUST referenciar as disciplinas padronizadas em `disciplines.ts`.

#### Scenario: Consistência entre predadores e catálogo de disciplinas
- **WHEN** um jogador seleciona o tipo de predador "Sanguessuga" ou "Gato de Beco" no assistente
- **THEN** todas as disciplinas listadas no predador possuem correspondência exata em `POWERS` e oferecem poderes de nível compatível

#### Scenario: Consistência entre clãs e catálogo de disciplinas
- **WHEN** um clã lista suas disciplinas nativas em `clans.ts`
- **THEN** cada disciplina declarada é resolvida corretamente em `POWERS` tanto pelo nome principal quanto por variantes canônicas (ex.: "Dominação", "Proteanismo")

### Requirement: Documentação de fontes canônicas no README
O arquivo `web/README.md` SHALL conter uma seção dedicada documentando as fontes e compêndios oficiais adotados como verdade para o V5 (Foundry VTT `WoD5E-Developers/wod5e`, compêndio `pixshadoow-beep/vtm5e-compendio-ptbr` e repositório `albacrux/vtm5_regras_e_matrizes`).

#### Scenario: Consulta a referências no README
- **WHEN** um desenvolvedor ou usuário lê o `web/README.md`
- **THEN** o documento lista explicitamente as referências externas canônicas utilizadas para os dados de disciplinas, clãs e regras de Vampiro: A Máscara 5ª Edição
