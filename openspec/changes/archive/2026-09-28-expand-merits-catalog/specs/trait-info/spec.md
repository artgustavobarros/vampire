## MODIFIED Requirements

### Requirement: Conteúdo por tipo de traço
O conteúdo do painel SHALL ser montado por uma função pura a partir do tipo, da chave e da ficha, usando os catálogos canônicos em `data/trait-info.ts` e `data/merits.ts`:
- **Atributo**: kicker "Atributo <grupo no singular>", descrição saneada de erros ortográficos e os 5 níveis próprios do atributo.
- **Habilidade**: kicker "Habilidade <grupo no singular>", descrição, lista "O que cada ponto significa" com os 5 níveis (• a •••••) próprios da habilidade e o nível atual destacado, e nota "Especialidades comuns: …". O texto de cada nível MUST ser o texto próprio daquela habilidade para aquele ponto; MUST NOT existir escala genérica compartilhada entre habilidades. Todas as 27 habilidades MUST ter descrições completas, lista canônica de especialidades e os 5 níveis descritivos derivados e traduzidos do livro oficial de regras V5 (Vampiro: A Máscara 5ª Edição).
- **Disciplina**: kicker "Disciplina", descrição resolvida por nome canônico (`Dominação`, `Proteanismo`, `Alquimia de Sangue-ralo`) com suporte a variantes legadas (`Domínio`, `Protean`, `Alquimia de Sangue-fraco`), níveis 1–5 com os poderes do catálogo em cada nível e nota sobre limite por nível; selo "Nível N".
- **Poder**: kicker "<Disciplina> · nível N", descrição do catálogo (ou a registrada), lista "Rolagem, custo e duração" com as linhas Rolagem, Custo e Duração, e nota "Este poder exige Rouse Check." quando aplicável. A Rolagem MUST ser extraída da descrição do catálogo quando ela cita "Atributo + Disciplina" (com "de <X>" e "vs. …"/"contra …" opcionais), e essa frase MUST sair da descrição (se a descrição ficar vazia, usa a original). Sem citação, a Rolagem MUST ser "Sem teste: efeito passivo, sempre ativo." quando a duração é "Passiva", ou "Sem teste: o efeito acontece ao ativar." nos demais casos. Poder fora do catálogo não tem lista.
- **Geração** e **Potência de Sangue**: kicker "Sangue", sem lista de níveis, e uma tabela "Potência de Sangue" com uma linha por Potência (0 a 10) e as colunas Potência, Surto de Sangue, Dano recuperado (por Checagem de Sangue), Bônus de poder de Disciplina, Rerrolagem de Checagem para Disciplinas, Gravidade da Perdição e Penalidade de alimentação.
- **Vantagem/Defeito**: consulta só o catálogo `data/merits/` através de `findMerit(name)` (nome, alias ou "Nome (detalhe)"); `MERIT_INFO` MUST NOT ter entradas de mérito. O kicker mostra o tipo; abaixo da descrição, a nota traz o nome em inglês e o livro de origem ("Original: <nome EN> · <livro>") e, quando há `requires`, a linha "Exige <Antecedente> <pontinhos>" ou "Exige a Disciplina <Disciplina>". A lista "O que cada ponto significa" usa os `levels` do item, uma linha por valor permitido, com o nível atual destacado; sem `levels`, um item com faixa usa a escala genérica de vantagem ou de defeito limitada aos valores permitidos, e um item de custo fixo não tem lista. Para méritos e defeitos de Sangue-ralo, exibe a regra completa da característica. Para mérito fora do catálogo, usa a escala genérica de 5 níveis, com o texto de fora do catálogo como descrição.
- **Perdição do clã**: kicker "Perdição · <clã>", título com o nome da Perdição, descrição completa do catálogo `CLAN_FULL`, selo "Gravidade N", lista "Regra e rolagem" com os pares rótulo/texto e `{G}` trocado pela Gravidade, e nota "A Gravidade da Perdição vem da Potência de Sangue (atual: N).".
- **Compulsão do clã**: kicker "Compulsão · <clã>", título com o nome da Compulsão, descrição completa, lista "Regra e rolagem" (Efeito, Termina) e nota sobre falha bestial.
- Para clãs sem entrada em `CLAN_FULL` (Caitiff, Sangue Fraco), Perdição e Compulsão MUST usar o texto curto do clã, sem selo, sem lista e sem nota.
- **Estados** (Fome, Humanidade, Vitalidade, Força de Vontade, Ressonância): níveis, tipos de dano ou humores saneados ortograficamente, com destaque do valor atual para Fome e Humanidade.

#### Scenario: Descrição por ponto da habilidade
- **WHEN** o painel abre para a habilidade "Briga" com 3 pontos
- **THEN** a lista "O que cada ponto significa" tem 5 linhas com os textos próprios de Briga, e a linha "•••" está destacada

#### Scenario: Habilidades com níveis distintos
- **WHEN** o painel abre para "Briga" e depois para "Finanças", ambas com 2 pontos
- **THEN** o texto da linha "••" de Briga é diferente do texto da linha "••" de Finanças

#### Scenario: Toda habilidade catalogada
- **WHEN** o painel abre para qualquer habilidade de `SKILL_GROUPS`
- **THEN** a lista tem exatamente 5 linhas, todas com texto não vazio

#### Scenario: Conteúdo oficial V5 para todas as habilidades
- **WHEN** o painel abre para qualquer uma das 27 habilidades do V5 (ex.: "Atletismo", "Investigação", "Medicina", "Ofícios")
- **THEN** a descrição contém a tradução detalhada do livro V5, as especialidades comuns listam as opções oficiais do livro e a lista tem 5 níveis não vazios com a progressão oficial de competência de 1 a 5 pontos

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

#### Scenario: Mérito por alias
- **WHEN** o painel abre para o defeito "Vegano" com 2 pontos
- **THEN** a descrição é a de "Fazendeiro" e a nota traz "Original: Farmer · Corebook"

#### Scenario: Mérito de custo fixo sem lista
- **WHEN** o painel abre para a vantagem "Bonito" com 2 pontos
- **THEN** o painel mostra a descrição de Bonito e não mostra a lista "O que cada ponto significa"

#### Scenario: Pré-requisito no painel
- **WHEN** o painel abre para "Zerado"
- **THEN** o painel traz a linha "Exige Máscara ••"
