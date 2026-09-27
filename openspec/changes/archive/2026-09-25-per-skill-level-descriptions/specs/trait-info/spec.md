## MODIFIED Requirements

### Requirement: Conteúdo por tipo de traço
O conteúdo do painel SHALL ser montado por uma função pura a partir do tipo, da chave e da ficha, usando o catálogo em `data/trait-info.ts`:
- **Atributo**: kicker "Atributo <grupo no singular>", descrição e os 5 níveis próprios do atributo.
- **Habilidade**: kicker "Habilidade <grupo no singular>", descrição, lista "O que cada ponto significa" com os 5 níveis (• a •••••) próprios da habilidade e o nível atual destacado, e nota "Especialidades comuns: …". O texto de cada nível MUST ser o texto próprio daquela habilidade para aquele ponto (ex.: Briga ••• descreve o que um lutador de 3 pontos faz); MUST NOT existir escala genérica compartilhada entre habilidades.
- **Disciplina**: kicker "Disciplina", descrição (ou texto de fora do catálogo), níveis 1–5 com os poderes do catálogo em cada nível e nota sobre limite por nível; selo "Nível N".
- **Poder**: kicker "<Disciplina> · nível N", descrição do catálogo (ou a registrada), lista "Rolagem, custo e duração" com as linhas Rolagem, Custo e Duração, e nota "Este poder exige Rouse Check." quando aplicável. A Rolagem MUST ser extraída da descrição do catálogo quando ela cita "Atributo + Disciplina" (com "de <X>" e "vs. …"/"contra …" opcionais), e essa frase MUST sair da descrição (se a descrição ficar vazia, usa a original). Sem citação, a Rolagem MUST ser "Sem teste: efeito passivo, sempre ativo." quando a duração é "Passiva", ou "Sem teste: o efeito acontece ao ativar." nos demais casos. Poder fora do catálogo não tem lista.
- **Geração** e **Potência de Sangue**: kicker "Sangue", sem lista de níveis, e uma tabela "Potência de Sangue" com uma linha por Potência (0 a 10) e as colunas Potência, Surto de Sangue, Dano recuperado (por Checagem de Sangue), Bônus de poder de Disciplina, Rerrolagem de Checagem para Disciplinas, Gravidade da Perdição e Penalidade de alimentação (itens da penalidade um por linha; a coluna de dano sem o sufixo " por Checagem de Sangue"). A linha da Potência do personagem MUST ficar destacada. A Potência é a derivada da Geração; sem Geração reconhecida, a Potência gravada na ficha (0 no assistente). Selo: "<geração> Geração · Potência N", ou "Potência N" sem Geração. Nota: "Linha destacada: Potência N, a inicial da <geração> Geração." com Geração, ou "Escolha a Geração no passo 1 para destacar a sua Potência inicial." sem Geração.
  - Geração: título "Geração", descrição "A distância entre você e Caim. Você é sempre uma Geração acima do seu senhor, e cada Abraço dilui o sangue. A Geração define a Potência de Sangue inicial: " seguida de "a <geração> começa com Potência N." ou, sem Geração, "escolha a Geração para ver a sua.".
  - Potência de Sangue: título "Potência de Sangue", descrição "A força da vitae. Não se escolhe na criação: vem da Geração.".
- **Vantagem/Defeito**: reconhece nomes comuns por prefixo, sem diferenciar maiúsculas; lista "O que cada ponto significa" com os 5 níveis (• a •••••) e o nível atual destacado. Para mérito do catálogo, o texto de cada nível MUST ser o texto próprio daquele mérito para aquele ponto (ex.: Recursos ••• descreve a renda de 3 pontos); para mérito fora do catálogo, MUST usar a escala genérica de vantagem ou de defeito, com o texto de fora do catálogo como descrição. Qualidade SR MUST ser tratada como Vantagem e Defeito SR como Defeito.
- **Perdição do clã**: kicker "Perdição · <clã>", título com o nome da Perdição, descrição completa do catálogo `CLAN_FULL`, selo "Gravidade N" (Gravidade da Perdição da Potência de Sangue informada pelo gatilho), lista "Regra e rolagem" com os pares rótulo/texto e `{G}` trocado pela Gravidade, e nota "A Gravidade da Perdição vem da Potência de Sangue (atual: N).".
- **Compulsão do clã**: kicker "Compulsão · <clã>", título com o nome da Compulsão, descrição completa, lista "Regra e rolagem" (Efeito, Termina) e nota sobre falha bestial ("Compulsões surgem numa falha bestial (1 em dado de Fome numa falha). Você pode escolher a Compulsão do clã ou rolar na tabela geral."); sem selo.
- Para clãs sem entrada em `CLAN_FULL` (Caitiff, Sangue Fraco), Perdição e Compulsão MUST usar o texto curto do clã, sem selo, sem lista e sem nota.
- **Estados** (Fome, Humanidade, Vitalidade, Força de Vontade, Ressonância): níveis, tipos de dano ou humores, com destaque do valor atual para Fome e Humanidade.

