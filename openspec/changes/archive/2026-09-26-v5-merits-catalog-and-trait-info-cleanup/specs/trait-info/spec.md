## MODIFIED Requirements

### Requirement: Painel lateral de descrição
O app SHALL oferecer um painel de descrição construído com o `Sheet` shadcn, aberto pela direita, com 400px de largura (`max-width: 92vw`), altura total, fundo Vellum `#F4F3F0`, filete esquerdo de 1px e fundo escurecido `rgba(0,0,0,.55)`. Quando o conteúdo tem tabelas, a largura MUST ser 760px (mantendo `max-width: 92vw`). O painel MUST fechar no ×, com clique fora ou com Esc, e MUST entrar deslizando 24px da direita em 200ms, declarada com classes Tailwind no componente (sem keyframes no CSS global). A estrutura MUST ser: kicker (rótulo Karla), título (Cormorant 600 32px), selo do valor atual (fundo tinta, rótulo branco, omitido quando vazio), descrição (Cormorant 18px renderizada em elementos `<p>` nativos com `whitespace-pre-line`), título da lista e lista de níveis (omitidos quando a lista é vazia), tabelas, e nota (Cormorant 16px suave, omitida quando vazia). O painel MUST NOT depender de parsers externos ou regex de markdown customizados (`rich-text.tsx`). Só um painel MUST existir por vez.

Cada tabela MUST ter um título (rótulo Karla), filete superior, rolagem horizontal própria quando não cabe (sem rolagem horizontal da página), cabeçalho em Karla 700 11px maiúsculo com filete inferior, e células em Cormorant 15px com quebra de linha preservada. A primeira coluna e a linha destacada MUST usar peso 700. A linha destacada MUST ter fundo `#FFFFFF` e filete inferior tinta; as demais, fundo transparente e filete `rgba(13,13,13,.1)`.

#### Scenario: Fechar com Esc
- **WHEN** o painel está aberto e o usuário pressiona Esc
- **THEN** o painel fecha e o foco volta ao gatilho

#### Scenario: Título acessível
- **WHEN** o painel abre para "Força"
- **THEN** o diálogo tem nome acessível "Força"

#### Scenario: Painel largo com tabela
- **WHEN** o painel abre para "Potência de Sangue"
- **THEN** o painel tem 760px de largura e a tabela rola na horizontal em telas estreitas

#### Scenario: Painel estreito sem tabela
- **WHEN** o painel abre para "Força"
- **THEN** o painel tem 400px de largura

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

#### Scenario: Resolução canônica de Dominação
- **WHEN** o painel lateral abre para a disciplina "Dominação"
- **THEN** o painel exibe a descrição canônica da disciplina sem acusar que está fora do catálogo

#### Scenario: Consulta a mérito de Sangue-ralo
- **WHEN** o painel lateral abre para a Qualidade de Sangue-ralo "Bebedor Diurno"
- **THEN** o painel exibe a descrição canônica oficial de regras de exposição à luz solar
