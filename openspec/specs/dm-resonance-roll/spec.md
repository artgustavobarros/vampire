# dm-resonance-roll Specification

## Purpose
Aba Ações do painel do Mestre: Rolagem de Ressonância com tabelas de d10 para intensidade e humor, discrasias em d3 e cartão de resultado com "Limpar".
## Requirements
### Requirement: Escolha do que rolar
A aba "Ações" do painel do Mestre (`/personagens/acoes`) SHALL mostrar o painel "Rolagem de Ressonância" (fundo `surface`, borda `line`) com o rótulo em sangue, o texto "Deixe em Aleatória o que quer sortear. Fixe a ressonância ou a intensidade para rolar só o resto." e dois grupos de selos (`Chip`) rotulados: "Ressonância" — Aleatória, Colérica, Melancólica, Fleumática, Sanguínea — e "Intensidade" — Aleatória, Negligenciável, Difusa, Intensa, Aguçada — e um terceiro grupo "Sangue-fraco" — Não, Sim. Cada grupo MUST ter exatamente um selo marcado (tinta, `aria-pressed="true"`); Ressonância e Intensidade MUST começar em "Aleatória" e Sangue-fraco em "Não". Abaixo dos grupos, o painel MUST ter o botão sangue de largura total, com rótulo "Rolar discrasia" quando a Ressonância está fixa e a Intensidade está fixa em Aguçada, e "Rolar ressonância" em qualquer outro caso. O painel MUST terminar com a nota em texto suave: "Intensidade em d10: 1–5 negligenciável, 6–8 difusa, 9–10 rola de novo (9–10 aguçada, senão intensa). Ressonância em d10: 1–3 fleumática, 4–6 melancólica, 7–8 colérica, 9–10 sanguínea.". No celular os selos MUST quebrar linha sem rolagem horizontal.

#### Scenario: Estado inicial
- **WHEN** o Mestre abre a aba Ações
- **THEN** "Aleatória" está marcada em Ressonância e Intensidade, "Não" em Sangue-fraco, e o botão diz "Rolar ressonância"

#### Scenario: Fixar ressonância e intensidade aguçada
- **WHEN** o Mestre marca "Fleumática" e "Aguçada"
- **THEN** só esses dois selos (um por grupo) ficam marcados e o botão diz "Rolar discrasia"

#### Scenario: Fixar só a intensidade
- **WHEN** o Mestre marca "Aguçada" e deixa a Ressonância em "Aleatória"
- **THEN** o botão diz "Rolar ressonância"

### Requirement: Tabelas da rolagem
Ao rolar, o que estiver em "Aleatória" SHALL ser sorteado com dados de 10 faces, e o que estiver fixo MUST ser usado sem rolar. Ressonância em d10: 1–3 Fleumática, 4–6 Melancólica, 7–8 Colérica, 9–10 Sanguínea. Intensidade em d10: 1–5 Negligenciável, 6–8 Difusa, 9–10 rola um segundo d10 — 9–10 Aguçada, senão Intensa. Quando a intensidade final é Aguçada, MUST ser sorteada uma discrasia do humor em d3 (sempre rolada, mesmo com tudo fixo); nas outras intensidades não há discrasia. Com "Sangue-fraco" em Sim e intensidade final Intensa ou Aguçada, MUST ser sorteada uma Disciplina do humor (d2, entre as duas do humor) e um poder dessa Disciplina — de nível 1 em Intensa e de nível 2 em Aguçada — com um dado do tamanho da lista de poderes daquele nível; se houver só um poder no nível, ele é usado sem rolar. A lista de poderes MUST excluir rituais (poderes com ingredientes), poderes de amálgama e as entradas duplicadas por apelido (`POWER_ALIASES`). Sem sangue-fraco, ou em Negligenciável/Difusa, não há Disciplina nem poder. Os dados MUST ser rolados nesta ordem: ressonância, intensidade, discrasia, Disciplina, poder. A lógica MUST ser uma função pura que recebe as escolhas e o gerador de números, para ser testada com dados fixos.

#### Scenario: Tudo aleatório sem segundo dado
- **WHEN** a Ressonância e a Intensidade estão em Aleatória e os dados saem Ressonância 5 e Intensidade 7
- **THEN** o resultado é Melancólica, Difusa, sem discrasia

#### Scenario: Segundo dado de intensidade
- **WHEN** a Intensidade está em Aleatória e os dados de intensidade saem 9 e depois 10
- **THEN** a intensidade é Aguçada e uma discrasia é sorteada em d3

