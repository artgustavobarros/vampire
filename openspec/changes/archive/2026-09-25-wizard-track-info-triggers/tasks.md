## 1. Passo 2 — gatilhos

- [x] 1.1 Em `web/src/features/wizard/step2-attributes.tsx`, guardar `vitalityMax({ attrs })` e `willpowerMax({ attrs })` em constantes no render
- [x] 1.2 Envolver "Vitalidade" e "Força de Vontade" da linha de derivados em `InfoTrigger` com `{ kind: "vitalidade", atual: "Máximo N" }` e `{ kind: "vontade", atual: "Máximo N" }`, mantendo os números como texto ao lado

## 2. Testes

- [x] 2.1 Em `web/src/features/wizard/wizard.test.tsx`, testar que clicar em "Vitalidade" no passo 2 abre o diálogo "Vitalidade" com o selo "Máximo N" e não altera os atributos
- [x] 2.2 Testar o mesmo para "Força de Vontade" (diálogo "Força de Vontade", selo "Máximo N")
- [x] 2.3 Rodar a suíte de testes e o lint (`ultracite`) do `web` e corrigir o que quebrar
