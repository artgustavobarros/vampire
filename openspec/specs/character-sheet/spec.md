# character-sheet Specification

## Purpose
Ficha jogável com abas, edição de traços, disciplinas e poderes, registros, notas e sessões/XP, com salvamento automático.
## Requirements
### Requirement: Estrutura da ficha e navegação
A ficha SHALL ter um cabeçalho com o nome do personagem ("Sem nome" se vazio) e um botão de menu. O cabeçalho MUST NOT mostrar o rótulo da aba atual nem o rótulo "MESTRE": é igual para jogador e Mestre (o contexto do Mestre fica na faixa do Mestre, acima do cabeçalho).

O menu MUST abrir uma gaveta lateral com:
- o nome de usuário do dono da ficha, no formato `@nome_de_usuario`;
- o nome do personagem;
- as abas, com a atual destacada;
- "Conta", que abre a página "Conta" do dono da ficha (`/ficha/conta` para o jogador, `/personagens/<userId>/conta` para o Mestre), destacado quando essa página está aberta;
- "Lista de personagens" (só para o Mestre, em sangue);
- "Sair" (em sangue).

Na ficha do jogador (`/ficha/<aba>`), as abas MUST ser, nesta ordem: Características, Disciplinas & Sangue, Ações, Coterie, Rodada, Biografia, Rolagens e, se habilitado, Sessões & XP. Na ficha de um jogador aberta pelo Mestre (`/personagens/<userId>/<aba>`), as abas MUST ser as mesmas sem Coterie e Rodada, que o Mestre acompanha pelo painel. O menu MUST NOT ter "Refazer personagem".

A aba atual MUST ser refletida na URL: `/ficha/<aba>` para o jogador e `/personagens/<userId>/<aba>` para o Mestre. Ids de aba:

| Aba | Id |
|---|---|
| Biografia | `resumo` |
| Rolagens | `rolagens` |
| Coterie | `coterie` |
| Rodada | `rodada` |

O endereço `conta` MUST abrir a página "Conta" dentro do layout da ficha (cabeçalho, menu e barra inferior), e não ser tratado como aba.

Redirecionamentos, sempre substituindo a entrada do histórico:
- os endereços antigos `registros`, `ficha`, `disciplinas` e `notas` MUST ir para `resumo`, `caracteristicas`, `disciplinas-e-sangue` e `rolagens`;
- qualquer outro endereço de aba desconhecido, incluindo `coterie` e `rodada` na ficha aberta pelo Mestre, MUST ir para `caracteristicas`.

#### Scenario: Trocar de aba pelo menu
- **WHEN** o jogador abre o menu e escolhe "Biografia"
- **THEN** a gaveta fecha, a URL passa a ser `/ficha/resumo` e o conteúdo da aba Biografia é exibido

#### Scenario: Cabeçalho do jogador
- **WHEN** o jogador está na aba Ações
- **THEN** o cabeçalho mostra só o nome do personagem e o botão de menu, sem "Ações" nem "MESTRE"

#### Scenario: Cabeçalho do Mestre
- **WHEN** o Mestre abre a ficha de um jogador
- **THEN** o cabeçalho mostra só o nome do personagem e o botão de menu, sem o rótulo "MESTRE"

#### Scenario: Menu do jogador
- **WHEN** o jogador `vitoria_salles` abre o menu
- **THEN** a gaveta mostra `@vitoria_salles`, as abas (com "Coterie", "Rodada" e "Rolagens", sem "Notas"), "Conta" e "Sair", sem "Lista de personagens" e sem "Refazer personagem"

#### Scenario: Menu do Mestre
- **WHEN** o Mestre abre o menu na ficha do jogador `ana_s`
- **THEN** a gaveta mostra `@ana_s`, as abas sem "Coterie" e sem "Rodada", "Conta", "Lista de personagens" e "Sair", nessa ordem