#### Scenario: Segundo dado baixo
- **WHEN** os dados de intensidade saem 10 e depois 4
- **THEN** a intensidade é Intensa, sem discrasia

#### Scenario: Sangue-fraco com Intensa
- **WHEN** Sangue-fraco está em Sim, o Mestre fixa Fleumática e Intensa, e os dados saem Disciplina 1 e Poder 2
- **THEN** o resultado traz Auspícios, nível 1, o segundo poder de nível 1 de Auspícios, sem discrasia

#### Scenario: Sangue-fraco com Aguçada
- **WHEN** Sangue-fraco está em Sim, o Mestre fixa Fleumática e Aguçada, e os dados saem Discrasia 1 e Disciplina 1
- **THEN** o resultado traz a discrasia Frieza e Auspícios nível 2 com o único poder de nível 2 ("Premonição"), sem dado de poder

#### Scenario: Sangue-fraco sem efeito
- **WHEN** Sangue-fraco está em Sim e a intensidade final é Difusa
- **THEN** não é sorteada Disciplina nem poder

#### Scenario: Tudo fixo em Aguçada
- **WHEN** o Mestre fixa Fleumática e Aguçada e o d3 sai 1
- **THEN** o resultado é Fleumática, Aguçada, discrasia "Frieza", sem rolar d10

### Requirement: Cartão de resultado
Ao lado do painel (abaixo dele no celular), a aba SHALL mostrar o cartão do resultado com fundo `ink`, texto claro e filete superior `blood` de 4px. Antes da primeira rolagem da visita, e depois de "Limpar", o cartão MUST mostrar só "O resultado da rolagem aparece aqui.". Logo acima do cartão, alinhado à direita, MUST ficar o botão de texto "Limpar" (Karla caixa-alta pequena, cor `blood`), visível só quando há resultado; tocar nele MUST voltar o cartão ao texto inicial, sem mexer nas escolhas do painel. O resultado vive só na visita: não é guardado no aparelho nem há lista de rolagens anteriores. Depois de rolar, o cartão MUST mostrar, em ordem: a intensidade (Karla caixa-alta pequena, sangue claro); o nome do humor (Cormorant, grande); as emoções do humor em itálico; as Disciplinas do humor como selos contornados; o efeito da intensidade; quando há poder de sangue-fraco, depois de um filete, o rótulo "<Disciplina> · Nível <n>" (sangue claro), o nome do poder (Cormorant), a primeira frase da descrição e, em Karla pequena e suave, "<custo> · <duração>"; e, só em Aguçada, depois de um filete, o rótulo "Discrasia", o nome da discrasia e sua descrição. O cartão MUST terminar com a linha dos dados em Karla pequena e suave, com as partes separadas por " · ": primeiro os dados rolados, na ordem em que foram rolados — "Ressonância d10: <n>", "Intensidade d10: <n>" (ou "<n>, <m>" com o segundo dado), "Discrasia d3: <n>", "Disciplina d2: <n>", "Poder d<k>: <n>" — e depois o que foi escolhido — "<humor> (escolhida)", "<intensidade> (escolhida)". O resultado MUST ser anunciado a leitores de tela (região `aria-live="polite"`).

| Humor | Emoções | Disciplinas | Discrasias (d3) |
|---|---|---|---|
| Colérica | Raiva, paixão, violência, inveja, ambição. | Celeridade, Potência | 1 Fúria — Qualquer provocação vira briga; a raiva não esfria. 2 Inveja — Deseja o que é dos outros e não suporta ficar atrás. 3 Crueldade — Prazer em ferir e dominar quem é mais fraco. |
| Melancólica | Tristeza, medo, luto, introspecção, desânimo. | Fortitude, Oblívio | 1 Luto — Uma perda recente pesa sobre tudo. 2 Nostalgia — Preso ao passado, revive o que já não existe. 3 Desespero — Nenhuma saída parece possível. |
| Fleumática | Preguiça, apatia, calma, controle, sentimentalismo. | Auspícios, Dominação | 1 Frieza — Calma absoluta, quase clínica, diante de qualquer coisa. 2 Apatia — Nada importa o bastante para agir. 3 Controle — Tudo precisa seguir o plano, sem desvio. |
| Sanguínea | Alegria, desejo, entusiasmo, excitação, vício. | Feitiçaria de Sangue, Presença | 1 Euforia — Alegria transbordante, sem medo das consequências. 2 Paixão — Desejo intenso por uma pessoa ou coisa. 3 Vício — Precisa de mais, e de novo. |

