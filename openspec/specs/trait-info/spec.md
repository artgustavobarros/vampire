# trait-info Specification

## Purpose
Painel lateral (Sheet) que explica atributos, habilidades, disciplinas, poderes, méritos e estados, com o nível atual destacado, seus gatilhos e o hover sem sublinhado.
## Requirements
### Requirement: Painel lateral de descrição
O app SHALL oferecer um painel de descrição construído com o `Sheet` shadcn, aberto pela direita, com 400px de largura (`max-width: 92vw`), altura total, fundo Vellum `#F4F3F0`, filete esquerdo de 1px e fundo escurecido `rgba(0,0,0,.55)`. Quando o conteúdo tem tabelas, a largura MUST ser 760px (mantendo `max-width: 92vw`). O painel MUST fechar no ×, com clique fora ou com Esc, e MUST entrar deslizando 24px da direita em 200ms, declarada com classes Tailwind no componente (sem keyframes no CSS global). A estrutura MUST ser: kicker (rótulo Karla), título (Cormorant 600 32px), selo do valor atual (fundo tinta, rótulo branco, omitido quando vazio), descrição (Cormorant 18px renderizada em elementos `<p>` nativos com `whitespace-pre-line`), título da lista e lista de níveis (omitidos quando a lista é vazia), tabelas, e nota (Cormorant 16px suave, omitida quando vazia). O painel MUST NOT depender de parsers externos ou regex de markdown customizados (`rich-text.tsx`). Só um painel MUST existir por vez.

Em telas que casam com `(max-width: 640px)`, o painel MUST abrir de baixo para cima (`side="bottom"` do mesmo `Sheet`), com largura total da tela (sem as larguras de 400px/760px nem o `max-width: 92vw`), altura máxima de 85% da altura visível (`85dvh`), rolagem vertical própria, filete superior de 1px no lugar do filete esquerdo, cantos retos e espaço inferior para a área segura do aparelho. Nessa variante o painel MUST NOT usar o deslize de 24px da direita. A escolha da posição MUST acontecer no cliente pela media query, e fora do navegador (SSR) o painel MUST assumir a variante lateral. Fechar no ×, com toque fora ou com Esc MUST continuar valendo; o painel MUST NOT depender de gesto de arrastar nem de bibliotecas de drawer.

Cada tabela MUST ter um título (rótulo Karla), filete superior, rolagem horizontal própria quando não cabe (sem rolagem horizontal da página), cabeçalho em Karla 700 11px maiúsculo com filete inferior, e células em Cormorant 15px com quebra de linha preservada. A primeira coluna e a linha destacada MUST usar peso 700. A linha destacada MUST ter fundo `#FFFFFF` e filete inferior tinta; as demais, fundo transparente e filete `rgba(13,13,13,.1)`.

#### Scenario: Fechar com Esc
- **WHEN** o painel está aberto e o usuário pressiona Esc
- **THEN** o painel fecha e o foco volta ao gatilho

#### Scenario: Título acessível
- **WHEN** o painel abre para "Força"
- **THEN** o diálogo tem nome acessível "Força"

#### Scenario: Painel largo com tabela
- **WHEN** o painel abre para "Potência de Sangue" numa tela com mais de 640px
- **THEN** o painel tem 760px de largura e a tabela rola na horizontal em telas estreitas

#### Scenario: Painel estreito sem tabela
- **WHEN** o painel abre para "Força" numa tela com mais de 640px
- **THEN** o painel tem 400px de largura

#### Scenario: Painel de baixo em tela estreita
- **WHEN** a tela casa com `(max-width: 640px)` e o painel abre para "Força"
- **THEN** o painel sobe da borda inferior com largura total, altura máxima de 85dvh e filete superior, sem as classes de 400px nem o deslize da direita

#### Scenario: Tabela no painel de baixo
- **WHEN** a tela casa com `(max-width: 640px)` e o painel abre para "Potência de Sangue"
- **THEN** o painel ocupa a largura total (sem 760px) e a tabela rola na horizontal dentro dele, sem rolagem horizontal da página

#### Scenario: Exatamente 640px
- **WHEN** a janela tem exatamente 640px de largura e o painel abre
- **THEN** o painel abre de baixo

#### Scenario: Fechar tocando fora na tela estreita
- **WHEN** a tela casa com `(max-width: 640px)`, o painel está aberto e o usuário toca no fundo escurecido
- **THEN** o painel fecha

### Requirement: Nível atual destacado
Cada linha da lista de níveis SHALL mostrar o marcador (pontos `•`, número ou símbolo) e o texto. A linha que corresponde ao valor atual do personagem MUST ter fundo `#FFFFFF` e filete tinta; as demais, fundo transparente e filete `rgba(13,13,13,.1)`.