#### Scenario: Abrir a conta pelo menu
- **WHEN** o jogador escolhe "Conta" no menu
- **THEN** a gaveta fecha, a URL passa a ser `/ficha/conta` e a página "Conta" é exibida no layout da ficha

#### Scenario: Mestre abre a conta do jogador pelo menu
- **WHEN** o Mestre, na ficha do jogador `userId`, escolhe "Conta" no menu
- **THEN** a URL passa a ser `/personagens/<userId>/conta` e a página mostra a conta desse jogador

#### Scenario: Mestre tenta abrir a aba Rodada de uma ficha
- **WHEN** o Mestre acessa `/personagens/<userId>/rodada`
- **THEN** a URL passa a ser `/personagens/<userId>/caracteristicas`

#### Scenario: Link antigo de Registros
- **WHEN** o usuário acessa `/ficha/registros`
- **THEN** a URL passa a ser `/ficha/resumo` e a aba Biografia é exibida

#### Scenario: Link antigo de Notas
- **WHEN** o usuário acessa `/ficha/notas`
- **THEN** a URL passa a ser `/ficha/rolagens` e a aba Rolagens é exibida

#### Scenario: Fechar menu pelo fundo
- **WHEN** o usuário clica no fundo escurecido
- **THEN** a gaveta fecha sem mudar de aba

#### Scenario: Link direto para aba
- **WHEN** o jogador recarrega a página estando na aba Rodada
- **THEN** a ficha reabre na aba Rodada

#### Scenario: Link direto para a conta
- **WHEN** o jogador recarrega a página em `/ficha/conta`
- **THEN** a página "Conta" reabre, sem redirecionar para `caracteristicas`

### Requirement: Barra inferior fixa
Enquanto a ficha estiver aberta, o app SHALL exibir uma barra fixa no rodapé, em qualquer aba, com fundo tinta e filete superior sangue. O botão "Checagem de sangue" MUST ficar centralizado como uma aba sangue que se sobrepõe ao filete superior da barra e MUST abrir o diálogo de Checagem de sangue. Abaixo dele, a barra SHALL mostrar três blocos lado a lado: à esquerda "Vitalidade", no centro "Fome" com o valor atual e à direita "Vontade". Os blocos de Vitalidade e Vontade MUST ter borda clara e mostrar as caixas de dano da trilha (máx. Vigor + 3 e máx. Autocontrole + Determinação), clicáveis no ciclo vazio → superficial → agravado → vazio, gravando na ficha. Os rótulos "Vitalidade" e "Vontade" MUST abrir o painel de informação da trilha. Abaixo de 640px (breakpoint `sm` do Tailwind), os três blocos MUST ficar empilhados em coluna, na ordem Vitalidade, Fome, Vontade, e o botão "Checagem de sangue" MUST continuar na mesma posição sobre o filete. As caixas MUST quebrar linha e ficar centralizadas quando não couberem. A barra MUST NOT ter o botão "Dormir". O conteúdo da página MUST ter espaço inferior suficiente para não ficar escondido atrás da barra. Estilos MUST ser classes Tailwind no JSX.

Abaixo de 640px, a barra SHALL começar recolhida: uma linha única, centralizada, com "VIT x/y", "FOME n" (na cor brasa) e "VONT x/y", onde `x` é o número de caixas vazias da trilha e `y` o máximo, e uma seta para cima à direita. A linha recolhida inteira MUST ser um botão com `aria-expanded="false"` que expande a barra. Recolhida, a barra MUST NOT mostrar o botão "Checagem de sangue" nem os blocos. Expandida, a barra MUST mostrar o formato completo descrito acima e um botão de seta para baixo, com `aria-expanded="true"`, que a recolhe. Os valores da linha recolhida MUST refletir a ficha em tempo real. O estado recolhido/expandido MUST NOT ser gravado na ficha. A partir de 640px, a barra MUST ficar sempre no formato completo, sem linha recolhida nem botão de recolher. No celular, o espaço inferior da página MUST corresponder à altura da barra recolhida; expandida, a barra MAY cobrir o conteúdo.

