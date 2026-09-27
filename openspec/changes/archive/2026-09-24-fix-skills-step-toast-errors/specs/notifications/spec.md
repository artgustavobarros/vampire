## ADDED Requirements

### Requirement: Erros de validação como toast
Erros que o usuário precisa ler para corrigir uma ação (login/cadastro, diálogos e validação dos passos do assistente) SHALL ser mostrados por `notify` com tom `erro`, e MUST NOT aparecer como texto de erro inline no formulário. Textos de ajuda (`FieldDescription`) e resultados de rolagem não são erros e continuam inline.

#### Scenario: Passo do assistente inválido
- **WHEN** o usuário clica "Continuar" num passo inválido do assistente
- **THEN** aparece um toast de erro com rótulo "Passo incompleto" e nenhum texto de erro é renderizado dentro do formulário

#### Scenario: Texto de ajuda continua inline
- **WHEN** o passo 1 mostra a descrição da geração
- **THEN** a descrição continua abaixo do campo, fora de qualquer toast