| Intensidade | Efeito |
|---|---|
| Negligenciável | Humor fraco demais: o sangue só sacia a Fome, sem bônus. |
| Difusa | +1 dado nas paradas das Disciplinas do humor enquanto a Ressonância durar. |
| Intensa | Mesmo bônus da Difusa, e o sangue permite aprender pontos das Disciplinas do humor. |
| Aguçada | Mesmo bônus da Intensa, e o sangue carrega uma discrasia. Para obtê-la é preciso drenar o recipiente ou alimentar-se dele por três noites. |

#### Scenario: Resultado aguçado com tudo fixo
- **WHEN** o Mestre fixa Fleumática e Aguçada, rola e o d3 sai 1
- **THEN** o cartão mostra "Aguçada", "Fleumática", "Preguiça, apatia, calma, controle, sentimentalismo.", os selos "Auspícios" e "Dominação", o efeito de Aguçada, "Discrasia", "Frieza", "Calma absoluta, quase clínica, diante de qualquer coisa." e a linha "Discrasia d3: 1 · Fleumática (escolhida) · Aguçada (escolhida)"

#### Scenario: Resultado aleatório sem discrasia
- **WHEN** tudo está em Aleatória e os dados saem Ressonância 8 e Intensidade 3
- **THEN** o cartão mostra "Negligenciável", "Colérica", os selos "Celeridade" e "Potência", sem seção de discrasia, e a linha "Ressonância d10: 8 · Intensidade d10: 3"

#### Scenario: Poder de sangue-fraco no cartão
- **WHEN** Sangue-fraco está em Sim, a Intensidade está fixa em Aguçada e os dados saem Ressonância 3, Discrasia 1 e Disciplina 1
- **THEN** o cartão mostra, antes da discrasia, "Auspícios · Nível 2", "Premonição", a primeira frase da descrição e "<custo> · <duração>" do poder, e a linha "Ressonância d10: 3 · Discrasia d3: 1 · Disciplina d2: 1 · Aguçada (escolhida)"

#### Scenario: Segundo dado na linha
- **WHEN** os dados saem Ressonância 1 e Intensidade 9 e depois 3
- **THEN** a linha termina com "Intensidade d10: 9, 3" e a intensidade é "Intensa"

#### Scenario: Limpar o resultado
- **WHEN** há um resultado no cartão e o Mestre toca em "Limpar"
- **THEN** o cartão mostra "O resultado da rolagem aparece aqui.", o "Limpar" some e as escolhas do painel continuam as mesmas

#### Scenario: Sem resultado não há Limpar
- **WHEN** o Mestre abre a aba Ações
- **THEN** o botão "Limpar" não aparece

### Requirement: Layout da aba Ações
A Rolagem de Ressonância SHALL usar duas colunas a partir de `md`: o painel de escolha à esquerda e, à direita, "Limpar" e o cartão de resultado. No celular, MUST usar uma coluna, na ordem painel, resultado.

Logo abaixo da Rolagem de Ressonância, a aba MUST mostrar a Rolagem de Compulsão (ver `dm-compulsion-roll`), com o mesmo layout de duas colunas a partir de `md` (painel à esquerda, "Limpar" e cartão à direita) e uma coluna no celular.

Abaixo da Rolagem de Compulsão, a aba MUST mostrar a seção do Gerador de NPC (ver `npc-generator`), com largura total, separada por um título centralizado entre dois filetes `ink`. Estilos MUST ser classes Tailwind no JSX, reaproveitando `Chip` e `Button` existentes, sem regras novas em `styles.css`.

#### Scenario: Celular
- **WHEN** a aba é aberta numa tela de 375px
- **THEN** painel e resultado da Ressonância, painel e resultado da Compulsão e Gerador de NPC aparecem empilhados, nessa ordem, sem rolagem horizontal

#### Scenario: Compulsão abaixo da ressonância
- **WHEN** o Mestre abre `/personagens/acoes`
- **THEN** logo abaixo da Rolagem de Ressonância aparece o painel "Rolagem de Compulsão"

#### Scenario: Gerador abaixo da compulsão
- **WHEN** o Mestre abre `/personagens/acoes`
- **THEN** abaixo da Rolagem de Compulsão aparece o título "Gerador de NPC · Sertão alagoano, 1936" e o painel de filtros do gerador