#### Scenario: Fome visível
- **WHEN** a Fome é 3
- **THEN** a barra inferior mostra "Fome" e "3" em qualquer aba

#### Scenario: Trilhas na barra
- **WHEN** a ficha tem Vigor 2, Autocontrole 2 e Determinação 3 e o usuário está na aba Rolagens
- **THEN** a barra inferior mostra "Vitalidade" com 5 caixas e "Vontade" com 5 caixas

#### Scenario: Ciclo da caixa de dano
- **WHEN** o usuário toca repetidamente numa caixa de Vitalidade vazia na barra inferior
- **THEN** ela passa por vazio → `/` superficial → `✕` agravado → vazio e cada estado é gravado na ficha

#### Scenario: Máximo acompanha atributo
- **WHEN** Vigor sobe de 2 para 3
- **THEN** a Vitalidade da barra passa a ter 6 caixas, preservando as marcas existentes

#### Scenario: Barra em coluna no celular
- **WHEN** a ficha é aberta numa tela de 390px de largura e o usuário expande a barra
- **THEN** a barra mostra "Checagem de sangue" centralizado sobre o filete e, abaixo, Vitalidade, Fome e Vontade empilhados nessa ordem

#### Scenario: Checagem de sangue pela barra
- **WHEN** o usuário clica "Checagem de sangue" na barra inferior
- **THEN** o diálogo de Checagem de sangue abre

#### Scenario: Sem Dormir na barra
- **WHEN** a ficha está aberta
- **THEN** a barra inferior não mostra o botão "Dormir"

#### Scenario: Informação da trilha
- **WHEN** o usuário toca no rótulo "Vontade" da barra
- **THEN** o painel de informação de Força de Vontade abre

#### Scenario: Barra recolhida no celular
- **WHEN** a ficha é aberta numa tela de 390px de largura, com Vigor 2, Autocontrole 2, Determinação 3, Fome 1 e nenhum dano
- **THEN** a barra mostra só a linha "VIT 5/5  FOME 1  VONT 5/5" com a seta para cima, sem "Checagem de sangue" nem caixas

#### Scenario: Resumo conta caixas vazias
- **WHEN** a barra está recolhida e a Vitalidade (máx. 5) tem 1 caixa superficial e 1 agravada
- **THEN** a linha recolhida mostra "VIT 3/5"

#### Scenario: Expandir a barra
- **WHEN** a barra está recolhida numa tela de 390px e o usuário toca na linha
- **THEN** a barra sobe no formato completo, com "Checagem de sangue", os três blocos e a seta para baixo

#### Scenario: Recolher a barra
- **WHEN** a barra está expandida numa tela de 390px e o usuário toca na seta para baixo
- **THEN** a barra volta para a linha recolhida

#### Scenario: Desktop sempre expandido
- **WHEN** a ficha é aberta numa tela de 1024px de largura
- **THEN** a barra mostra o formato completo, sem linha recolhida nem seta de recolher

### Requirement: Aba Ficha
A aba SHALL exibir os atributos e habilidades com `DotRating`, Fome como 5 pontos clicáveis, Humanidade com 10 caixas e botões "− Nível"/"+ Nível" (limitados a 0–10), e Ressonância com tipo e intensidade selecionáveis. A aba MUST NOT exibir os painéis de Vitalidade e Força de Vontade; essas trilhas ficam na barra inferior fixa. A aba MUST NOT exibir os campos de identificação (Nome, Conceito, Crônica, Predador, Ambição, Clã, Senhor, Desejo, Geração); eles ficam na aba Resumo.

#### Scenario: Sem painel de identificação
- **WHEN** o usuário abre a aba Ficha
- **THEN** não há campos "Nome", "Clã" nem os demais campos de identificação, e o primeiro bloco da aba é o de Atributos/Habilidades

#### Scenario: Sem painéis de trilha
- **WHEN** o usuário abre a aba Ficha
- **THEN** a área de conteúdo da aba não mostra painéis de Vitalidade nem de Força de Vontade

