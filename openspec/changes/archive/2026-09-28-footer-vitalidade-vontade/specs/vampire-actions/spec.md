## MODIFIED Requirements

### Requirement: Aba Ações
A aba Ações SHALL mostrar Humanidade (com contagem de manchas) e os cartões de ação Sofrer dano, Curar-se, Alimentar-se, Dormir, Teste de Frenesi (sangue) e Surto de Sangue (sangue), nesta ordem, cada um com descrição e botão. A aba MUST NOT mostrar os painéis de Vitalidade e Força de Vontade; essas trilhas ficam na barra inferior fixa, onde continuam permitindo a marcação manual caixa a caixa. O botão do cartão Dormir MUST abrir o mesmo diálogo de dormir que antes era aberto pela barra inferior.

#### Scenario: Abrir alimentação pela aba
- **WHEN** o usuário clica "Registrar" no cartão Alimentar-se
- **THEN** o diálogo "Registrar alimentação" abre

#### Scenario: Abrir dano pela aba
- **WHEN** o usuário clica "Marcar dano" no cartão Sofrer dano
- **THEN** o diálogo "Sofrer dano" abre com "Vitalidade", "Dano recebido" 0 e "Superficial" escolhidos

#### Scenario: Abrir cura pela aba
- **WHEN** o usuário clica "Curar dano" no cartão Curar-se
- **THEN** o diálogo "Curar-se" abre com "Vitalidade", "Dano curado" 0 e "Superficial" escolhidos

#### Scenario: Dormir pela aba
- **WHEN** o usuário clica "Dormir" no cartão Dormir
- **THEN** o diálogo "Dormir até o anoitecer?" abre

#### Scenario: Sem painéis de trilha
- **WHEN** o usuário abre a aba Ações
- **THEN** a área de conteúdo da aba mostra o painel de Humanidade e não mostra painéis de Vitalidade nem de Força de Vontade
