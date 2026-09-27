## MODIFIED Requirements

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
