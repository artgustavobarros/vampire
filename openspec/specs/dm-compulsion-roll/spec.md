# dm-compulsion-roll Specification

## Purpose
TBD - created by archiving change rolagem-compulsao. Update Purpose after archive.
## Requirements
### Requirement: Painel da Rolagem de Compulsão
A aba "Ações" do painel do Mestre (`/personagens/acoes`) SHALL mostrar o painel "Rolagem de Compulsão" (fundo `surface`, borda `line`), com o rótulo em sangue (título de seção com id `rolagem-compulsao`) e o texto "Numa falha bestial, marque o clã do vampiro e role a compulsão.". O painel MUST ter um grupo de selos (`Chip`) rotulado "Clã" com "Não informado" seguido dos nomes dos clãs de `data/clans.ts`, na ordem do arquivo. Exatamente um selo MUST ficar marcado (tinta, `aria-pressed="true"`), e o grupo MUST começar em "Não informado". Abaixo do grupo, MUST ter o botão sangue de largura total "Rolar compulsão". O painel MUST terminar com a nota em texto suave: "Compulsão em d10: 1–3 fome, 4–5 dominância, 6–7 dano, 8–9 paranoia, 10 compulsão do clã (Caitiff e Sangue-ralo rolam de novo).". No celular os selos MUST quebrar linha sem rolagem horizontal.

#### Scenario: Estado inicial
- **WHEN** o Mestre abre a aba Ações
- **THEN** o painel "Rolagem de Compulsão" aparece com "Não informado" marcado no grupo Clã e o botão "Rolar compulsão"

#### Scenario: Marcar um clã
- **WHEN** o Mestre marca "Brujah" no grupo Clã
- **THEN** só "Brujah" fica marcado no grupo

### Requirement: Tabela da compulsão
Ao tocar em "Rolar compulsão", o app SHALL rolar um d10: 1–3 Fome, 4–5 Dominância, 6–7 Dano, 8–9 Paranoia, 10 Compulsão de Clã. No 10, se o clã marcado não tem compulsão de clã (`compulsion` igual a "Nenhuma" em `data/clans.ts`, isto é, Caitiff e Sangue-ralo), o d10 MUST ser rolado de novo até sair 1–9, e o resultado é o da tabela para esse último dado. Todos os dados rolados MUST ser guardados, na ordem. A lógica MUST ser uma função pura que recebe o clã marcado (ou nenhum) e o gerador de números, para ser testada com dados fixos.

#### Scenario: Fome
- **WHEN** o d10 sai 2
- **THEN** a compulsão é Fome

#### Scenario: Limites da tabela
- **WHEN** o d10 sai 3, 4, 5, 6, 7, 8 ou 9
- **THEN** a compulsão é, respectivamente, Fome, Dominância, Dominância, Dano, Dano, Paranoia, Paranoia

#### Scenario: Compulsão de clã com clã marcado
- **WHEN** "Brujah" está marcado e o d10 sai 10
- **THEN** a compulsão é a de clã, com o clã Brujah (Rebelião), sem rolar de novo

#### Scenario: Compulsão de clã sem clã informado
- **WHEN** "Não informado" está marcado e o d10 sai 10
- **THEN** a compulsão é a de clã, sem clã, sem rolar de novo

#### Scenario: Caitiff rola de novo
- **WHEN** "Caitiff" está marcado e os dados saem 10, 10 e depois 6
- **THEN** a compulsão é Dano e os dados guardados são 10, 10, 6

### Requirement: Cartão do resultado da compulsão
Ao lado do painel (abaixo dele no celular), a Rolagem de Compulsão SHALL mostrar um cartão com fundo `ink`, texto claro e filete superior `blood` de 4px, numa região rotulada "Resultado da compulsão" com `aria-live="polite"`. Antes da primeira rolagem da visita, e depois de "Limpar", o cartão MUST mostrar só "O resultado da compulsão aparece aqui.". Logo acima do cartão, alinhado à direita, MUST ficar o botão de texto "Limpar" (Karla caixa-alta pequena, cor `blood`, nome acessível "Limpar compulsão"), visível só quando há resultado. Tocar nele MUST voltar o cartão ao texto inicial, sem mudar o clã marcado. O resultado vive só na visita: não é guardado no aparelho nem há lista de rolagens anteriores.

Depois de rolar, o cartão MUST mostrar, em ordem:
- o rótulo (Karla caixa-alta pequena, sangue claro): "Compulsão" nas compulsões gerais, "Compulsão de Clã · <clã>" na de clã com clã marcado, e "Compulsão de Clã" sem clã;
- o nome (Cormorant, grande): o nome da compulsão geral, o `compulsion` do clã, ou "Compulsão de Clã" sem clã;
- o texto: o efeito da compulsão geral, o `compulsionText` do clã, ou "Use a compulsão do clã do personagem." sem clã;
- em itálico, "Dura até ser satisfeita ou até o fim da cena.";
- a linha dos dados em Karla pequena e suave: "Compulsão d10: <n>", ou os dados separados por ", " quando houve nova rolagem (ex.: "Compulsão d10: 10, 10, 6").

Os textos das compulsões gerais MUST vir de `data/compulsions.ts`:

| d10 | Nome | Efeito |
|---|---|---|
| 1–3 | Fome | A Besta exige sangue. −2 dados em toda ação que não seja para se alimentar, até saciar ao menos 1 de Fome. |
| 4–5 | Dominância | Precisa provar que está no controle. −2 dados em toda ação que não seja para impor sua vontade, até dominar alguém ou vencer uma disputa. |
| 6–7 | Dano | A Besta quer ferir. −2 dados em toda ação que não seja para machucar alguém, até causar dano, mesmo Superficial. |
| 8–9 | Paranoia | Todos parecem uma ameaça. −2 dados em toda ação que não seja para se proteger ou descobrir quem está contra ele, até se sentir seguro. |

#### Scenario: Cartão de compulsão geral
- **WHEN** o d10 sai 4
- **THEN** o cartão mostra "Compulsão", "Dominância", o efeito de Dominância, "Dura até ser satisfeita ou até o fim da cena." e "Compulsão d10: 4"

#### Scenario: Cartão de compulsão de clã
- **WHEN** "Brujah" está marcado e o d10 sai 10
- **THEN** o cartão mostra "Compulsão de Clã · Brujah", "Rebelião", o `compulsionText` dos Brujah e "Compulsão d10: 10"

#### Scenario: Cartão sem clã informado
- **WHEN** "Não informado" está marcado e o d10 sai 10
- **THEN** o cartão mostra "Compulsão de Clã" como rótulo e nome, "Use a compulsão do clã do personagem." e "Compulsão d10: 10"

#### Scenario: Linha com nova rolagem
- **WHEN** "Sangue-ralo" está marcado e os dados saem 10 e depois 1
- **THEN** o cartão mostra "Fome" e a linha "Compulsão d10: 10, 1"

#### Scenario: Limpar o resultado
- **WHEN** há um resultado no cartão e o Mestre toca em "Limpar compulsão"
- **THEN** o cartão mostra "O resultado da compulsão aparece aqui.", o botão some e o clã marcado continua o mesmo

#### Scenario: Independente da Ressonância
- **WHEN** o Mestre rola a compulsão e depois limpa o resultado da Ressonância
- **THEN** o cartão da compulsão continua mostrando seu resultado

