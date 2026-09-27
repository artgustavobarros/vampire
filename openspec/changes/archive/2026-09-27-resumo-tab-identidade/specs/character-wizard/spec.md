## MODIFIED Requirements

### Requirement: Perdição do clã gravada na ficha
Ao salvar o passo 1 (e ao concluir o assistente), a ficha SHALL gravar em `perdicao` o texto da Perdição do clã escolhido, no formato `<nome da Perdição> — <descrição>`, usando o nome e a descrição do catálogo de clãs. O texto MUST ser gravado apenas quando `perdicao` está vazio ou é igual ao texto automático de algum clã do catálogo; um texto diferente (editado pelo jogador na aba Resumo) MUST ser preservado. Sem clã válido, `perdicao` MUST NOT ser alterado.

#### Scenario: Perdição preenchida após o cadastro
- **WHEN** o jogador escolhe "Brujah" no passo 1 e conclui o assistente
- **THEN** a aba Resumo mostra em "Perdição do Clã" o texto "Temperamento Violento — " seguido da descrição da Perdição Brujah

#### Scenario: Trocar de clã atualiza o texto automático
- **WHEN** a ficha tem em `perdicao` o texto automático de "Brujah" e o jogador, no passo 1, troca para "Gangrel" e avança
- **THEN** `perdicao` passa a ter o texto automático de "Gangrel"

#### Scenario: Texto editado pelo jogador é preservado
- **WHEN** a ficha tem em `perdicao` um texto escrito pelo jogador e o passo 1 é salvo com outro clã
- **THEN** `perdicao` mantém o texto do jogador

#### Scenario: Clã sem Perdição própria
- **WHEN** o jogador escolhe "Sangue-ralo" e avança do passo 1
- **THEN** `perdicao` recebe "Sangue-ralo — " seguido da descrição do catálogo