#### Scenario: Marcar mancha
- **WHEN** o usuário toca numa caixa de Humanidade
- **THEN** a caixa alterna a marca de mancha `✕` e a contagem de manchas é atualizada

### Requirement: Especialidades na aba Ficha
Na seção Habilidades da aba Ficha, cada habilidade SHALL exibir abaixo do seu nome as suas especialidades lado a lado numa linha que quebra quando não cabe, cada uma num selo com borda e texto tinta. A lista SHALL juntar as especialidades gravadas para a habilidade no assistente e a especialidade do Predador ("Habilidade (Especialidade)"), sem textos vazios e sem repetições. O selo do Predador MUST usar `predEspecNome` quando a ficha o tem preenchido e, senão (fichas antigas), o nome da lista do Predador. Os pontos da habilidade SHALL continuar na linha do nome. Habilidade sem especialidade SHALL ser exibida sem selos.

Cada selo MUST ser um gatilho (`<button>`) que abre o painel de especialidade (ver trait-info, "Painel de especialidade") sem alterar os pontos. A especialidade do Predador MUST NOT ter estilo, nota ou formulário próprios na ficha: o nome é definido no passo 6 do assistente (ver character-wizard, "Nome da especialidade do Predador") e, para mudá-lo, o jogador refaz o assistente.

#### Scenario: Especialidades do assistente
- **WHEN** a ficha tem Persuasão 4 com as especialidades "Negociação" e "Sedução"
- **THEN** a linha de Persuasão mostra os 4 pontos ao lado do nome e, abaixo do nome, os selos "Negociação" e "Sedução" lado a lado, com borda tinta

#### Scenario: Especialidade do Predador renomeada no assistente
- **WHEN** a ficha tem `predEspec: "Ofícios (Armadilhas)"` e `predEspecNome: "Laços e arapucas"`
- **THEN** a linha de Ofícios mostra o selo "Laços e arapucas" com borda e texto tinta

#### Scenario: Ficha antiga sem nome gravado
- **WHEN** a ficha tem `predEspec: "Intimidação (Chantagem)"` sem `predEspecNome`
- **THEN** a linha de Intimidação mostra o selo "Chantagem" com borda e texto tinta

#### Scenario: Selo do Predador sem formulário
- **WHEN** o usuário abre o selo da especialidade do Predador
- **THEN** o painel mostra a descrição da especialidade sem nota do Predador e sem formulário de renomear

#### Scenario: Sem repetição
- **WHEN** a mesma especialidade vem do assistente e do Predador para a mesma habilidade
- **THEN** o selo aparece uma só vez

#### Scenario: Habilidade sem especialidade
- **WHEN** Briga não tem especialidades
- **THEN** a linha de Briga não mostra selos

### Requirement: Aba Disciplinas
A aba SHALL listar as disciplinas com nome editável, nível por `DotRating`, botão **?** que abre o painel de descrição (ver `trait-info`) e remoção, e seus poderes como linhas (nível, nome, resumo da descrição). Tocar na linha de um poder MUST abrir o painel lateral direito do poder (ver `trait-info`), com a descrição gravada do poder quando ele não está no catálogo; a linha MUST NOT expandir nem mostrar editor em linha. A linha MUST NOT ter botão para remover o poder. Um diálogo "Adicionar disciplina ou poder" MUST oferecer disciplinas sugeridas (existentes e do clã) ou nome livre, e opcionalmente um poder com nível, custo e descrição.

#### Scenario: Estado vazio
- **WHEN** não há disciplinas
- **THEN** aparece "Nenhuma disciplina registrada" com a orientação e o botão "+ Adicionar disciplina ou poder"

#### Scenario: Adicionar poder a disciplina existente
- **WHEN** o usuário escolhe "Presença" (já na ficha) e informa o poder "Temor" nível 1
- **THEN** o poder é acrescentado à disciplina Presença existente, sem duplicar a disciplina

