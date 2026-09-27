## RENAMED Requirements

- FROM: `### Requirement: Aba Registros`
- TO: `### Requirement: Aba Resumo`

## MODIFIED Requirements

### Requirement: Estrutura da ficha e navegação
A ficha SHALL ter um cabeçalho com o nome do personagem ("Sem nome" se vazio), o rótulo da aba atual e um botão de menu. O menu MUST abrir uma gaveta lateral com o e-mail do usuário, o nome, as abas (Ficha, Disciplinas, Ações, Resumo, Notas e, se habilitado, Sessões & XP) com a atual destacada, "Refazer personagem" e "Sair" (em sangue). A aba atual MUST ser refletida na URL; a aba Resumo MUST usar o endereço `/ficha/resumo`. O endereço antigo `/ficha/registros` MUST redirecionar (substituindo a entrada do histórico) para `/ficha/resumo`; qualquer outro endereço de aba desconhecido MUST continuar redirecionando para `/ficha/ficha`.

#### Scenario: Trocar de aba pelo menu
- **WHEN** o usuário abre o menu e escolhe "Resumo"
- **THEN** a gaveta fecha, o cabeçalho mostra "Resumo", a URL passa a ser `/ficha/resumo` e o conteúdo da aba Resumo é exibido

#### Scenario: Menu sem Registros
- **WHEN** o usuário abre o menu
- **THEN** a lista de abas mostra "Resumo" entre "Ações" e "Notas" e não mostra "Registros"

#### Scenario: Link antigo de Registros
- **WHEN** o usuário acessa `/ficha/registros`
- **THEN** a URL passa a ser `/ficha/resumo` e a aba Resumo é exibida

#### Scenario: Fechar menu pelo fundo
- **WHEN** o usuário clica no fundo escurecido
- **THEN** a gaveta fecha sem mudar de aba

#### Scenario: Link direto para aba
- **WHEN** o usuário recarrega a página estando na aba Notas
- **THEN** a ficha reabre na aba Notas

### Requirement: Aba Ficha
A aba SHALL exibir os atributos e habilidades com `DotRating`, Vitalidade (máx. Vigor + 3) e Força de Vontade (máx. Autocontrole + Determinação) como `DamageTrack`, Fome como 5 pontos clicáveis, Humanidade com 10 caixas e botões "− Nível"/"+ Nível" (limitados a 0–10), e Ressonância com tipo e intensidade selecionáveis. A aba MUST NOT exibir os campos de identificação (Nome, Conceito, Crônica, Predador, Ambição, Clã, Senhor, Desejo, Geração); eles ficam na aba Resumo.

#### Scenario: Sem painel de identificação
- **WHEN** o usuário abre a aba Ficha
- **THEN** não há campos "Nome", "Clã" nem os demais campos de identificação, e o primeiro bloco da aba é o de Atributos/Habilidades

#### Scenario: Ciclo da caixa de dano
- **WHEN** o usuário toca repetidamente numa caixa de Vitalidade vazia
- **THEN** ela passa por vazio → `/` superficial → `✕` agravado → vazio

#### Scenario: Máximo acompanha atributo
- **WHEN** Vigor sobe de 2 para 3
- **THEN** a Vitalidade passa a ter 6 caixas, preservando as marcas existentes

#### Scenario: Marcar mancha
- **WHEN** o usuário toca numa caixa de Humanidade
- **THEN** a caixa alterna a marca de mancha `✕` e a contagem de manchas é atualizada

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
