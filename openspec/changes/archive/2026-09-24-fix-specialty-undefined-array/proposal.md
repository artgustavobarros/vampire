## Why

No passo 4 (Especialidades), ao escolher a habilidade da especialidade livre (ou ao abrir o passo com uma habilidade obrigatória como Ofícios), o assistente mostra o erro cru do Zod "Invalid input: expected array, received undefined." e o "Continuar" fica bloqueado. O `Controller` de `espec.<habilidade>` é montado sem valor padrão, e o `react-hook-form` registra o caminho gravando `undefined` em `espec`; o schema do passo 4 exige `z.array(z.string())` para todo valor do registro, então a chave vazia reprova o passo antes mesmo de o jogador digitar.

## What Changes

- O campo de especialidade (`SpecialtyField` em `step4-specialties.tsx`) passa a registrar `espec.<habilidade>` já com um array vazio, de modo que o valor do formulário nunca é `undefined`.
- Ao trocar a habilidade da especialidade livre, a entrada da habilidade anterior que ficou vazia não reprova o passo nem é gravada na ficha: `wizardToPatch` descarta entradas de `espec` sem especialidade preenchida.
- A validação do passo 4 continua a mesma (obrigatórias preenchidas; sem obrigatórias, uma habilidade com pontos e uma especialidade livre), mas só com mensagens em português — nenhum erro de tipo do Zod chega ao toast.
- Testes de regressão no assistente e no schema.

## Capabilities

### New Capabilities

(nenhuma)

### Modified Capabilities

- `character-wizard`: o requisito "Passo 4 — Especialidades" ganha cenários garantindo que escolher a habilidade e digitar a especialidade não gera erro de tipo e que trocar de habilidade não deixa uma entrada vazia na ficha.

## Impact

- `web/src/features/wizard/step4-specialties.tsx` (`Controller` com `defaultValue`)
- `web/src/features/wizard/schema.ts` (`wizardToPatch` limpa `espec`)
- Testes: `web/src/features/wizard/wizard.test.tsx`, `web/src/features/wizard/schema.test.ts`
