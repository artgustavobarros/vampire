## 1. Dados e regras

- [x] 1.1 Adicionar `predPoder?: string` ao `Sheet` e `poder?: string` ao `PredatorBonus` em `lib/types.ts`
- [x] 1.2 Mover `toPower` (catálogo → `Power`) do passo 5 para um módulo de regras compartilhado e importar dali no passo 5
- [x] 1.3 Criar `predatorDiscipline(cla, disc, predDisc)` em `rules/predator.ts` devolvendo `doCla`, `atual`, `novo` e `elegiveis` (catálogo até `novo`, sem os poderes do passo 5, em ordem de nível; Caitiff conta como do clã só se a Disciplina está no passo 5)
- [x] 1.4 `applyPredator`: acrescentar o poder de `predPoder` (se estiver no catálogo da Disciplina) à Disciplina existente ou nova, reordenar por nível e gravar `predBonus.poder`
- [x] 1.5 `removePredator`: remover uma ocorrência do poder `predBonus.poder` antes de reduzir o nível ou remover a Disciplina nova
- [x] 1.6 Testes em `rules.test.ts`: `predatorDiscipline` (do clã com 2 pontos, do clã sem pontos, fora do clã, Caitiff, sem catálogo, exclusão dos poderes do passo 5) e ida e volta de `applyPredator`/`removePredator` com poder, sem duplicar

## 2. Formulário e validação do assistente

- [x] 2.1 Adicionar `predPoder` a `WizardValues`, aos valores iniciais vindos da ficha e ao schema do passo 6
- [x] 2.2 Pôr `disc` em `CONTEXT_FIELDS[6]` e validar `predPoder` contra `elegiveis` ("Escolha um poder de <Disciplina>") quando houver elegíveis
- [x] 2.3 Limpar `predPoder` em `wizardToPatch` para Sangue Fraco
- [x] 2.4 Conferir que o modo refazer (`removePredator` na base do formulário) devolve o passo 5 sem o poder do Predador

## 3. UI do passo 6

- [x] 3.1 Extrair o `PowerCard` do passo 5 para um componente compartilhado e reutilizá-lo no passo 5 sem mudar o comportamento
- [x] 3.2 Trocar o `OptionGroup` da Disciplina por cartões com a linha de contexto ("do clã · N → N+1", "do clã · nível 1", "fora do clã · nível 1" em Blood), borda Moss no escolhido, `aria-pressed`, limpando `predPoder` ao trocar
- [x] 3.3 Limpar `predPoder` junto com as outras escolhas ao trocar de Predador
- [x] 3.4 Criar o painel "Poder do Predador": borda tinta/Blood, rótulo, nome, selo "DO CLÃ"/"FORA DO CLÃ", bolinhas (pontos do passo 5 em tinta + uma Blood) e o texto de cada caso
- [x] 3.5 Criar o slot do poder (tracejado Blood com "+" e "1 poder sem escolha" / sólido com nível, "Poder escolhido", nome e "Nível n · custo") e a lista de cartões elegíveis que grava ou limpa `predPoder`; nome abre o painel lateral
- [x] 3.6 Mostrar "Sem poderes catalogados para <Disciplina>. Registre o poder na aba Disciplinas depois." quando não há elegíveis
- [x] 3.7 Atualizar a linha de resumo do Predador para incluir o poder quando houver

## 4. Aba Disciplinas

- [x] 4.1 Trocar a linha expansível de poder por um `InfoTrigger` de largura total (nível, nome, resumo) que abre o painel do poder com `desc`
- [x] 4.2 Adicionar o botão "×" ("Remover <poder>") ao lado da linha, fora do gatilho
- [x] 4.3 Remover `PowerEditor`, o estado `open`/`onToggle`, `ACTION`, `useId` e imports órfãos

## 5. Testes e verificação

- [x] 5.1 `wizard.test.tsx`: cartões de Disciplina com contexto, painel e selo, slot vazio/preenchido, escolher/trocar poder, nome abre o painel sem mudar a escolha, validação "Escolha um poder de …", Disciplina sem catálogo, poder invalidado pelo passo 5
- [x] 5.2 `wizard.test.tsx`: concluir aplica o poder; refazer sem trocar não duplica; trocar de Predador remove o poder antigo
- [x] 5.3 Testes da aba Disciplinas: linha abre o painel do poder, poder fora do catálogo mostra a descrição gravada, "×" remove sem abrir o painel
- [x] 5.4 Rodar `npm test`, o type-check e o lint (ultracite) em `web/` e corrigir o que quebrar
- [ ] 5.5 Conferir no navegador o passo 6 (Ventrue + Extorsionário, Domínio e Potência) e a aba Disciplinas contra as imagens de referência
