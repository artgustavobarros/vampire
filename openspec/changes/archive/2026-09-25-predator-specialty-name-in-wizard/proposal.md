## Why

Hoje o nome da especialidade do Predador só é ajustado depois de criar o personagem: ela aparece pendente em Blood na aba Ficha e o jogador precisa abrir o selo para confirmar ou renomear. O poder da Disciplina do Predador já é escolhido no passo 6; a especialidade deve seguir o mesmo caminho e sair do assistente pronta, sem etapa pendente na ficha.

## What Changes

- **Passo 6 — Especialidade do Predador**: ao escolher uma das duas especialidades, aparece abaixo dos botões um painel "Especialidade em <Habilidade>" com uma marca quadrada (tinta com ✓ quando há nome), um campo pré-preenchido com o nome sugerido pelo Predador (ex.: "Armadilhas") e a dica "Sugestão do Predador: <Nome>. Renomeie se quiser; na ficha ela fica fixa."
- O nome é gravado no passo 6 em `predEspecNome`. Trocar de especialidade repõe a sugestão da nova; trocar de Predador limpa. O nome é obrigatório para avançar ("Informe o nome da especialidade do Predador"). Sangue Fraco grava vazio.
- **Aba Ficha**: a especialidade do Predador passa a ser um selo comum (borda tinta), com o nome de `predEspecNome` ou, em fichas antigas sem ele, o nome sugerido. **BREAKING** (UX): sai o estado pendente em Blood, a nota do Predador e o formulário "Nome da especialidade" com "Confirmar nome"/"Manter atual" no painel; o toast "Especialidade … fixada em …" também sai. Para renomear depois, o jogador refaz o passo 6.
- Sai a regra que apagava `predEspecNome` ao gravar outra especialidade do Predador (o nome agora vem junto com a escolha).

## Capabilities

### New Capabilities
<!-- nenhuma -->

### Modified Capabilities
- `character-wizard`: o passo 6 ganha o painel de nome da especialidade do Predador, com o campo `predEspecNome` gravado e validado no passo.
- `character-sheet`: "Especialidades na aba Ficha" perde o estado pendente e a confirmação única; o selo do Predador é comum.
- `trait-info`: "Painel de especialidade" perde a nota do Predador e o formulário de renomear.

## Impact

- Assistente: `features/wizard/schema.ts` (`predEspecNome` nos valores, no passo 6, na validação e na limpeza de Sangue Fraco; remoção da limpeza em `wizardToPatch`), `features/wizard/step6-predator.tsx` (painel do nome).
- Regras: `rules/specialties.ts` (sem `pendente` e sem `confirmPredatorSpecialty`; nova função para separar habilidade e nome sugerido de `predEspec`).
- Ficha/painel: `components/vtm/trait-grid.tsx` (selo comum, sem prop `predador`), `features/info/build-info.ts` (alvo `espec` sem `predador`, sem `renomear`), `features/info/info-sheet.tsx` e `features/info/specialty-rename.tsx` (removido).
- Tipos: `lib/types.ts` (comentário de `predEspecNome`).
- Testes: `wizard.test.tsx`, `schema.test.ts`, `rules.test.ts`, `build-info.test.ts`, `info-sheet.test.tsx`, `components.test.tsx`.
