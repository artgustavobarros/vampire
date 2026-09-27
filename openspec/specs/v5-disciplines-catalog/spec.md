# v5-disciplines-catalog Specification

## Purpose
Catálogo canônico de disciplinas, poderes, rituais e fórmulas de Vampiro: A Máscara 5ª Edição traduzido para PT-BR, com estrutura compatível com as regras e o painel de informações.

## Requirements
### Requirement: Catálogo canônico de Disciplinas e Poderes em PT-BR
O catálogo em `web/src/data/disciplines.ts` SHALL fornecer a lista canônica `DISCIPLINES` e o mapeamento `POWERS` contendo todas as disciplinas básicas do livro oficial de regras V5 (Animalismo, Auspícios, Celeridade, Dominação/Domínio, Feitiçaria de Sangue, Fortitude, Ofuscação, Potência, Presença, Protean), além de Alquimia de Sangue-fraco e Oblívio. Cada entrada de poder MUST seguir a interface `PowerTemplate`, contendo `name` (string em português), `level` (número inteiro de 1 a 5), `cost` (string detalhando o custo de sangue), `duration` (string informando a duração do efeito), `rouse` (booleano indicando se exige Checagem de Sangue/Rouse Check) e `description` (texto detalhado e traduzido).

#### Scenario: Consulta a poderes canônicos do livro básico
- **WHEN** o usuário ou a aplicação acessa `POWERS["Potência"]`
- **THEN** a lista contém poderes canônicos como "Corpo Letal", "Salto Elevado", "Proeza", "Alimentação Brutal", "Gole de Poder", "Terremoto" e "Punho de Caim", com níveis de 1 a 5 e custos correspondentes

#### Scenario: Consistência do booleano de Rouse Check
- **WHEN** um poder indica custo como "Um Rouse Check" ou "Dois Rouse Checks"
- **THEN** o campo `rouse` é `true`, e quando indica "Sem custo de sangue" ou "Sem custo", `rouse` é `false`

### Requirement: Descrição mecânica compatível com splitRoll
A propriedade `description` de cada poder SHALL incluir a explicação dos efeitos e a fórmula de parada de dados do sistema no formato canônico `<Atributo> + <Disciplina/Habilidade>` (com `vs.` ou `contra` opcional para testes resistidos), permitindo que a função `splitRoll` em `web/src/features/info/build-info.ts` extraia a rolagem sem quebras.

#### Scenario: Poder com teste de parada resistida
- **WHEN** o poder "Acalmar a Fera" (Animalismo nível 3) é avaliado por `splitRoll`
- **THEN** a rolagem extraída é `Carisma + Animalismo vs. Vigor + Determinação` e o texto restante da descrição contém os efeitos sobre alvos mortais e vampiros

#### Scenario: Poder sem rolagem ativa
- **WHEN** um poder de duração "Passiva" como "Corpo Letal" não possui rolagem em sua descrição
- **THEN** `splitRoll` identifica que o poder é passivo ("Sem teste: efeito passivo, sempre ativo.")

### Requirement: Rituais de Feitiçaria de Sangue
O catálogo SHALL catalogar os Rituais de Feitiçaria de Sangue do livro básico do nível 1 ao nível 5, incluindo rituais emblemáticos (como "Caminhada do Sangue", "Aderência do Inseto", "Criar Pedra de Sangue", "Despertar com o Frescor Noturno", "Proteção contra Carniçais", "Olhos de Babel", "Iluminar o Rastro da Presa", "Verdade do Sangue", "Chamado de Dagon", "Deflexão do Destino de Madeira", "Essência do Ar", "Caminhante do Fogo", "Defesa do Refúgio Sagrado", "Olhos do Falcão Noturno", "Passagem Incorpórea", "Fuga para o Verdadeiro Santuário", "Coração de Pedra" e "Estaca da Dissolução Tardia").

#### Scenario: Rituais disponíveis por nível
- **WHEN** a aplicação consulta poderes e rituais de "Feitiçaria de Sangue"
- **THEN** os poderes ativos fundamentais e rituais canônicos do livro básico estão disponíveis estruturados em níveis 1 a 5

### Requirement: Fórmulas de Alquimia de Sangue-fraco
O catálogo SHALL conter as fórmulas canônicas de Alquimia de Sangue-fraco descritas no livro de regras V5 (como "Alcance Remoto", "Névoa", "Hieros Gamos Profano", "Envolver", "Desfracionar", "Ímpeto Aéreo" e "Despertar o Dormente"), com seus níveis de 1 a 5, custos de destilação/ativação e parâmetros do sistema.

#### Scenario: Exibição de fórmulas no assistente
- **WHEN** um personagem Sangue-ralo escolhe fórmulas de Alquimia de Sangue-fraco
- **THEN** as opções disponíveis correspondem às fórmulas oficiais com duração e custo precisos

### Requirement: Interoperabilidade e suporte a nomes alternativos
O catálogo MUST manter compatibilidade com as referências a disciplinas existentes em `clans.ts` e `predators.ts`. Casos com variações léxicas (como `Dominação` vs. `Domínio`, `Protean` vs. `Proteanismo`, `Alquimia de Sangue-fraco` vs. `Alquimia de Sangue-ralo`) SHALL ser mapeados no dicionário de poderes de modo que `POWERS[disciplina]` resolva corretamente para ambas as grafias.

#### Scenario: Busca por Dominação ou Domínio
- **WHEN** um componente consulta `POWERS["Dominação"]` ou `POWERS["Domínio"]`
- **THEN** ambos retornam a mesma lista de poderes oficiais atualizados

#### Scenario: Busca por Protean ou Proteanismo
- **WHEN** um componente consulta `POWERS["Protean"]` ou `POWERS["Proteanismo"]`
- **THEN** ambos retornam a mesma lista de poderes de Protean atualizados

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
