## MODIFIED Requirements

### Requirement: Aba Disciplinas
A aba SHALL listar as disciplinas com nome editável, nível por `DotRating`, botão **?** que abre o painel de descrição (ver `trait-info`) e remoção, e seus poderes como linhas expansíveis (nível, nome, resumo). Um poder expandido MUST permitir editar nome, nível (1–5), "Custa Rouse", descrição, abrir "Sobre este poder" e removê-lo. Um diálogo "Adicionar disciplina ou poder" MUST oferecer disciplinas sugeridas (existentes e do clã) ou nome livre, e opcionalmente um poder com nível, custo e descrição.

#### Scenario: Estado vazio
- **WHEN** não há disciplinas
- **THEN** aparece "Nenhuma disciplina registrada" com a orientação e o botão "+ Adicionar disciplina ou poder"

#### Scenario: Adicionar poder a disciplina existente
- **WHEN** o usuário escolhe "Presença" (já na ficha) e informa o poder "Temor" nível 1
- **THEN** o poder é acrescentado à disciplina Presença existente, sem duplicar a disciplina

#### Scenario: Adicionar sem nome
- **WHEN** o usuário confirma sem escolher nem digitar uma disciplina
- **THEN** um toast de erro "Selecione ou digite uma disciplina." aparece, o diálogo continua aberto, nenhum texto de erro é renderizado dentro do diálogo e nada é salvo

### Requirement: Salvamento automático
Toda edição na ficha SHALL ser gravada em `vtm5.sheet.<email>` sem ação explícita do usuário. Se a gravação falhar, o app MUST avisar com o toast persistente "Não salvou" (uma vez por sessão) e continuar funcionando em memória.

#### Scenario: Persistência após recarregar
- **WHEN** o usuário muda Força para 3 e recarrega a página
- **THEN** Força continua 3

#### Scenario: Armazenamento indisponível
- **WHEN** o `localStorage` recusa a gravação
- **THEN** a edição continua visível na tela e aparece o toast "Não salvou"
