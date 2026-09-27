## Context

`web/src/data/predators.ts` tem 12 Tipos de Predador portados de `design/reference/logic.js`. A conferência contra os livros da coleção deu o seguinte:

- **Livro Básico PT-BR (p. 175–178)**: 10 tipos. Os 10 existem no código, alguns com outro nome: Vira-lata = Gato de Rua, Sacoleiro = Saqueador, Trinchador = Doméstico, Sandman = João Pestana, Scene Queen = Rainha da Cena.
- **Players Guide (p. 107–109)**: mais 6 tipos. Extortionist (Extorsionário) e Graverobber (Ladrão de Túmulos) já existem; faltam Grim Reaper, Montero, Pursuer e Trapdoor.
- **Fachada Esfarrapada (tradução)**: resume os mesmos 16 tipos (Tabela 32) e dá os nomes em português Ceifador, Montero, Perseguidor e Alçapão.

Os dados dos 12 atuais divergem do livro em quase todos os tipos. Os ajustes já são estruturados (`humanidade`, `potencia`, `merito`, `escolha`, `nota`), e `rules/predator.ts` os aplica ao concluir. O que falta no modelo são as restrições do livro: clãs proibidos, Potência de Sangue máxima e uma Disciplina restrita a certos clãs.

## Goals / Non-Goals

**Goals:**
- 16 Predadores com especialidades, Disciplinas e ajustes fiéis ao Livro Básico e ao Players Guide.
- Restrições do livro aplicadas no passo 6: aparecem na tela e a validação as exige.
- Disciplinas e méritos do Predador com os mesmos nomes usados no resto do app.

**Non-Goals:**
- Renomear os 12 tipos atuais para os nomes do Livro Básico PT-BR.
- Acrescentar ao catálogo `data/merits.ts` os méritos que só o Predador usa (Sabujo de Sangue, Predador Óbvio, Refúgio Assustador, Refúgio Assombrado, Rejeitado, Defeito Mítico).
- Parada de dados de caça (Predator Pool) e migração de fichas concluídas.

## Decisions

### 1. Dados canônicos dos 16 tipos

Os nomes de Disciplina seguem `DISCIPLINES`/clãs. Os nomes de mérito seguem `data/merits.ts` quando o mérito existe lá. "Uma de" vira `escolha` no modo `uma`; "N pontos entre" vira `escolha` no modo `dividir`.

| Predador (livro) | Especialidades | Disciplinas | Ajustes |
|---|---|---|---|
| Gato de Rua (Vira-lata) | Intimidação (Assalto à Mão Armada), Briga (Agarramento) | Celeridade, Potência | Humanidade −1; Contatos ••• (criminosos) |
| Saqueador (Sacoleiro) | Ladroagem (Abrir Fechaduras), Manha (Mercado Negro) | Feitiçaria de Sangue¹, Ofuscação | Estômago de Ferro •••; Inimigo •• |
| Sanguessuga | Briga (Membros), Furtividade (contra Membros) | Celeridade, Proteanismo | Humanidade −1; Potência +1; escolha `uma` de defeito •• entre Segredo Obscuro (diablerista) e Evitado; Presa Excluída •• (mortais) |
| Doméstico (Trinchador) | Persuasão (Gaslighting), Subterfúgio (Encobrimento) | Dominação, Animalismo | Segredo Obscuro • (Trinchador); Rebanho •• |
| Consensualista | Medicina (Flebotomia), Persuasão (Bolsas) | Auspícios, Fortitude | Humanidade +1; Segredo Obscuro • (Quebrador da Máscara); Presa Excluída • (sem consentimento) |
| Fazendeiro² | Empatia com Animais (Animal Específico), Sobrevivência (Caça) | Animalismo, Proteanismo | Humanidade +1; Vegano •• |
| Osíris | Ocultismo (Tradição Específica), Performance (Campo de Entretenimento) | Feitiçaria de Sangue¹, Presença | escolha `dividir` de vantagem, 3 pontos entre Fama e Rebanho; escolha `dividir` de defeito, 2 pontos entre Inimigo e Defeito Mítico |
| João Pestana (Sandman) | Medicina (Anestésicos), Furtividade (Invasão) | Auspícios, Ofuscação | Recursos • |
| Rainha da Cena (Scene Queen) | Etiqueta (Cena), Liderança (Cena), Manha (Cena) | Dominação, Potência | Fama •; Contatos •; escolha `uma` de defeito • entre Rejeitado (fora da subcultura) e Presa Excluída (outra subcultura) |
| Sereia | Persuasão (Sedução), Subterfúgio (Sedução) | Fortitude, Presença | Bonito ••; Inimigo • (amante desprezado ou parceiro ciumento) |
| Extorsionário | Intimidação (Coerção), Ladroagem (Segurança) | Dominação, Potência | escolha `dividir` de vantagem, 3 pontos entre Contatos e Recursos; Inimigo •• (polícia ou vítima) |
| Ladrão de Túmulos | Ocultismo (Rituais Fúnebres), Medicina (Cadáveres) | Fortitude, Oblívio | Estômago de Ferro •••; Refúgio •; Predador Óbvio •• |
| Ceifador (Grim Reaper) | Percepção (Morte), Ladroagem (Falsificação) | Auspícios, Oblívio | Humanidade +1; escolha `uma` de vantagem • entre Aliados e Influência (comunidade médica); Presa Excluída • (mortais saudáveis) |
| Montero | Liderança (Matilha de Caça), Furtividade (Tocaia) | Dominação, Ofuscação | Humanidade −1; Lacaios •• |
| Perseguidor (Pursuer) | Investigação (Perfil), Furtividade (Seguir) | Animalismo, Auspícios | Humanidade −1; Sabujo de Sangue •; Contatos • (frequentadores do território de caça) |
| Alçapão (Trapdoor) | Persuasão (Marketing), Furtividade (Emboscadas) | Proteanismo, Ofuscação | Refúgio •; escolha `uma` de vantagem • entre Lacaios, Rebanho e Refúgio; escolha `uma` de defeito • entre Refúgio Assustador e Refúgio Assombrado |