#### Scenario: Adicionar sem nome
- **WHEN** o usuário confirma sem escolher nem digitar uma disciplina
- **THEN** um toast de erro "Selecione ou digite uma disciplina." aparece, o diálogo continua aberto, nenhum texto de erro é renderizado dentro do diálogo e nada é salvo

#### Scenario: Linha do poder abre o painel
- **WHEN** Domínio tem o poder "Compelir" e o usuário toca na linha dele
- **THEN** o painel lateral abre pela direita com o kicker "Domínio · nível 1", o título "Compelir", a descrição e a lista de rolagem, custo e duração, e nenhum editor aparece dentro do cartão da disciplina

#### Scenario: Poder fora do catálogo
- **WHEN** a disciplina "Necromancia" tem o poder "Sussurros" com descrição "Fala com os mortos" e o usuário toca na linha
- **THEN** o painel lateral mostra "Sussurros" com a descrição "Fala com os mortos"

#### Scenario: Linha do poder sem remoção
- **WHEN** Domínio tem o poder "Compelir"
- **THEN** a linha de "Compelir" não mostra o botão "×" nem outro controle para remover o poder

### Requirement: Painel Vantagens & Defeitos
A aba Resumo SHALL exibir o painel "Vantagens & Defeitos" montado a partir de `meritos` da ficha, com duas colunas (uma no celular): "Vantagens", com os méritos do tipo vantagem e Qualidade SR, e "Defeitos", com os do tipo defeito e Defeito SR, na ordem gravada. Cada coluna MUST seguir o estilo do grid de habilidades: título do grupo (rótulo Karla, cor suave) com filete inferior e uma linha por mérito com filete suave, nome em Cormorant à esquerda e 5 pontos à direita. Méritos com nome vazio MUST NOT aparecer. Coluna sem méritos MUST mostrar "Nenhuma vantagem." ou "Nenhum defeito." em texto suave. Os pontos MUST ser editáveis como nas habilidades (clicar no valor atual diminui 1) e MUST gravar `pontos` do mérito correspondente, mantendo os demais campos (`tipo`, `nome`, `origem`). Estilos MUST ser classes Tailwind no JSX.

#### Scenario: Méritos nas colunas
- **WHEN** a ficha tem Recursos 3, Influência 2 e Máscara 2 como vantagens e Inimigo 2 como defeito
- **THEN** a coluna Vantagens lista Recursos, Influência e Máscara com 3, 2 e 2 pontos marcados, e a coluna Defeitos lista Inimigo com 2 pontos

#### Scenario: Qualidade e Defeito SR
- **WHEN** um Sangue Fraco tem uma "Qualidade SR" e um "Defeito SR"
- **THEN** a qualidade aparece em Vantagens e o defeito em Defeitos

#### Scenario: Editar pontos
- **WHEN** o usuário clica no 4º ponto de Recursos (3 pontos) e recarrega a página
- **THEN** Recursos continua com 4 pontos e o tipo e o nome não mudam

#### Scenario: Sem defeitos
- **WHEN** a ficha não tem nenhum defeito com nome
- **THEN** a coluna Defeitos mostra "Nenhum defeito."

### Requirement: Aba Sessões & XP
Quando habilitada, a aba SHALL mostrar XP total e gasto (editáveis), XP disponível (total − gasto), noites vividas e um registro de sessões (data, XP, resumo) com o botão "+ Sessão".

#### Scenario: XP disponível
- **WHEN** XP total é 20 e gasto é 12
- **THEN** "Disponível" mostra 8

#### Scenario: Nova sessão
- **WHEN** o usuário clica "+ Sessão"
- **THEN** uma nova linha vazia é adicionada ao registro

### Requirement: Salvamento automático
Toda edição na ficha SHALL ser gravada na API (`PATCH /me/sheet`) sem ação explícita do usuário. Se a gravação falhar, o app MUST avisar com o toast persistente "Não salvou", com a ação "Tentar de novo", e continuar funcionando em memória com as mudanças pendentes.

