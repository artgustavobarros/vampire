## Context

O `DamageForm` (`web/src/features/actions/damage-form.tsx`) guarda `received` a partir de 1 e chama `takeDamage(sheet, track, level, received)` (`web/src/rules/tracks.ts`), que passa o valor por `effectiveDamage` (divide o Superficial de Vitalidade por 2, arredondando para cima) antes de chamar `addDamage`. A divisão é feita a cada golpe e o botão mostra o valor já dividido, então o que o jogador escolhe no stepper não é o que vai para a ficha. O `Stepper` (`stepper.tsx`) já aceita `min`/`max` e desativa − e + nos limites.

A pré-visualização já parte das marcas da ficha (`trackBoxes(sheet[track], …)`) e a regra de transbordo em `addDamage` já transforma superficial em agravado quando não há caixa vazia. O que falta é o jogador ver esse ponto de partida antes de somar dano novo, e o app parar de mexer no valor.

## Goals / Non-Goals

**Goals:**
- "Dano recebido" começa em 0 e representa só o dano novo; a prévia em 0 é a trilha atual.
- O número marcado na ficha é sempre o escolhido pelo jogador.
- A divisão do Superficial aparece só como dica no texto.
- Remover a lógica de dano efetivo que deixa de ter uso.

**Non-Goals:**
- Manter o diálogo aberto para aplicar vários golpes seguidos: cada golpe continua sendo uma abertura do diálogo.
- Mudar a regra de transbordo, a nota de resultado ou o visual da prévia.
- Oferecer um atalho "aplicar metade": o jogador ajusta o stepper.

## Decisions

### `takeDamage` marca exatamente o valor recebido
A assinatura passa a `takeDamage(sheet, track, level, amount)` e chama `addDamage(before, level, amount)` direto. O retorno perde `effective` (o valor é o próprio `amount`), ficando `{ changed, marks, note, patch }`; a nota usa `amount`. `effectiveDamage` sai de `rules/tracks.ts` e dos testes, junto com o import no teste.
- Alternativa: manter `effectiveDamage` só para a dica. Rejeitada: a conta da dica é `Math.ceil(r / 2)`, uma linha de texto de interface, não uma regra aplicada à ficha; manter a função exportada deixaria uma "regra" que o app não aplica.

### Stepper de 0 a 20 começando em 0
`useState(0)` e `min={0}` no `Stepper`. Com 0, `takeDamage` devolve as marcas atuais e `changed` todo `false`, então a prévia mostra a trilha como está sem nenhum código especial. O botão principal recebe `disabled={received === 0}` e continua dizendo "Marcar 0 de dano", para o rótulo não mudar de forma.
- Alternativa: esconder a prévia em 0. Rejeitada: ver o dano acumulado antes de somar é justamente o que o jogador pediu.

### Texto de dica no formulário
`explanation(track, level, received)` perde o parâmetro `n` e calcula a metade só para o texto: com R ≥ 1, "Vampiros dividem dano Superficial por 2, arredondando para cima: R virariam N. Ajuste o dano recebido se for o caso." ("viraria" quando R é 1); com R = 0, a mesma frase sem o exemplo. Os textos de Agravado e Força de Vontade não mudam.

## Risks / Trade-offs

- [Jogador esquece de dividir o Superficial físico] → a dica mostra a conta pronta ao lado do stepper, com o valor dividido.
- [Abrir o diálogo e clicar sem subir o stepper] → o botão fica desativado em 0; não grava nada nem mostra "Dano marcado" vazio.
- [Testes existentes esperam o valor dividido e o início em 1] → são reescritos junto com a mudança; os cenários do spec viram os casos de teste.
