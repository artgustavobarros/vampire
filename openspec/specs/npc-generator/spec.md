# npc-generator Specification

## Purpose
Gerador de NPC do Sertão alagoano, 1936, na aba Ações do Mestre: listas e regras da planilha do gerador, cartão do NPC, resumo para ler na mesa e rolagem de intensidade da ressonância.
## Requirements
### Requirement: Listas do gerador
As listas do Gerador de NPC SHALL vir da planilha `Gerador_NPC_Sertao_Alagoano_1936_V10.xlsx` (aba `Listas`), convertidas por um script do repositório para um módulo de dados do web. Cada coluna usada pela aba `NPC` da planilha vira uma lista com os mesmos itens, na mesma ordem e com as repetições. Um item repetido tem mais chance de sair: duas vezes vale o dobro.

Os pesos também vêm da planilha:

| Sorteio | Peso em 100 |
|---|---|
| Estrato social 1 · muito pobre e pobre | 62 |
| Estrato social 2 · remediado | 30 |
| Estrato social 3 · de posses | 8 |
| Exposição ao oculto, grau 0 | 60 |
| Grau 1 | 20 |
| Grau 2 | 12 |
| Grau 3 | 6 |
| Grau 4 | 2 |

As colunas que a aba `NPC` não usa (`Alcunha_H`, `Alcunha_M`, `Carrega`, `OndeEncontra`) MUST NOT entrar no módulo. O NPC MUST NOT ser salvo na API nem no aparelho.

#### Scenario: Peso por repetição
- **WHEN** a coluna `Apresentacao` tem 10 "Homem" e 10 "Mulher"
- **THEN** o módulo tem os 20 itens, e cada apresentação sai com chance 1/2

#### Scenario: Regerar as listas
- **WHEN** o Mestre edita a planilha e roda o script de conversão apontando para ela
- **THEN** o módulo de listas é reescrito com o conteúdo novo, sem outra mudança de código

### Requirement: Regras de sorteio do NPC
O sorteio SHALL ser uma função pura, com o gerador de números injetável (como `rollResonance`), que segue a aba `NPC` da planilha nesta ordem:

1. **Apresentação**: a escolhida, ou sorteada de `Apresentacao`.
2. **Estrato**: o escolhido (Pobre = 1, Remediado = 2, De posses = 3), ou sorteado por d100 com os pesos acima.
3. **Nome**: de `Nomes_H` ou `Nomes_M`, conforme a apresentação, seguido de um sobrenome de `Sobrenomes`.
4. **Alcunha**: d10. De 1 a 6, um prefixo de `Alc_Pre_H` ou `Alc_Pre_M` + um complemento de `Alc_Comp`. De 7 a 9, uma de `Alc_Solta`. Em 10, sem alcunha.
5. **Ocupação**: da lista da apresentação e do estrato (`Ocup_H_T1..T3`, `Ocup_M_T1..T3`).
6. **Idade**: de `Idade_Ativa` se a ocupação está em `Ocup_Ativas`; senão, de `Idade_Geral`.
7. **Condição social**: de `Cond_T<estrato>`.
8. **Alfabetização**: "lê e escreve bem" se a ocupação está em `Ocup_Letradas`; senão, de `Alfab_T<estrato>`.
9. **Vestimenta**: da lista da apresentação. No estrato 3, `Vest_*_Posses`; nos demais, `Vest_*_Pobre`.
10. **Virtudes e falhas**: duas virtudes diferentes de `Virtudes` e duas falhas diferentes de `Falhas`.
11. **Temperamento e Ressonância**: sorteia uma linha de `Temperamento` e usa a mesma linha de `Ressonancia`, que é derivada do temperamento, não sorteada à parte.
12. **Exposição ao oculto**: a escolhida (0–4), ou sorteada por d100 com os pesos acima. O texto da exposição vem de `Grau_Texto` e "o que viu ou sabe" de `Oculto_G<grau>`.
13. **Gancho de cena**: d10. De 1 a 5, um de `Gancho`. De 6 a 10, "quer <Gancho_Verbo> <Gancho_Alvo>, para <Gancho_Motivo>".
14. **O que carrega**: "<Carrega_Item> <Carrega_Material>, <Carrega_Detalhe>".
15. **Demais campos**: um item de cada lista correspondente.

#### Scenario: Ocupação letrada
- **WHEN** a ocupação sorteada é "padre"
- **THEN** a alfabetização é "lê e escreve bem", qualquer que seja o estrato

#### Scenario: Ocupação de corpo
- **WHEN** a ocupação sorteada está em `Ocup_Ativas` (por exemplo, "cangaceiro")
- **THEN** a idade sai de `Idade_Ativa`

#### Scenario: Virtudes diferentes
- **WHEN** o gerador injetado devolve o mesmo número para as duas virtudes
- **THEN** a segunda virtude ainda é diferente da primeira

#### Scenario: Estrato fixo
- **WHEN** o Mestre escolhe "De posses"
- **THEN** a condição sai de `Cond_T3`, a ocupação da lista T3 da apresentação e a vestimenta da lista de posses

### Requirement: Filtros e botão Gerar NPC
A seção do gerador, abaixo da Rolagem de Ressonância na aba Ações, SHALL ter:
- o título centralizado "Gerador de NPC · Sertão alagoano, 1936" (Cormorant, entre dois filetes `ink`);
- um painel (fundo `surface`, borda `line`) com três grupos de `Chip`:

