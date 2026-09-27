## MODIFIED Requirements

### Requirement: Aviso de falha ao salvar
Quando uma gravação da ficha na API falhar sem conexão ou com 5xx, o app SHALL exibir um toast de erro persistente com rótulo "Não salvou" e a ação "Tentar de novo", que reenvia as mudanças pendentes. Enquanto as falhas seguirem, MUST haver um único toast visível; depois de um envio bem-sucedido, uma nova falha MUST mostrar o toast outra vez.

#### Scenario: Duas falhas seguidas
- **WHEN** dois `PATCH /me/sheet` seguidos falham sem conexão
- **THEN** um único toast "Não salvou" aparece e permanece até ser fechado

#### Scenario: Tentar de novo
- **WHEN** o usuário toca em "Tentar de novo" no toast "Não salvou" e a API responde
- **THEN** as mudanças pendentes são gravadas e o toast fecha

#### Scenario: Nova falha depois de salvar
- **WHEN** um envio dá certo e um envio seguinte falha
- **THEN** o toast "Não salvou" aparece de novo
