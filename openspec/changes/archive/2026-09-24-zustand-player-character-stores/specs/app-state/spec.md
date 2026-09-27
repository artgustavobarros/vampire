## ADDED Requirements

### Requirement: Store do jogador
O app SHALL manter o estado da sessão num store Zustand próprio do jogador (`usePlayerStore`), com o e-mail da sessão (`user`), o nome do jogador (lido de `vtm5.name.<email>`) e a flag `ready`, que indica que a sessão salva já foi lida no cliente.

#### Scenario: Restaurar sessão salva
- **WHEN** o app restaura a sessão com `vtm5.session` definido
- **THEN** o store do jogador passa a ter `user` igual ao e-mail salvo, `name` igual a `vtm5.name.<email>` e `ready: true`

#### Scenario: Restaurar sem sessão
- **WHEN** o app restaura a sessão sem `vtm5.session`
- **THEN** o store do jogador fica com `user: null` e `ready: true`

#### Scenario: Restaurar só uma vez
- **WHEN** a restauração é chamada novamente depois de `ready: true`
- **THEN** nada é relido do armazenamento

### Requirement: Store do personagem
O app SHALL manter a ficha do personagem (`Sheet`) e o alerta de Fome pendente num store Zustand próprio do personagem (`useCharacterStore`), separado do store do jogador. Cada alteração da ficha MUST ser mesclada à ficha atual, salva em `vtm5.sheet.<email>` do jogador logado e, quando mudar `fome`, atualizar o alerta de Fome (0 ou 5).

#### Scenario: Carregar ficha do jogador
- **WHEN** o jogador entra ou a sessão é restaurada
- **THEN** o store do personagem carrega `vtm5.sheet.<email>` normalizada, ou uma ficha em branco se não existir

#### Scenario: Salvar alteração
- **WHEN** um campo da ficha é alterado com um jogador logado
- **THEN** a ficha mesclada fica no store do personagem e é gravada em `vtm5.sheet.<email>`

#### Scenario: Alteração sem jogador
- **WHEN** um campo da ficha é alterado sem jogador logado
- **THEN** a ficha é atualizada só em memória

#### Scenario: Alerta de Fome
- **WHEN** a Fome passa de 4 para 5
- **THEN** o store do personagem sinaliza alerta 5 até ser dispensado

### Requirement: Sair limpa jogador e personagem
Ao sair, o app MUST limpar o store do jogador e o store do personagem.

#### Scenario: Sair
- **WHEN** o jogador sai
- **THEN** o store do jogador fica com `user: null` e `name: null`, e o store do personagem volta à ficha em branco sem alerta de Fome

### Requirement: Estado inicial no servidor
Na renderização no servidor e na hidratação, os stores MUST expor o estado inicial (sem jogador, ficha em branco, `ready: false`), e a sessão MUST ser lida só no cliente, depois da hidratação.

#### Scenario: Primeira renderização
- **WHEN** a página é renderizada no servidor
- **THEN** os componentes leem `user: null`, `ready: false` e a ficha em branco, sem acessar `localStorage`