#### Scenario: Persistência após recarregar
- **WHEN** o usuário muda Força para 3, espera o envio e recarrega a página
- **THEN** Força continua 3

#### Scenario: Persistência em outro dispositivo
- **WHEN** o usuário muda Força para 3 e entra com a mesma conta em outro navegador
- **THEN** Força aparece como 3

#### Scenario: API indisponível
- **WHEN** a API não responde ao gravar
- **THEN** a edição continua visível na tela e aparece o toast "Não salvou"

### Requirement: Abas de Atributos e Habilidades em telas menores
Em telas com largura abaixo de 1024px (breakpoint `lg` do Tailwind — tablet e celular), a aba Ficha SHALL exibir, no lugar dos títulos de seção "Atributos" e "Habilidades", um seletor segmentado com duas abas, "Atributos" e "Habilidades", ocupando a largura do conteúdo. Apenas o bloco da aba ativa SHALL ficar visível; "Atributos" MUST ser a aba ativa ao abrir a aba Ficha.

O seletor MUST usar a semântica de abas acessível (`tablist`/`tab`/`tabpanel`, `aria-selected`, setas do teclado para trocar de aba) e o estilo da ficha: cantos retos, rótulos Karla em caixa-alta, aba ativa com fundo branco e texto tinta, aba inativa com texto suave sobre o fundo do seletor. Estilos MUST ser classes Tailwind no JSX.

A partir de 1024px, a aba Ficha MUST exibir os títulos "Atributos" e "Habilidades", os dois blocos visíveis, Habilidades logo abaixo de Atributos, e nenhum seletor de abas.

A aba escolhida MUST NOT ser gravada na ficha nem na URL. Trocar de aba MUST NOT alterar valores de traços nem especialidades.

#### Scenario: Abertura no celular
- **WHEN** o usuário abre a aba Ficha numa tela de 390px de largura
- **THEN** o seletor mostra "Atributos" ativo, os grupos Físicos, Sociais e Mentais estão visíveis e as habilidades estão ocultas

#### Scenario: Trocar para Habilidades
- **WHEN** numa tela de tablet (768px) o usuário toca em "Habilidades"
- **THEN** os atributos ficam ocultos e as habilidades com seus pontos e selos de especialidade ficam visíveis

#### Scenario: Navegação pelo teclado
- **WHEN** o foco está na aba "Atributos" e o usuário pressiona a seta para a direita
- **THEN** o foco vai para "Habilidades" e o bloco de habilidades passa a ser exibido

#### Scenario: Desktop sem abas
- **WHEN** o usuário abre a aba Ficha numa tela de 1280px
- **THEN** não há seletor de abas; os títulos "Atributos" e "Habilidades" e os dois blocos estão visíveis, com Habilidades logo abaixo de Atributos

#### Scenario: Aba não persiste
- **WHEN** o usuário ativa "Habilidades", vai para a aba Disciplinas e volta para a Ficha
- **THEN** a Ficha reabre com "Atributos" ativo e a URL continua `/ficha/ficha`

#### Scenario: Editar traço na aba ativa
- **WHEN** na aba "Habilidades" o usuário marca o 3º ponto de Furtividade e depois volta para "Atributos"
- **THEN** Furtividade fica gravada com 3 e os atributos continuam com os valores anteriores

