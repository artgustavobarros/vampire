## ADDED Requirements

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
