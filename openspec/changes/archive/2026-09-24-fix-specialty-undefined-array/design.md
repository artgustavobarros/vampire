## Context

O passo 4 usa um `Controller` por habilidade em `name={\`espec.${skill}\`}`. `espec` é `Record<string, string[]>` e vem da ficha só com as habilidades que já têm especialidade (ex.: `{}` numa ficha nova). Quando o `Controller` monta para uma habilidade sem entrada, o `react-hook-form` (`updateValidAndValue` no `register`) faz `set(_formValues, "espec.Briga", undefined)`, criando a chave com valor `undefined`. O resolver do passo 4 (`z.record(z.string(), z.array(z.string()))`) então falha em `espec.Briga` com a mensagem padrão do Zod 4, "Invalid input: expected array, received undefined", que `collectErrorMessages` leva ao toast "Passo incompleto".

Isso acontece:
- no modo livre, assim que o jogador escolhe a habilidade no seletor (o `SpecialtyField` monta com `key={especLivre}`);
- no modo obrigatório, para cada habilidade obrigatória sem especialidade salva;
- ao trocar a habilidade livre, a chave da anterior fica em `espec` (como `undefined` ou `[]`).

Com `reValidateMode: "onChange"`, depois de um primeiro "Continuar" o erro reaparece a cada mudança.

## Goals / Non-Goals

**Goals:**
- O valor de `espec.<habilidade>` no formulário é sempre um array.
- O passo 4 valida só pelas regras de negócio, com mensagens em português.
- A ficha não guarda entradas de `espec` vazias.

**Non-Goals:**
- Mudar as regras do passo 4 ou o layout da tela.
- Traduzir mensagens padrão do Zod para os outros passos.
- Suportar mais de uma especialidade por habilidade na UI (a posição 0 continua sendo a principal).

## Decisions

1. **`defaultValue={[]}` no `Controller` do `SpecialtyField`.** O `react-hook-form` usa o `defaultValue` do `Controller` quando o caminho ainda não existe em `_formValues`, então a chave nasce como `[]` e o schema aceita. Corrige na origem e mantém o tipo `Record<string, string[]>` verdadeiro.
   - *Alternativa:* afrouxar o schema para `z.array(z.string()).optional()`. Rejeitada como correção principal: esconde o `undefined` no formulário e deixa o tipo de `WizardValues` mentir; os valores ainda chegariam à ficha como `undefined`.
   - *Alternativa:* pré-preencher `espec` com `[]` para todas as habilidades em `sheetToWizard`. Rejeitada: grava 27 chaves vazias na ficha e não cobre nomes que surgirem depois.

2. **`wizardToPatch` descarta entradas de `espec` sem texto na posição 0** (filtra valores vazios de cada array e remove a chave se sobrar nada). Assim trocar a habilidade livre não deixa `{ Briga: [] }` na ficha, e a gravação sem validação do "Voltar" também sai limpa.
   - *Alternativa:* `shouldUnregister` no `Controller`. Rejeitada: apagaria o texto digitado ao alternar de habilidade e voltar, e muda o comportamento de preservação entre passos.

## Risks / Trade-offs

- [Outros `Controller` com caminhos dinâmicos podem ter o mesmo problema] → Fora do escopo; os demais passos usam arrays com posições fixas (`disc.0`, `disc.1`) ou `useFieldArray`. Registrar se aparecer.
- [Limpar `espec` em `wizardToPatch` apagaria especialidades extras vazias intencionais] → Não existe caso de uso para especialidade vazia; `withPrimary` já remove vazios fora da posição 0.
