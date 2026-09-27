## MODIFIED Requirements

### Requirement: Conteúdo por tipo de traço
O conteúdo do painel SHALL ser montado por uma função pura a partir do tipo, da chave e da ficha, usando o catálogo em `data/trait-info.ts`:
- **Atributo**: kicker "Atributo <grupo no singular>", descrição e os 5 níveis próprios do atributo.
- **Habilidade**: kicker "Habilidade <grupo no singular>", descrição, escala novato→mestre e nota "Especialidades comuns: …".
- **Disciplina**: kicker "Disciplina", descrição (ou texto de fora do catálogo), níveis 1–5 com os poderes do catálogo em cada nível e nota sobre limite por nível; selo "Nível N".
- **Poder**: kicker "<Disciplina> · nível N", descrição do catálogo (ou a registrada), custo e duração, e nota "Este poder exige Rouse Check." quando aplicável.
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
- **THEN** a lista "Custo e duração" mostra custo e duração e a nota avisa o Rouse Check

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
O painel SHALL abrir a partir de: o nome de cada atributo e habilidade (ficha e assistente); um botão **?** de 40×40px ao lado do nome de cada disciplina; o link "Sobre este poder" dentro de um poder expandido; um botão **?** em cada linha de vantagem/defeito do passo 7; os rótulos dos blocos Fome, Humanidade, Vitalidade, Força de Vontade, Ressonância e Potência de Sangue; e os títulos da Perdição e da Compulsão do clã no passo 1 do assistente. Todo gatilho MUST ser um `<button>` acessível por teclado.

#### Scenario: Abrir pelo nome
- **WHEN** o usuário clica em "Manipulação" na aba Ficha
- **THEN** o painel de Manipulação abre sem alterar os pontos

#### Scenario: Botão de disciplina
- **WHEN** o usuário toca no **?** ao lado de "Presença"
- **THEN** o painel mostra os poderes de Presença por nível com o nível atual destacado

#### Scenario: Título da Compulsão
- **WHEN** o clã "Toreador" está escolhido no passo 1 e o usuário clica em "Obsessão"
- **THEN** o painel abre com o kicker "Compulsão · Toreador"