#### Scenario: Atributo com 3 pontos
- **WHEN** o personagem tem Força 3 e o painel de Força é aberto
- **THEN** o selo mostra "3 pontos" e a linha "•••" está destacada

#### Scenario: Traço zerado
- **WHEN** a habilidade Ocultismo é 0
- **THEN** o selo mostra "Sem treino" e nenhuma linha está destacada

### Requirement: Conteúdo por tipo de traço
O conteúdo do painel SHALL ser montado por uma função pura a partir do tipo, da chave e da ficha, usando os catálogos canônicos em `data/trait-info.ts` e `data/merits.ts`:
- **Atributo**: kicker "Atributo <grupo no singular>", descrição saneada de erros ortográficos e os 5 níveis próprios do atributo.
- **Habilidade**: kicker "Habilidade <grupo no singular>", descrição, lista "O que cada ponto significa" com os 5 níveis (• a •••••) próprios da habilidade e o nível atual destacado, e nota "Especialidades comuns: …". O texto de cada nível MUST ser o texto próprio daquela habilidade para aquele ponto; MUST NOT existir escala genérica compartilhada entre habilidades. Todas as 27 habilidades MUST ter descrições completas, lista canônica de especialidades e os 5 níveis descritivos derivados e traduzidos do livro oficial de regras V5 (Vampiro: A Máscara 5ª Edição).
- **Disciplina**: kicker "Disciplina", descrição resolvida por nome canônico (`Dominação`, `Proteanismo`, `Alquimia de Sangue-ralo`) com suporte a variantes legadas (`Domínio`, `Protean`, `Alquimia de Sangue-fraco`), níveis 1–5 com os poderes do catálogo em cada nível e nota sobre limite por nível; selo "Nível N".
- **Poder**: kicker "<Disciplina> · nível N", descrição do catálogo (ou a registrada), lista "Rolagem, custo e duração" com as linhas Rolagem, Custo e Duração, e nota "Este poder exige Rouse Check." quando aplicável. A Rolagem MUST ser extraída da descrição do catálogo quando ela cita "Atributo + Disciplina" (com "de <X>" e "vs. …"/"contra …" opcionais), e essa frase MUST sair da descrição (se a descrição ficar vazia, usa a original). Sem citação, a Rolagem MUST ser "Sem teste: efeito passivo, sempre ativo." quando a duração é "Passiva", ou "Sem teste: o efeito acontece ao ativar." nos demais casos. Poder fora do catálogo não tem lista.
- **Geração** e **Potência de Sangue**: kicker "Sangue", sem lista de níveis, e uma tabela "Potência de Sangue" com uma linha por Potência (0 a 10) e as colunas Potência, Surto de Sangue, Dano recuperado (por Checagem de Sangue), Bônus de poder de Disciplina, Rerrolagem de Checagem para Disciplinas, Gravidade da Perdição e Penalidade de alimentação.
- **Vantagem/Defeito**: consulta prioritariamente o catálogo `data/merits.ts` através de `findMerit(name)` e fallback para nomes comuns em `MERIT_INFO`; lista "O que cada ponto significa" com os 5 níveis (• a •••••) e o nível atual destacado quando aplicável. Para méritos e defeitos de Sangue-ralo, exibe a regra oficial completa da característica. Para mérito fora do catálogo, usa a escala genérica de vantagem ou de defeito, com o texto de fora do catálogo como descrição.
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

### Requirement: Gatilhos do painel
O painel SHALL abrir a partir de: o nome de cada atributo e habilidade (ficha e assistente); cada selo de especialidade na seção Habilidades da aba Ficha; um botão **?** de 40×40px ao lado do nome de cada disciplina; a linha de cada poder na aba Disciplinas; o nome de cada poder nos cartões dos passos 5 e 6 do assistente; um botão **?** em cada linha de vantagem/defeito do passo 7; o nome de cada vantagem e defeito no painel "Vantagens & Defeitos" da aba Resumo (passando tipo e pontos atuais); os rótulos dos blocos Fome, Humanidade, Vitalidade, Força de Vontade, Ressonância e Potência de Sangue (este último no rodapé preto da aba Resumo); os títulos da Perdição e da Compulsão do clã no passo 1 do assistente; o rótulo da Geração no passo 1; e os rótulos "Vitalidade" e "Força de Vontade" da linha de derivados do passo 2 do assistente, com o selo "Máximo N" calculado a partir dos atributos atuais do formulário. O passo 5 MUST NOT ter gatilhos de Geração nem de Potência de Sangue. Todo gatilho MUST ser um `<button>` acessível por teclado, e um gatilho dentro de um cartão selecionável MUST NOT alternar a seleção do cartão.

