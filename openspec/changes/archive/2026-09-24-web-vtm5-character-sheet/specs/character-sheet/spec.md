## ADDED Requirements

### Requirement: Estrutura da ficha e navegação
A ficha SHALL ter um cabeçalho com o nome do personagem ("Sem nome" se vazio), o rótulo da aba atual e um botão de menu. O menu MUST abrir uma gaveta lateral com o e-mail do usuário, o nome, as abas (Ficha, Disciplinas, Ações, Registros, Notas e, se habilitado, Sessões & XP) com a atual destacada, "Refazer personagem" e "Sair" (em sangue). A aba atual MUST ser refletida na URL.

#### Scenario: Trocar de aba pelo menu
- **WHEN** o usuário abre o menu e escolhe "Registros"
- **THEN** a gaveta fecha, o cabeçalho mostra "Registros" e o conteúdo da aba Registros é exibido

#### Scenario: Fechar menu pelo fundo
- **WHEN** o usuário clica no fundo escurecido
- **THEN** a gaveta fecha sem mudar de aba

#### Scenario: Link direto para aba
- **WHEN** o usuário recarrega a página estando na aba Notas
- **THEN** a ficha reabre na aba Notas

### Requirement: Barra inferior fixa
Enquanto a ficha estiver aberta, o app SHALL exibir uma barra fixa no rodapé com "Rouse Check", o valor atual de Fome e "Dormir".

#### Scenario: Fome visível
- **WHEN** a Fome é 3
- **THEN** a barra inferior mostra "Fome" e "3" em qualquer aba

### Requirement: Aba Ficha
A aba SHALL exibir os campos de identificação editáveis, os atributos e habilidades com `DotRating`, Vitalidade (máx. Vigor + 3) e Força de Vontade (máx. Autocontrole + Determinação) como `DamageTrack`, Fome como 5 pontos clicáveis, Humanidade com 10 caixas e botões "− Nível"/"+ Nível" (limitados a 0–10), e Ressonância com tipo e intensidade selecionáveis.

#### Scenario: Ciclo da caixa de dano
- **WHEN** o usuário toca repetidamente numa caixa de Vitalidade vazia
- **THEN** ela passa por vazio → `/` superficial → `✕` agravado → vazio

#### Scenario: Máximo acompanha atributo
- **WHEN** Vigor sobe de 2 para 3
- **THEN** a Vitalidade passa a ter 6 caixas, preservando as marcas existentes

#### Scenario: Marcar mancha
- **WHEN** o usuário toca numa caixa de Humanidade
- **THEN** a caixa alterna a marca de mancha `✕` e a contagem de manchas é atualizada

### Requirement: Aba Disciplinas
A aba SHALL listar as disciplinas com nome editável, nível por `DotRating` e remoção, e seus poderes como linhas expansíveis (nível, nome, resumo). Um poder expandido MUST permitir editar nome, nível (1–5), "Custa Rouse", descrição e removê-lo. Um diálogo "Adicionar disciplina ou poder" MUST oferecer disciplinas sugeridas (existentes e do clã) ou nome livre, e opcionalmente um poder com nível, custo e descrição.

#### Scenario: Estado vazio
- **WHEN** não há disciplinas
- **THEN** aparece "Nenhuma disciplina registrada" com a orientação e o botão "+ Adicionar disciplina ou poder"

#### Scenario: Adicionar poder a disciplina existente
- **WHEN** o usuário escolhe "Presença" (já na ficha) e informa o poder "Temor" nível 1
- **THEN** o poder é acrescentado à disciplina Presença existente, sem duplicar a disciplina

#### Scenario: Adicionar sem nome
- **WHEN** o usuário confirma sem escolher nem digitar uma disciplina
- **THEN** uma mensagem de erro aparece no diálogo e nada é salvo

### Requirement: Aba Registros
A aba SHALL exibir textos longos editáveis (ex.: ambição, desejo, pedra de toque), História, três pares Convicção/Pilar, o painel de Potência de Sangue (nível, 10 pontos, "O que o sangue te dá" e "O que o sangue te cobra" conforme a tabela de Potência) e os campos biográficos (idade verdadeira e aparente, nascimento, morte, aparência, traços distintivos).

#### Scenario: Tabela de Potência
- **WHEN** a Potência de Sangue é 1
- **THEN** o painel mostra Surto de Sangue "+2 dados" e bônus de poder "+1 dado"

### Requirement: Aba Notas
A aba SHALL exibir uma área de texto livre de anotações com o placeholder "Contatos, pistas, dívidas, objetivos…".

#### Scenario: Salvar nota
- **WHEN** o usuário digita uma anotação e recarrega a página
- **THEN** a anotação continua lá

### Requirement: Aba Sessões & XP
Quando habilitada, a aba SHALL mostrar XP total e gasto (editáveis), XP disponível (total − gasto), noites vividas e um registro de sessões (data, XP, resumo) com o botão "+ Sessão".

#### Scenario: XP disponível
- **WHEN** XP total é 20 e gasto é 12
- **THEN** "Disponível" mostra 8

#### Scenario: Nova sessão
- **WHEN** o usuário clica "+ Sessão"
- **THEN** uma nova linha vazia é adicionada ao registro

### Requirement: Salvamento automático
Toda edição na ficha SHALL ser gravada em `vtm5.sheet.<email>` sem ação explícita do usuário.

#### Scenario: Persistência após recarregar
- **WHEN** o usuário muda Força para 3 e recarrega a página
- **THEN** Força continua 3