### Requirement: Aba Resumo
A aba SHALL exibir, no topo, o painel de identificação com os campos editáveis Nome, Conceito, Crônica, Predador, Ambição, Clã, Senhor, Desejo e Geração, nessa ordem, em grade que se ajusta à largura (uma coluna no celular) e sem placeholders. Cada campo MUST gravar na mesma chave da ficha que usava na aba Ficha (`nome`, `conceito`, `cronica`, `predador`, `ambicao`, `cla`, `senhor`, `desejo`, `geracao`). Logo abaixo, a aba SHALL exibir os textos longos editáveis "Princípios da Crônica" e "Perdição do Clã" lado a lado em duas colunas (uma coluna no celular); depois, o painel "Vantagens & Defeitos" em largura total; depois História, três pares Convicção/Pilar, o painel de Potência de Sangue (nível, 10 pontos, "O que o sangue te dá" e "O que o sangue te cobra" conforme a tabela de Potência de Sangue do livro) e os campos biográficos (idade verdadeira e aparente, nascimento, morte, aparência, traços distintivos). A aba MUST NOT ter campo de texto livre de Vantagens & Defeitos. A Potência MUST ser a derivada da Geração pela tabela inicial do livro (16ª–14ª 0, 13ª–10ª 1, 9ª–8ª 2, 7ª–6ª 3, 5ª 4, 4ª 5), somada ao ajuste de Potência registrado pelo Predador em `predBonus` (limitada a 10). Quando há ajuste do Predador, a nota da Potência MUST terminar com " (+N do Predador)". A penalidade de alimentação MUST listar todos os itens da Potência.

#### Scenario: Identificação no topo
- **WHEN** a ficha tem nome "Vitória Salles" e clã "Ventrue" e o usuário abre a aba Resumo
- **THEN** o primeiro bloco da aba mostra os campos Nome "Vitória Salles" e Clã "Ventrue" junto com Conceito, Crônica, Predador, Ambição, Senhor, Desejo e Geração, acima de "Princípios da Crônica"

#### Scenario: Editar o nome no Resumo
- **WHEN** o usuário troca o Nome para "Aurélio Braga" na aba Resumo
- **THEN** `nome` é gravado como "Aurélio Braga" e o cabeçalho da ficha passa a mostrar "Aurélio Braga"

#### Scenario: Tabela de Potência
- **WHEN** a Potência de Sangue é 1
- **THEN** o painel mostra Surto de Sangue "Adicione 2 dados", Bônus de Poder "Nenhum", Rerrolagem de Rouse "Nível 1", Cura ao Despertar "1 ponto de dano Superficial por Checagem de Sangue" e Gravidade da Perdição "Severidade 2"

#### Scenario: Potência derivada da Geração do livro
- **WHEN** a ficha é de 8ª Geração
- **THEN** o painel mostra Potência de Sangue nível 2 com 2 pontos marcados

#### Scenario: Potência com ponto do Predador
- **WHEN** a ficha é de 12ª Geração e foi concluída com o Predador "Sanguessuga"
- **THEN** o painel mostra Potência de Sangue nível 2 com 2 pontos marcados e a nota "Geração 12ª — Potência de Sangue 2. (+1 do Predador)"

#### Scenario: Textos longos em duas colunas
- **WHEN** a aba Resumo é aberta numa tela larga
- **THEN** "Princípios da Crônica" e "Perdição do Clã" aparecem lado a lado logo abaixo do painel de identificação, sem campo de texto "Vantagens & Defeitos", e o painel "Vantagens & Defeitos" vem logo abaixo em largura total

### Requirement: Características somente leitura para o jogador
Com o personagem criado, a aba Características SHALL exibir os pontos de Atributos e Habilidades do jogador somente para leitura: os pontos MUST NOT ser clicáveis nem focáveis como controle, e MUST ser anunciados como imagem com o valor (ex.: "Força: 2 de 5"). Os nomes dos traços e os selos de especialidade MUST continuar abrindo o painel de informação. Quando a ficha é aberta pelo Mestre, os pontos MUST continuar editáveis.

#### Scenario: Jogador tenta mudar um atributo
- **WHEN** o jogador com personagem criado toca no 3º ponto de Força na aba Características
- **THEN** nada muda e nenhuma gravação é enviada

#### Scenario: Informação continua disponível
- **WHEN** o jogador toca no nome "Furtividade" na aba Características
- **THEN** o painel de informação de Furtividade abre

#### Scenario: Mestre ajusta um atributo
- **WHEN** o Mestre, com a ficha de um jogador aberta, toca no 3º ponto de Força
- **THEN** Força passa a 3 e a mudança é gravada na ficha desse jogador

