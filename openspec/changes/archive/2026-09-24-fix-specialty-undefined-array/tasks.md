## 1. Correção

- [x] 1.1 Em `web/src/features/wizard/step4-specialties.tsx`, passar `defaultValue={[]}` ao `Controller` do `SpecialtyField` para que `espec.<habilidade>` nasça como array
- [x] 1.2 Em `web/src/features/wizard/schema.ts`, fazer `wizardToPatch` limpar `espec` quando o campo for gravado: remover strings vazias de cada array e descartar chaves sem especialidade na posição 0

## 2. Testes

- [x] 2.1 Em `schema.test.ts`, cobrir `wizardToPatch` com `espec: { Briga: [], Esportes: ["Corrida"] }` → grava só `{ Esportes: ["Corrida"] }`
- [x] 2.2 Em `wizard.test.tsx`, cenário livre: no passo 4 sem obrigatórias, escolher uma habilidade, digitar a especialidade e "Continuar" → vai para o passo 5 sem toast com "expected array" (falha antes da correção)
- [x] 2.3 Em `wizard.test.tsx`, cenário obrigatório: Ofícios com pontos e sem especialidade, "Continuar" → toast "Passo incompleto" com "Informe uma especialidade." e sem "expected array"
- [x] 2.4 Em `wizard.test.tsx`, trocar a habilidade livre de "Briga" para outra, preencher e avançar → a ficha tem `espec` só com a habilidade final

- [x] 2.5 Em `wizard.test.tsx`, cenário relatado: escolher "Armas Brancas", "Continuar" antes de digitar → "Informe uma especialidade." sem "expected array"; digitar "Armas improvisadas" → passo 5 (falha antes da correção)

## 3. Verificação

- [x] 3.1 Rodar `pnpm test`, `pnpm typecheck` e `pnpm check` em `web/`