#### Scenario: Abrir pelo nome
- **WHEN** o usuário clica em "Manipulação" na aba Ficha
- **THEN** o painel de Manipulação abre sem alterar os pontos

#### Scenario: Selo de especialidade
- **WHEN** o usuário clica no selo "Direito" abaixo de Erudição na aba Ficha
- **THEN** o painel da especialidade "Direito" abre sem alterar os pontos de Erudição

#### Scenario: Nome do mérito na aba Resumo
- **WHEN** o usuário clica em "Recursos" (3 pontos) no painel Vantagens & Defeitos
- **THEN** o painel lateral abre pela direita com o kicker "Vantagem", o selo "3 pontos", os textos de Recursos para cada ponto e a linha "•••" destacada, sem alterar os pontos

#### Scenario: Botão de disciplina
- **WHEN** o usuário toca no **?** ao lado de "Presença"
- **THEN** o painel mostra os poderes de Presença por nível com o nível atual destacado

#### Scenario: Linha de poder na aba Disciplinas
- **WHEN** o usuário toca na linha do poder "Compelir" na aba Disciplinas
- **THEN** o painel do poder "Compelir" abre pela direita

#### Scenario: Título da Compulsão
- **WHEN** o clã "Toreador" está escolhido no passo 1 e o usuário clica em "Obsessão"
- **THEN** o painel abre com o kicker "Compulsão · Toreador"

#### Scenario: Rótulo da Geração no passo 1
- **WHEN** o usuário clica no rótulo "Geração" no passo 1
- **THEN** o painel da Geração abre e o seletor de Geração não muda

#### Scenario: Potência de Sangue na aba Resumo
- **WHEN** o usuário clica em "Potência de Sangue" no rodapé preto da aba Resumo
- **THEN** o painel da Potência de Sangue abre com a tabela do livro e a linha do personagem destacada

#### Scenario: Nome do poder em cartão selecionado
- **WHEN** o poder "Compelir" está selecionado no passo 5 e o usuário clica no nome dele
- **THEN** o painel do poder abre e "Compelir" continua selecionado

#### Scenario: Nome do poder do Predador
- **WHEN** o usuário clica no nome "Toque Letal" num cartão do painel "Poder do Predador" no passo 6
- **THEN** o painel do poder abre e o poder do Predador escolhido não muda

#### Scenario: Vitalidade no passo 2
- **WHEN** o assistente está no passo 2 com Vigor 3 e o usuário clica em "Vitalidade" na linha de derivados
- **THEN** o painel da Vitalidade abre pela direita com o selo "Máximo 6" e os atributos não mudam

#### Scenario: Força de Vontade no passo 2
- **WHEN** o assistente está no passo 2 com Autocontrole 2 e Determinação 3 e o usuário clica em "Força de Vontade" na linha de derivados
- **THEN** o painel da Força de Vontade abre pela direita com o selo "Máximo 5" e os atributos não mudam

### Requirement: Hover dos gatilhos
Os gatilhos de texto SHALL aparecer sem sublinhado e, no hover, mudar para Blood `#7A1220` com `transition: color .15s ease` e cursor de ponteiro. Sobre fundo tinta (painel de Potência de Sangue), o hover MUST usar Ember `#E8535F`.

#### Scenario: Hover em atributo
- **WHEN** o ponteiro passa sobre "Força"
- **THEN** o texto fica `#7A1220` sem sublinhado

#### Scenario: Hover sobre fundo tinta
- **WHEN** o ponteiro passa sobre "Potência de Sangue" no painel escuro
- **THEN** o texto fica `#E8535F`

### Requirement: Painel de especialidade
O painel de descrição SHALL ter o tipo **Especialidade**, montado pela função pura a partir do nome da especialidade, da habilidade e do nível atual da habilidade:
- kicker "Especialidade · <Habilidade>";
- título com o nome da especialidade;
- selo "<Habilidade> N" com o nível atual da habilidade;
- descrição "Um foco dentro de <Habilidade>. Quando a rolagem de <Habilidade> se encaixa nesta especialidade, some 1 dado à parada.";
- sem lista de níveis e sem tabelas.

O painel MUST NOT ter nota nem formulário, inclusive para a especialidade do Predador.

#### Scenario: Especialidade comum
- **WHEN** o painel abre para "Direito" de Erudição com Erudição 1
- **THEN** o kicker é "Especialidade · Erudição", o título é "Direito", o selo é "Erudição 1", a descrição é a de foco em Erudição e não há formulário

#### Scenario: Especialidade do Predador
- **WHEN** o Predador é "Extorsionário", a ficha tem Intimidação 3 e o painel abre para a especialidade "Chantagem" do Predador
- **THEN** o selo é "Intimidação 3", a descrição é a de foco em Intimidação, e não há nota do Predador nem campo "Nome da especialidade"

