## Context

O passo 2 (`step2-attributes.tsx`) termina com uma linha de derivados em texto puro: "Vitalidade {vitalityMax} · Força de Vontade {willpowerMax}". Na ficha, `TrackPanel` (`features/sheet/track-panels.tsx`) já transforma os mesmos rótulos em `InfoTrigger` com `{ kind: "vitalidade" | "vontade", atual: "Máximo N" }`. O `InfoProvider` fica em `routes/__root.tsx`, então `useInfo` já está disponível dentro do assistente (outros passos já usam `InfoTrigger`).

## Goals / Non-Goals

**Goals:**
- Abrir o painel de Vitalidade e de Força de Vontade a partir da linha de derivados do passo 2.
- Mostrar o selo "Máximo N" com o valor calculado dos atributos atuais do formulário.

**Non-Goals:**
- Mudar o conteúdo do painel (`build-info.ts`) ou o catálogo.
- Adicionar gatilhos de Vitalidade/Força de Vontade em outros passos.
- Mudar o visual da linha de derivados além do hover dos gatilhos.

## Decisions

- **Reusar `InfoTrigger` com os mesmos alvos da ficha.** Mesmo `kind` e mesmo formato de `atual` ("Máximo N") mantêm o painel idêntico nos dois lugares. Alternativa (um botão **?** ao lado) foi descartada: o padrão para rótulos de estado é o próprio texto como gatilho.
- **Só o rótulo é gatilho, o número fica fora.** Igual à ficha ("Vitalidade · máx N"): o botão envolve "Vitalidade" e "Força de Vontade"; os números seguem como texto ao lado. O `InfoTrigger` herda `text-transform` (`[text-transform:inherit]`), então a linha continua em maiúsculas.
- **Valor calculado no render.** `vitalityMax({ attrs })` e `willpowerMax({ attrs })` já são chamados no render; guardar em constantes e reutilizar no selo e no texto evita cálculo duplicado.

## Risks / Trade-offs

- [O gatilho está dentro de um `FieldSet` com `ref` do campo de atributos] → o `InfoTrigger` é `type="button"` e não chama `field.onChange`, então não submete o formulário nem altera atributos; um teste cobre isso.
- [Consultas de teste por nome "Vitalidade" podem ficar ambíguas] → os testes usam `getByRole("button", { name: "Vitalidade" })`.
