# notifications Specification

## Purpose
Avisos globais (Sonner): aparência V5, posição, duração, limite e deduplicação, a API `notify`/`apiError` e o aviso de falha de gravação.
## Requirements
### Requirement: Toaster global com Sonner
O app SHALL montar um único `<Toaster />` do componente shadcn `sonner` na raiz (`__root.tsx`), fora da tela de abertura, de modo que qualquer tela possa disparar avisos. Os toasts MUST ser renderizados dentro de uma região com `aria-label="Avisos"`, e cada toast de erro MUST ser anunciado a leitores de tela.

#### Scenario: Toast disponível em qualquer tela
- **WHEN** um toast é disparado na tela de entrar, no assistente ou na ficha
- **THEN** ele aparece sem que a tela precise montar seu próprio contêiner

#### Scenario: Acessibilidade
- **WHEN** um toast de erro aparece
- **THEN** ele está dentro de uma região rotulada "Avisos" e é anunciado por leitores de tela

### Requirement: Aparência do toast
Cada toast SHALL usar fundo Vellum `#F4F3F0`, filete de 1px `rgba(13,13,13,.25)` e borda esquerda de 2px na cor do tom — Blood `#7A1220` (erro), Moss `#2F6B3C` (ok) ou Ink `#0D0D0D` (info) — sem sombra e sem cantos arredondados. O rótulo MUST ser Karla 600 12px, `.12em`, caixa-alta, na cor do tom; a mensagem Cormorant Garamond 400 18px/1.5 em tinta; a ação Karla 600 12px `.1em` caixa-alta sublinhada por filete. O botão fechar × MUST ter área de toque de 48×48px. A entrada MUST subir 8px com opacidade em 200ms, declarada com classes Tailwind no componente (sem keyframes no CSS global).

#### Scenario: Toast de erro
- **WHEN** um toast de tom erro é exibido
- **THEN** sua borda esquerda é `#7A1220`, o rótulo padrão é "Algo deu errado" e não há `box-shadow`

#### Scenario: Rótulos padrão
- **WHEN** um toast é disparado sem `titulo`
- **THEN** o rótulo é "Feito" para ok, "Aviso" para info e "Algo deu errado" para erro

### Requirement: Posição do toast
Os toasts SHALL empilhar no canto inferior direito, a 24px da borda direita, com largura fixa `min(420px, 100vw - 48px)`. Em telas com menos de 640px, MUST ficar centralizados embaixo com 16px de margem lateral. Na ficha (`/ficha`), a distância do fundo MUST ser 96px, para ficar acima da barra inferior; nas demais telas, 16px.

#### Scenario: Na ficha
- **WHEN** um toast aparece com a ficha aberta
- **THEN** ele fica 96px acima do fundo da janela, sem cobrir a barra preta

#### Scenario: Celular
- **WHEN** a janela tem 375px de largura
- **THEN** o toast ocupa a largura com 16px de margem de cada lado, centralizado

### Requirement: Duração, limite e deduplicação
Toasts de erro SHALL fechar sozinhos após 6s e os de ok/info após 3,5s; `duracao: 0` MUST manter o toast até ser fechado manualmente. No máximo 3 toasts MUST ficar visíveis, descartando os mais antigos. Disparar a mesma mensagem que já está visível MUST substituir o toast existente em vez de duplicá-lo.

#### Scenario: Mensagem repetida
- **WHEN** o usuário tenta entrar duas vezes seguidas com a senha errada
- **THEN** só um toast "Senha incorreta." fica visível

#### Scenario: Quatro avisos
- **WHEN** quatro mensagens diferentes são disparadas em sequência
- **THEN** apenas as três mais recentes ficam visíveis

#### Scenario: Persistente
- **WHEN** um toast é disparado com `duracao: 0`
- **THEN** ele permanece até o usuário tocar no ×

### Requirement: API de notificação
O app SHALL expor em `lib/toast.tsx` a função `notify(msg, { tom, titulo, duracao, acao, onAcao })` (tom padrão `erro`) e `apiError(err, retry?)`, que traduz o status: 401/403 → "Sua sessão expirou. Entre de novo para continuar."; 404 → "Não encontramos o que você pediu."; 409 → "Essa ficha foi alterada em outro lugar. Recarregue antes de salvar."; 400/422 → a mensagem do erro ou "Algum campo foi recusado. Revise e tente de novo."; 5xx → "O servidor falhou ao responder. Nada foi perdido; tente de novo."; sem status → "Não foi possível falar com o servidor. Verifique a conexão." O rótulo MUST ser "Erro <status>" ou "Sem conexão". Com `retry`, o toast MUST mostrar a ação "Tentar de novo" que chama `retry`.

#### Scenario: Sessão expirada
- **WHEN** `apiError({ status: 401 })` é chamado
- **THEN** aparece um toast de erro com rótulo "Erro 401" e a mensagem de sessão expirada

#### Scenario: Tentar de novo
- **WHEN** `apiError(new TypeError("Failed to fetch"), retry)` é chamado e o usuário toca em "Tentar de novo"
- **THEN** o rótulo é "Sem conexão" e `retry` é executado

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

### Requirement: Erros de validação como toast
Erros que o usuário precisa ler para corrigir uma ação (login/cadastro, diálogos e validação dos passos do assistente) SHALL ser mostrados por `notify` com tom `erro`, e MUST NOT aparecer como texto de erro inline no formulário. Textos de ajuda (`FieldDescription`) e resultados de rolagem não são erros e continuam inline.

#### Scenario: Passo do assistente inválido
- **WHEN** o usuário clica "Continuar" num passo inválido do assistente
- **THEN** aparece um toast de erro com rótulo "Passo incompleto" e nenhum texto de erro é renderizado dentro do formulário

#### Scenario: Texto de ajuda continua inline
- **WHEN** o passo 1 mostra a descrição da geração
- **THEN** a descrição continua abaixo do campo, fora de qualquer toast

