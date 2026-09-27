## ADDED Requirements

### Requirement: Painel lateral de descrição
O app SHALL oferecer um painel de descrição construído com o `Sheet` shadcn, aberto pela direita, com 400px de largura (`max-width: 92vw`), altura total, fundo Vellum `#F4F3F0`, filete esquerdo de 1px e fundo escurecido `rgba(0,0,0,.55)`. O painel MUST fechar no ×, com clique fora ou com Esc, e MUST entrar deslizando 24px da direita em 200ms, declarada com classes Tailwind no componente (sem keyframes no CSS global). A estrutura MUST ser: kicker (rótulo Karla), título (Cormorant 600 32px), selo do valor atual (fundo tinta, rótulo branco, omitido quando vazio), descrição (Cormorant 18px), título da lista e lista de níveis, e nota (Cormorant 16px suave, omitida quando vazia). Só um painel MUST existir por vez.

#### Scenario: Fechar com Esc
- **WHEN** o painel está aberto e o usuário pressiona Esc
- **THEN** o painel fecha e o foco volta ao gatilho

#### Scenario: Título acessível
- **WHEN** o painel abre para "Força"
- **THEN** o diálogo tem nome acessível "Força"

### Requirement: Nível atual destacado
Cada linha da lista de níveis SHALL mostrar o marcador (pontos `•`, número ou símbolo) e o texto. A linha que corresponde ao valor atual do personagem MUST ter fundo `#FFFFFF` e filete tinta; as demais, fundo transparente e filete `rgba(13,13,13,.1)`.

#### Scenario: Atributo com 3 pontos
- **WHEN** o personagem tem Força 3 e o painel de Força é aberto
- **THEN** o selo mostra "3 pontos" e a linha "•••" está destacada

#### Scenario: Traço zerado
- **WHEN** a habilidade Ocultismo é 0
- **THEN** o selo mostra "Sem treino" e nenhuma linha está destacada

### Requirement: Conteúdo por tipo de traço
O conteúdo do painel SHALL ser montado por uma função pura a partir do tipo, da chave e da ficha, usando o catálogo em `data/trait-info.ts`:
- **Atributo**: kicker "Atributo <grupo no singular>", descrição e os 5 níveis próprios do atributo.
- **Habilidade**: kicker "Habilidade <grupo no singular>", descrição, escala novato→mestre e nota "Especialidades comuns: …".
- **Disciplina**: kicker "Disciplina", descrição (ou texto de fora do catálogo), níveis 1–5 com os poderes do catálogo em cada nível e nota sobre limite por nível; selo "Nível N".
- **Poder**: kicker "<Disciplina> · nível N", descrição do catálogo (ou a registrada), custo e duração, e nota "Este poder exige Rouse Check." quando aplicável.
- **Vantagem/Defeito**: reconhece nomes comuns por prefixo, sem diferenciar maiúsculas; escala por ponto de vantagem ou de defeito; texto de fora do catálogo quando não reconhecido.
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

### Requirement: Gatilhos do painel
O painel SHALL abrir a partir de: o nome de cada atributo e habilidade (ficha e assistente); um botão **?** de 40×40px ao lado do nome de cada disciplina; o link "Sobre este poder" dentro de um poder expandido; um botão **?** em cada linha de vantagem/defeito do passo 7; e os rótulos dos blocos Fome, Humanidade, Vitalidade, Força de Vontade, Ressonância e Potência de Sangue. Todo gatilho MUST ser um `<button>` acessível por teclado.

#### Scenario: Abrir pelo nome
- **WHEN** o usuário clica em "Manipulação" na aba Ficha
- **THEN** o painel de Manipulação abre sem alterar os pontos

#### Scenario: Botão de disciplina
- **WHEN** o usuário toca no **?** ao lado de "Presença"
- **THEN** o painel mostra os poderes de Presença por nível com o nível atual destacado

### Requirement: Hover dos gatilhos
Os gatilhos de texto SHALL aparecer sem sublinhado e, no hover, mudar para Blood `#7A1220` com `transition: color .15s ease` e cursor de ponteiro. Sobre fundo tinta (painel de Potência de Sangue), o hover MUST usar Ember `#E8535F`.

#### Scenario: Hover em atributo
- **WHEN** o ponteiro passa sobre "Força"
- **THEN** o texto fica `#7A1220` sem sublinhado

#### Scenario: Hover sobre fundo tinta
- **WHEN** o ponteiro passa sobre "Potência de Sangue" no painel escuro
- **THEN** o texto fica `#E8535F`
