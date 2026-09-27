## MODIFIED Requirements

### Requirement: Aba Registros
A aba SHALL exibir, no topo, os textos longos editáveis "Princípios da Crônica" e "Perdição do Clã" lado a lado em duas colunas (uma coluna no celular); logo abaixo, o painel "Vantagens & Defeitos" em largura total; depois História, três pares Convicção/Pilar, o painel de Potência de Sangue (nível, 10 pontos, "O que o sangue te dá" e "O que o sangue te cobra" conforme a tabela de Potência de Sangue do livro) e os campos biográficos (idade verdadeira e aparente, nascimento, morte, aparência, traços distintivos). A aba MUST NOT ter campo de texto livre de Vantagens & Defeitos. A Potência MUST ser a derivada da Geração pela tabela inicial do livro (16ª–14ª 0, 13ª–10ª 1, 9ª–8ª 2, 7ª–6ª 3, 5ª 4, 4ª 5), somada ao ajuste de Potência registrado pelo Predador em `predBonus` (limitada a 10). Quando há ajuste do Predador, a nota da Potência MUST terminar com " (+N do Predador)". A penalidade de alimentação MUST listar todos os itens da Potência.

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
- **WHEN** a aba Registros é aberta numa tela larga
- **THEN** "Princípios da Crônica" e "Perdição do Clã" aparecem lado a lado, sem campo de texto "Vantagens & Defeitos", e o painel "Vantagens & Defeitos" vem logo abaixo em largura total

## ADDED Requirements

### Requirement: Painel Vantagens & Defeitos
A aba Registros SHALL exibir o painel "Vantagens & Defeitos" montado a partir de `meritos` da ficha, com duas colunas (uma no celular): "Vantagens", com os méritos do tipo vantagem e Qualidade SR, e "Defeitos", com os do tipo defeito e Defeito SR, na ordem gravada. Cada coluna MUST seguir o estilo do grid de habilidades: título do grupo (rótulo Karla, cor suave) com filete inferior e uma linha por mérito com filete suave, nome em Cormorant à esquerda e 5 pontos à direita. Méritos com nome vazio MUST NOT aparecer. Coluna sem méritos MUST mostrar "Nenhuma vantagem." ou "Nenhum defeito." em texto suave. Os pontos MUST ser editáveis como nas habilidades (clicar no valor atual diminui 1) e MUST gravar `pontos` do mérito correspondente, mantendo os demais campos (`tipo`, `nome`, `origem`). Estilos MUST ser classes Tailwind no JSX.

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
