## MODIFIED Requirements

### Requirement: Conteúdo por tipo de traço
O conteúdo do painel SHALL ser montado por uma função pura a partir do tipo, da chave e da ficha, usando o catálogo em `data/trait-info.ts`:
- **Atributo**: kicker "Atributo <grupo no singular>", descrição e os 5 níveis próprios do atributo.
- **Habilidade**: kicker "Habilidade <grupo no singular>", descrição, escala novato→mestre e nota "Especialidades comuns: …".
- **Disciplina**: kicker "Disciplina", descrição (ou texto de fora do catálogo), níveis 1–5 com os poderes do catálogo em cada nível e nota sobre limite por nível; selo "Nível N".
- **Poder**: kicker "<Disciplina> · nível N", descrição do catálogo (ou a registrada), lista "Rolagem, custo e duração" com as linhas Rolagem, Custo e Duração, e nota "Este poder exige Rouse Check." quando aplicável. A Rolagem MUST ser extraída da descrição do catálogo quando ela cita "Atributo + Disciplina" (com "de <X>" e "vs. …"/"contra …" opcionais), e essa frase MUST sair da descrição (se a descrição ficar vazia, usa a original). Sem citação, a Rolagem MUST ser "Sem teste: efeito passivo, sempre ativo." quando a duração é "Passiva", ou "Sem teste: o efeito acontece ao ativar." nos demais casos. Poder fora do catálogo não tem lista.
- **Geração**: kicker "Sangue", título "Geração", descrição sobre a distância de Caim e o que a Geração define, selo "<geração> · Potência N" (ou "Sem Geração"), lista "Geração e Potência de Sangue" com uma linha por Geração (16ª a 4ª) no formato "Potência de Sangue N · <categoria>" e a Geração do personagem destacada, e nota "Personagens iniciantes normalmente são da 12ª ou 13ª Geração. Gerações mais baixas só com permissão do Narrador.". Categorias: 16ª–14ª Sangue-ralo, 13ª–12ª Neófito, 11ª–10ª Ancilla, 9ª–8ª Ancião, 7ª–6ª Ancião poderoso, 5ª–4ª Matusalém.
- **Vantagem/Defeito**: reconhece nomes comuns por prefixo, sem diferenciar maiúsculas; escala por ponto de vantagem ou de defeito; texto de fora do catálogo quando não reconhecido. Qualidade SR MUST ser tratada como Vantagem e Defeito SR como Defeito.
- **Perdição do clã**: kicker "Perdição · <clã>", título com o nome da Perdição, descrição completa do catálogo `CLAN_FULL`, selo "Gravidade N" (Gravidade da Perdição da Potência de Sangue informada pelo gatilho), lista "Regra e rolagem" com os pares rótulo/texto e `{G}` trocado pela Gravidade, e nota "A Gravidade da Perdição vem da Potência de Sangue (atual: N).".
- **Compulsão do clã**: kicker "Compulsão · <clã>", título com o nome da Compulsão, descrição completa, lista "Regra e rolagem" (Efeito, Termina) e nota sobre falha bestial ("Compulsões surgem numa falha bestial (1 em dado de Fome numa falha). Você pode escolher a Compulsão do clã ou rolar na tabela geral."); sem selo.
- Para clãs sem entrada em `CLAN_FULL` (Caitiff, Sangue Fraco), Perdição e Compulsão MUST usar o texto curto do clã, sem selo, sem lista e sem nota.
- **Estados** (Fome, Humanidade, Vitalidade, Força de Vontade, Ressonância, Potência de Sangue): níveis, tipos de dano ou humores, com destaque do valor atual para Fome e Humanidade.

#### Scenario: Disciplina fora do catálogo
- **WHEN** o painel abre para uma disciplina chamada "Serpentis"
- **THEN** a descrição é "Disciplina fora do catálogo. Registre os poderes à mão." e cada nível mostra "Sem poderes catalogados neste nível."

#### Scenario: Mérito por prefixo
- **WHEN** o painel abre para a vantagem "Recursos (herança)"
- **THEN** o título é "Recursos (herança)" e a descrição é a de Recursos

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
- **THEN** o selo mostra "12ª · Potência 1" e a linha "12ª" diz "Potência de Sangue 1 · Neófito" destacada

#### Scenario: Geração não escolhida
- **WHEN** o painel da Geração abre sem geração escolhida
- **THEN** o selo mostra "Sem Geração" e nenhuma linha fica destacada

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
- **THEN** o kicker é "Defeito" e a escala é a de defeitos

### Requirement: Gatilhos do painel
O painel SHALL abrir a partir de: o nome de cada atributo e habilidade (ficha e assistente); um botão **?** de 40×40px ao lado do nome de cada disciplina; o link "Sobre este poder" dentro de um poder expandido; o nome de cada poder nos cartões do passo 5 do assistente; um botão **?** em cada linha de vantagem/defeito do passo 7; os rótulos dos blocos Fome, Humanidade, Vitalidade, Força de Vontade, Ressonância e Potência de Sangue (inclusive o bloco de Potência de Sangue do passo 5); os títulos da Perdição e da Compulsão do clã no passo 1 do assistente; e o rótulo da Geração no passo 1 e no bloco de Potência de Sangue do passo 5. Todo gatilho MUST ser um `<button>` acessível por teclado, e um gatilho dentro de um cartão selecionável MUST NOT alternar a seleção do cartão.

#### Scenario: Abrir pelo nome
- **WHEN** o usuário clica em "Manipulação" na aba Ficha
- **THEN** o painel de Manipulação abre sem alterar os pontos

#### Scenario: Botão de disciplina
- **WHEN** o usuário toca no **?** ao lado de "Presença"
- **THEN** o painel mostra os poderes de Presença por nível com o nível atual destacado

#### Scenario: Título da Compulsão
- **WHEN** o clã "Toreador" está escolhido no passo 1 e o usuário clica em "Obsessão"
- **THEN** o painel abre com o kicker "Compulsão · Toreador"

#### Scenario: Rótulo da Geração no passo 1
- **WHEN** o usuário clica no rótulo "Geração" no passo 1
- **THEN** o painel da Geração abre e o seletor de Geração não muda

#### Scenario: Nome do poder em cartão selecionado
- **WHEN** o poder "Compelir" está selecionado no passo 5 e o usuário clica no nome dele
- **THEN** o painel do poder abre e "Compelir" continua selecionado