¹ Feitiçaria de Sangue só para Tremere e Banu Haqim. O Livro Básico diz "somente Tremere", e a nota do Players Guide (p. 107) estende a Banu Haqim no Saqueador e no Osíris.
² Fazendeiro: Ventrue não pode escolher, e a Potência de Sangue precisa ser 2 ou menos. O Saqueador também não pode ser Ventrue.

A Awareness do Players Guide é "Percepção" na lista de habilidades do app (`data/traits.ts`). As especialidades e os nomes dos tipos que só existem em inglês foram traduzidos aqui. Para os tipos, usamos os nomes da tradução de Fachada Esfarrapada.

### 2. Restrições como dados, avaliadas por uma regra

`Predator` ganha dois campos opcionais: `clasProibidos?: readonly string[]` e `potenciaMaxima?: number`. As opções de Disciplina passam de `string` para `{ nome: string; clas?: readonly string[] }`, e `clas` restringe a opção. Em `rules/predator.ts` entram:
- `predatorBlock(predator, { cla, geracao })`, que devolve o motivo (`"Ventrue não pode ser Fazendeiro"`, `"Exige Potência de Sangue 2 ou menos"`) ou `null`. A Potência vem de `potencyFromGeneration`, sem o ajuste do Predador, porque no assistente o Predador ainda não foi aplicado.
- `disciplineBlock(option, cla)`, que devolve `"só Tremere e Banu Haqim"` ou `null`.

O passo 6 e o schema usam as mesmas funções, então a tela e a validação não divergem. Alternativa descartada: esconder os cartões e as opções proibidas. Isso esconderia do jogador por que um tipo do livro não aparece.

O passo 1 grava clã e Geração, e o passo 6 lê esses valores como contexto (hoje já lê o clã). Se o jogador trocar o clã depois de escolher o Predador, o cartão escolhido aparece desabilitado e marcado, e "Continuar" mostra o motivo. O Predador não é apagado automaticamente, igual ao que já acontece com as Disciplinas fora do clã no passo 5.

### 3. Sai o ajuste `nota`

A única `nota` era "Exige Humanidade 8 ou mais" do Fazendeiro, e ela estava errada: o livro restringe a Potência, não a Humanidade. Com a restrição virando dado, nenhum Predador usa `nota`. Saem o tipo, o caso em `adjustmentTone` e a menção na spec.

### 4. Méritos iguais somam

`predatorMerits` agrupa as linhas por `nome` (com detalhe) e `tipo`, somando os pontos. O único caso é o Alçapão com o segundo ponto de Refúgio (Refúgio 2). Linhas separadas ("Refúgio" 1 + "Refúgio" 1) atrapalhariam a leitura e a soma na ficha.

### 5. Disciplina fora das opções e o painel "sem catálogo"

Um `predDisc` gravado que não está entre as opções do Predador (fichas antigas com "Fascinação", "Domínio" ou "Protean") aparece sem escolha, e a validação pede a Disciplina. Como todas as Disciplinas dos 16 tipos têm poderes no catálogo, o painel "Sem poderes catalogados para <Disciplina>…" do passo 6 fica sem uso e sai.

## Risks / Trade-offs

- [Fichas concluídas com dados antigos (Humanidade −1 da Sereia, "Fascinação", "Belíssimo")] → não são migradas. Ao refazer, o Predador é removido pelo `predBonus` gravado e reaplicado com os dados novos, o que corrige a ficha.
- [Nomes em português traduzidos por nós para tipos e especialidades do Players Guide] → seguimos a Fachada Esfarrapada nos nomes dos tipos. O nome da especialidade é editável no passo 6.
- [Méritos do Predador que não existem no catálogo] → aparecem na lista de méritos sem a descrição do catálogo, como acontece hoje com "Belíssimo" e "Status Negativo". Acrescentá-los ao catálogo fica para uma mudança do `v5-merits-catalog`.
- [Nomes dos 12 tipos diferentes do Livro Básico PT-BR] → mantidos de propósito, para não invalidar o `predador` das fichas gravadas. A tabela acima registra a correspondência.