| Grupo | Opções |
|---|---|
| "Apresentação" | Aleatória, Homem, Mulher |
| "Estrato social" | Aleatório, Pobre, Remediado, De posses |
| "Exposição ao oculto" | Aleatória, 0, 1, 2, 3, 4 |

A opção aleatória MUST vir marcada em cada grupo. O painel MUST ter o botão "Gerar NPC" (fundo `blood`, largura total da coluna).

Abaixo da seção, sempre, a nota de créditos em texto pequeno e suave: "Listas do Gerador de NPC Sertão Alagoano 1936. Vocabulário, malassombros, locais e estrutura de ganchos e objetos do Cangaço Trevoso RPG (Leandro Abrahão, Rodrigo Semente; Leandro Games / Craftando Games, 2021), CC BY 4.0.".

Gerar outro NPC MUST substituir o anterior. Sair da aba ou recarregar a página MUST descartar o NPC.

#### Scenario: Gerar com filtros
- **WHEN** o Mestre marca "Mulher" e "2" e toca em "Gerar NPC"
- **THEN** aparece um NPC com apresentação "Mulher" e exposição "2 — …"

#### Scenario: Novo NPC substitui o antigo
- **WHEN** há um NPC na tela e o Mestre toca em "Gerar NPC" de novo
- **THEN** só o NPC novo aparece

### Requirement: Cartão do NPC
Depois de gerar, a seção SHALL mostrar o NPC em cinco partes.

**Cabeçalho** (fundo `ink`, texto branco):
- em cima, "<Apresentação> · <Idade> · <Ocupação>" em Karla caixa-alta vermelha;
- o nome em Cormorant grande;
- abaixo, a alcunha em itálico entre aspas curvas (omitida sem alcunha);
- à direita, o botão contornado em branco "Rolar intensidade · <Ressonância>".

**Cartões** (fundo `surface`, borda `line`), cada um com título em Karla caixa-alta `blood` e linhas rótulo (Karla pequena) / valor (Cormorant):
- **Identidade**: Origem, Comunidade, Condição social, Alfabetização, Cor e traços, Porte, Aparência, Saúde e corpo, Como está hoje, Marca visível, Vestimenta, Ao anoitecer, De madrugada.
- **Personalidade**: Virtudes ("a · b"), Temperamento, Ressonância (com inicial maiúscula), Falhas ("a · b"), Com estranhos, Com os PJs, Com autoridade, Fé e devoção, Santo, Modo de falar, Palavra que usa, Maneirismo, Passatempo, O que evita, Diante de violência.
- **Dramaturgia**: Motivação, Medo, Segredo, Reputação, Vínculo, Problema atual, O que carrega, Se sumir, dá por falta, Gancho de cena.
- **O Oculto**: Exposição, O que viu ou sabe, Como reage ao assunto, Se for alimentado, culpa, Frase de entrada (entre aspas curvas), Detalhe de 1936.

**Layout**: os quatro cartões numa grade de uma coluna no celular e três a partir de `md`. "O Oculto" é o quarto item.

**Resumo**: o cartão "Resumo para ler na mesa", com largura total e o botão contornado "Copiar". O texto do resumo MUST seguir a fórmula do resumo da planilha, com "conhecido como" / "conhecida como" conforme a apresentação e sem esse trecho quando não há alcunha. "Copiar" MUST pôr o resumo na área de transferência e mostrar o toast "Resumo copiado.". Se a cópia falhar, o toast MUST ser "Não foi possível copiar. Selecione o texto e copie.".

**Acessibilidade**: ao gerar, um texto `aria-live="polite"` visualmente oculto MUST anunciar "NPC gerado: <nome>".

#### Scenario: NPC sem alcunha
- **WHEN** o d10 da alcunha dá 10
- **THEN** o cabeçalho não mostra alcunha e o resumo começa com "<Nome>. <Apresentação>, <idade>."

#### Scenario: Copiar o resumo
- **WHEN** o Mestre toca em "Copiar"
- **THEN** o resumo vai para a área de transferência e aparece o toast "Resumo copiado."

### Requirement: Rolar intensidade do NPC
O botão "Rolar intensidade · <Ressonância>" do cabeçalho SHALL rolar a Rolagem de Ressonância com a ressonância fixa na do NPC (colérica → Colérica, melancólica → Melancólica, fleumática → Fleumática, sanguínea → Sanguínea), a intensidade em Aleatória e sem sangue-fraco. O resultado MUST aparecer logo abaixo do cabeçalho do NPC, no mesmo cartão de resultado da aba Ações (intensidade, humor, efeito, discrasia em Aguçada e a linha dos dados), com o link "Limpar" acima dele. Rolar de novo MUST substituir o resultado. Gerar outro NPC MUST apagar o resultado. O cartão de resultado da Rolagem de Ressonância do topo da aba MUST NOT mudar.

#### Scenario: Rolar a intensidade de um NPC fleumático
- **WHEN** o NPC tem Ressonância "fleumática" e o Mestre toca em "Rolar intensidade · Fleumática"
- **THEN** abaixo do cabeçalho aparece um resultado de Ressonância Fleumática com a intensidade sorteada, e a linha dos dados mostra "Fleumática (escolhida)"

