## 1. Regra de dano

- [x] 1.1 Em `web/src/rules/tracks.ts`, remover `effectiveDamage`; `takeDamage(sheet, track, level, amount)` passa `amount` direto para `addDamage`, a nota usa `amount` e o retorno perde o campo `effective`
- [x] 1.2 Em `web/src/rules/rules.test.ts`, remover os testes e o import de `effectiveDamage`; testar que 3 superficiais em Vitalidade vazia marcam 3 caixas, que 0 não muda nada (`changed` todo `false`) e que 1 superficial numa trilha de 5 superficiais agrava a primeira

## 2. Formulário Sofrer dano

- [x] 2.1 Em `damage-form.tsx`, iniciar `received` em 0 e passar `min={0}` ao `Stepper`
- [x] 2.2 Botão principal "Marcar {received} de dano", desativado quando `received === 0`, aplicando o resultado de `takeDamage` sem ajuste
- [x] 2.3 Reescrever `explanation(track, level, received)` como dica: frase com "R virariam N" / "1 viraria 1" para R ≥ 1, sem exemplo para R = 0, mais "Ajuste o dano recebido se for o caso."; manter os textos de Agravado e Força de Vontade

## 3. Testes do diálogo

- [x] 3.1 Atualizar `damage-form.test.tsx`: abertura com "Dano recebido" 0, − desativado em 0 e botão "Marcar 0 de dano" desativado, prévia sem caixas tracejadas
- [x] 3.2 Cenário sem divisão: `vit: [1]`, subir para 3 → texto de dica com "3 virariam 2", prévia com 4 superficiais e 2ª–4ª caixas tracejadas, "Marcar 3 de dano" grava `[1, 1, 1, 1, 0]` e a nota "3 de dano superficial marcado na Vitalidade."
- [x] 3.3 Cenário de golpes seguidos: marcar 5 superficiais, reabrir, conferir 0 com as 5 superficiais na prévia e, com 1, a primeira caixa agravada tracejada
- [x] 3.4 Ajustar os demais testes (Agravado, Força de Vontade, limites até 20, torpor, cancelar e reabrir em 0) para o novo início em 0

## 4. Verificação

- [ ] 4.1 Rodar os testes e o lint do `web` e conferir o formulário no app com uma trilha já marcada
