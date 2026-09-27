## MODIFIED Requirements

### Requirement: Aba Registros
A aba SHALL exibir textos longos editáveis (ex.: ambição, desejo, pedra de toque), História, três pares Convicção/Pilar, o painel de Potência de Sangue (nível, 10 pontos, "O que o sangue te dá" e "O que o sangue te cobra" conforme a tabela de Potência de Sangue do livro) e os campos biográficos (idade verdadeira e aparente, nascimento, morte, aparência, traços distintivos). A Potência MUST ser a derivada da Geração pela tabela inicial do livro (16ª–14ª 0, 13ª–10ª 1, 9ª–8ª 2, 7ª–6ª 3, 5ª 4, 4ª 5). A penalidade de alimentação MUST listar todos os itens da Potência.

#### Scenario: Tabela de Potência
- **WHEN** a Potência de Sangue é 1
- **THEN** o painel mostra Surto de Sangue "Adicione 2 dados", Bônus de Poder "Nenhum", Rerrolagem de Rouse "Nível 1", Cura ao Despertar "1 ponto de dano Superficial por Checagem de Sangue" e Gravidade da Perdição "Severidade 2"

#### Scenario: Potência derivada da Geração do livro
- **WHEN** a ficha é de 8ª Geração
- **THEN** o painel mostra Potência de Sangue nível 2 com 2 pontos marcados