#### Scenario: Descrição por ponto da habilidade
- **WHEN** o painel abre para a habilidade "Briga" com 3 pontos
- **THEN** a lista "O que cada ponto significa" tem 5 linhas com os textos próprios de Briga, e a linha "•••" está destacada

#### Scenario: Habilidades com níveis distintos
- **WHEN** o painel abre para "Briga" e depois para "Finanças", ambas com 2 pontos
- **THEN** o texto da linha "••" de Briga é diferente do texto da linha "••" de Finanças

#### Scenario: Toda habilidade catalogada
- **WHEN** o painel abre para qualquer habilidade de `SKILL_GROUPS`
- **THEN** a lista tem exatamente 5 linhas, todas com texto não vazio

#### Scenario: Disciplina fora do catálogo
- **WHEN** o painel abre para uma disciplina chamada "Serpentis"
- **THEN** a descrição é "Disciplina fora do catálogo. Registre os poderes à mão." e cada nível mostra "Sem poderes catalogados neste nível."

#### Scenario: Mérito por prefixo
- **WHEN** o painel abre para a vantagem "Recursos (herança)"
- **THEN** o título é "Recursos (herança)" e a descrição é a de Recursos

#### Scenario: Descrição por ponto do mérito
- **WHEN** o painel abre para a vantagem "Recursos" com 3 pontos
- **THEN** a lista tem 5 linhas com os textos próprios de Recursos para cada ponto, diferentes da escala genérica, e a linha "•••" está destacada

#### Scenario: Mérito fora do catálogo
- **WHEN** o painel abre para a vantagem "Arsenal" com 2 pontos
- **THEN** a descrição é a de fora do catálogo, a lista usa a escala genérica de vantagem e a linha "••" está destacada

#### Scenario: Poder com Rouse
- **WHEN** o painel abre para um poder do catálogo que exige Rouse Check
- **THEN** a lista "Rolagem, custo e duração" mostra rolagem, custo e duração e a nota avisa o Rouse Check

#### Scenario: Rolagem extraída da descrição
- **WHEN** o painel abre para um poder de Animalismo cuja descrição é "Comunica-se com animais. Manipulação + Animalismo vs. resistência do animal."
- **THEN** a linha Rolagem mostra "Manipulação + Animalismo vs. resistência do animal" e a descrição é "Comunica-se com animais."

#### Scenario: Poder passivo sem rolagem
- **WHEN** o painel abre para um poder do catálogo com duração "Passiva" e sem "Atributo + Disciplina" na descrição
- **THEN** a linha Rolagem mostra "Sem teste: efeito passivo, sempre ativo."

#### Scenario: Geração do personagem
- **WHEN** o painel da Geração abre para a geração "12ª"
- **THEN** o selo mostra "12ª Geração · Potência 1", a descrição termina em "a 12ª começa com Potência 1.", a linha de Potência 1 da tabela está destacada e a nota diz "Linha destacada: Potência 1, a inicial da 12ª Geração."

#### Scenario: Geração não escolhida
- **WHEN** o painel da Geração abre no assistente sem geração escolhida
- **THEN** o selo mostra "Potência 0", a descrição termina em "escolha a Geração para ver a sua.", a linha de Potência 0 está destacada e a nota diz "Escolha a Geração no passo 1 para destacar a sua Potência inicial."

#### Scenario: Tabela de Potência de Sangue
- **WHEN** o painel da Potência de Sangue abre para uma ficha de 9ª Geração
- **THEN** a tabela tem 11 linhas (0 a 10), a linha 2 está destacada e mostra "Adicione 2 dados", "2 pontos de dano Superficial", "Adicione 1 dado", "Nível 1", "2" e "Sangue animal ou ensacado sacia meia Fome"

#### Scenario: Penalidade em várias linhas
- **WHEN** a tabela de Potência de Sangue é exibida
- **THEN** a célula de penalidade da Potência 4 mostra "Sangue animal ou ensacado não sacia nenhuma Fome" e "Sacia 1 a menos de Fome por humano" em linhas separadas

#### Scenario: Perdição com Gravidade
- **WHEN** o painel abre para a Perdição de "Brujah" com Potência de Sangue 1 (Gravidade 2)
- **THEN** o selo mostra "Gravidade 2" e a linha "Rolagem" diz "Retire 2 dados da parada para resistir (mínimo de 1 dado)."

#### Scenario: Compulsão
- **WHEN** o painel abre para a Compulsão de "Ventrue"
- **THEN** o kicker é "Compulsão · Ventrue", não há selo e a lista tem as linhas "Efeito" e "Termina"

#### Scenario: Clã sem texto completo
- **WHEN** o painel abre para a Perdição de "Caitiff"
- **THEN** a descrição é o texto curto da Perdição de Caitiff e não há selo, lista nem nota

#### Scenario: Defeito SR
- **WHEN** o painel abre para um "Defeito SR" chamado "Inimigo"
- **THEN** o kicker é "Defeito" e os níveis são os textos próprios de Inimigo
