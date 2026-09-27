## 1. Regra de limpeza por clã

- [x] 1.1 Criar `keepClanDisciplines(disc, cla)` em `web/src/rules/wizard.ts`, esvaziando (`nome: ""`, `nivel: 0`, `powers: []`) os slots cuja Disciplina não está em `clanDisciplineOptions(cla).options`
- [x] 1.2 Testar em `web/src/rules/rules.test.ts`: Brujah → Ventrue limpa os dois; Brujah → Toreador mantém Presença e limpa Potência; qualquer clã → Caitiff mantém tudo; slots vazios continuam vazios

## 2. Passo 1 — trocar de clã

- [x] 2.1 Em `step1-clan.tsx`, ao clicar num clã diferente do atual, aplicar `setValue("disc", keepClanDisciplines(getValues("disc"), c.name))`

## 3. Passo 5 — seletor e botões

- [x] 3.1 Em `step5-disciplines.tsx`, remover a reinserção do nome gravado fora do clã (`choices.push(nome)`) e o comentário associado
- [x] 3.2 Criar o componente local `LevelButtons` com os botões "+2" e "+1" (`aria-pressed`, `aria-label` "<label> +2"/"<label> +1"), usando as classes do `OptionGroup` do passo 6 (`border-moss bg-field` ativo, `border-ink/20 bg-transparent` inativo)
- [x] 3.3 Substituir o `DotRating` do slot por `LevelButtons`; `onPick` define o nível do slot, põe o complemento no outro, aplica `trimPowers` nos dois e não faz nada quando o botão já está ativo
- [x] 3.4 Remover o import de `DotRating` do passo 5 se ficar sem uso

## 4. Testes do assistente

- [x] 4.1 Atualizar `web/src/features/wizard/wizard.test.tsx`: trocar cliques em "Nível … Disciplina N" pelos botões "… Disciplina +2"/"+1" e as asserções de `aria-pressed`
- [x] 4.2 Adicionar testes: clicar no botão ativo não muda níveis; nenhum botão ativo com níveis 0; Disciplina de outro clã gravada não aparece nas opções; trocar de clã no passo 1 limpa os slots inválidos
- [x] 4.3 Rodar a suíte de testes e o lint (`ultracite`) do `web` e corrigir o que quebrar
