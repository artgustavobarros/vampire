## Context

`web/src/data/merits.ts` guarda ~55 itens em cinco listas (`BACKGROUNDS`, `COMMON_MERITS`, `COMMON_FLAWS`, `THIN_BLOOD_MERITS`, `THIN_BLOOD_FLAWS`) com o modelo `{ name, tipo, points, category, description, levels? }`. Quem consome:

- `findMerit` (busca exata, depois prefixo nos dois sentidos) → Passo 7 (`step7-merits.tsx`), painel lateral (`build-info.ts`).
- `meritOptions(thin)` → combobox do Passo 7; filtro binário Sangue-ralo sim/não.
- `MERIT_INFO` em `data/trait-info.ts` duplica descrições de ~20 méritos por prefixo e tem prioridade sobre o catálogo.
- `data/predators.ts` cita méritos pelo nome; `rules.test.ts` mantém uma lista de exceções (`Sabujo de Sangue`, `Predador Óbvio`, `Refúgio Assustador`, `Refúgio Assombrado`, `Rejeitado`, `Defeito Mítico`) de nomes que o catálogo ainda não tem.
- `schema.ts` e `rules/wizard.ts` validam pontos de 1 a 5.

A fonte é o wiki [Advantages and Flaws](https://vtm.paradoxwikis.com/Advantages_and_Flaws) (inglês). Livros citados por seção: Corebook, Players Guide, In Memoriam, Gehenna War, Blood Stained Love, Live from the Succubus Club, Forbidden Religions, Children of the Blood, Companion.

## Goals / Non-Goals

**Goals:**
- Todo item do wiki no catálogo, com nome PT-BR, alias em inglês, livro, custo, pré-requisitos e descrição de regra.
- Corrigir os erros atuais (tipo, texto, custos, faixas).
- Um único lugar com a descrição de cada mérito (o catálogo).
- O assistente oferecer só o que o personagem pode ter e cobrar os pré-requisitos.

**Non-Goals:**
- Mecânicas automáticas dos itens (ex.: Bonito somar dado nas paradas, Falhas Enraizadas liberarem poderes extras). O catálogo é descritivo.
- Ficha de carniçal ou mecânica de culto.
- Migrar nomes nas fichas salvas (resolvido por alias na leitura).
- Loresheets.

## Decisions

### 1. Arquivos por grupo, API igual
`web/src/data/merits/` com `general.ts`, `ingrained.ts`, `caitiff.ts`, `thin-blood.ts`, `ghouls.ts`, `cults.ts`, `backgrounds.ts` e `index.ts` (helpers + `ALL_MERIT_TEMPLATES`). O import `#/data/merits` não muda. Um arquivo só passaria de 4.000 linhas.

### 2. Modelo do item
```ts
type MeritRequirement =
  | { merit: string; min: number }   // Antecedente/sub-vantagem com nível mínimo
  | { discipline: string };          // Falhas Enraizadas

interface MeritTemplate {
  name: string;                       // PT-BR, único no catálogo (sem acento/maiúsculas)
  aliases?: readonly string[];        // nome em inglês + nomes antigos do projeto
  tipo: MeritKind;
  points: number | readonly number[]; // 0 = sem valor em pontos
  category: string;                   // grupo do combobox
  parent?: string;                    // Antecedente dono (sub-vantagens)
  requires?: MeritRequirement;
  clans?: readonly string[];          // só estes clãs (Caitiff, Sangue Fraco)
  excludeClans?: readonly string[];   // ex.: Fazendeiro → ["Ventrue"]
  hidden?: boolean;                   // fora do assistente (carniçais)
  source: string;                     // livro de origem
  description: string;
  levels?: readonly string[];         // um texto por valor de `points`
}
```
- **Por que `clans` em vez de manter `qualidade-sr`/`defeito-sr` como filtro**: os tipos SR continuam (contam à parte no Passo 7), mas quem decide se o item aparece é `clans`. Caitiff usa o mesmo mecanismo sem novo `MeritKind`.
- **Carniçais com `hidden`**: o wiki diz que só carniçais podem ter; o app não tem ficha de carniçal. Ficam no catálogo (painel lateral, uso futuro no NPC) sem poluir o Passo 7.
- **Cultos visíveis para todos**: o wiki diz que podem ser adaptados; ficam em grupos "Culto · <nome>".
- **"• +" (sem teto)** vira `[1, 2, 3, 4, 5]`. **"•• ou ••••"** vira `[2, 4]`. **Aliados** vira `[2, 3, 4, 5, 6]` (Eficácia 1–4 + Confiabilidade 1–3, máx. 6).
- **Sangue-ralo** continua com `points: 1` (a regra conta itens, não pontos).
- **Falhas Enraizadas** têm `points: 0` e `requires: { discipline }`: o wiki diz "no assigned Dot Value". Não entram na soma de 2 pontos de Defeitos.

### 3. `findMerit` com aliases e sem prefixo reverso
Ordem: nome exato → alias exato → "Nome (detalhe)" cujo nome-base é exato ou alias. Sai a regra `normM.startsWith(normBase)`. Com 235 itens, "Arsenal" casaria com "Arsenal Escondido" e "Perseguido" com "Admiradores…". O scenario "Mérito fora do catálogo: Arsenal" do `trait-info` continua valendo.

### 4. Nomes únicos e colisões resolvidas no nome
O wiki repete nomes em seções diferentes (Clan Curse em Caitiff e Sangue-ralo; Monstrous em Enraizadas; Plaguebringer × Plague Bearers; Sloppy Feeder × Sloppy Drinker). Parênteses não servem para desempatar porque `findMerit` os trata como detalhe. Cada item recebe um nome PT-BR distinto (ver Inventário), e um teste garante unicidade de nomes e aliases.

### 5. Predadores usam os nomes do catálogo
`Vegano` → `Fazendeiro`; `Sabujo de Sangue`, `Predador Óbvio`, `Rejeitado`, `Refúgio Assustador` e `Refúgio Assombrado` passam a existir. `Defeito Mítico` é um rótulo de escolha ("qualquer Defeito Mítico"), não um item, e continua como exceção explícita no teste.

### 6. Painel lateral só pelo catálogo
As entradas de mérito saem de `MERIT_INFO`. `Belíssimo` (só existia lá) vira alias de `Bonito`. Os níveis mostrados são os de `levels`. Sem `levels`: faixa → escala genérica limitada aos valores do item; custo fixo → sem lista.

### 7. Validação no Passo 7
`meritOptions(ctx)` recebe `{ cla, disciplinas }` (substitui `thin: boolean`) e filtra `hidden`, `clans`, `excludeClans` e `requires.discipline`. `requires.merit` **não** filtra, porque o jogador pode escolher o Antecedente depois. `meritStatus` acrescenta pendências:
- `"<Item> exige <Pai> <•••>"` quando o pai falta ou tem menos pontos;
- `"<Clã> não pode ter <Item>"` quando o clã mudou depois da escolha;
- `"<Item> exige a Disciplina <X>"` quando a Disciplina saiu no Passo 5.

Pontos: `schema.ts` aceita os valores permitidos do item do catálogo (0 a 6); itens fora do catálogo continuam de 1 a 5.

### 8. Conteúdo: tradução própria, alias EN, livro
Na implementação, cada seção do wiki é lida inteira (texto da regra, não só o resumo), traduzida e revisada contra o livro quando houver PDF PT-BR no repositório. Nomes já usados no projeto (`Estômago de Ferro`, `Presa Excluída`, `Segredo Obscuro`, nomes de Sangue-ralo) são mantidos.

## Risks / Trade-offs

- [Tradução própria diverge da edição oficial] → alias EN sempre presente, e o teste de unicidade facilita renomear depois.
- [Combobox com ~220 opções fica lento ou longo] → a lista já rola e agrupa; filtrar ocorre em memória sobre arrays pequenos. Medir no teste de integração; se preciso, limitar a renderização aos grupos visíveis.
- [Fichas salvas com Monstruoso/Perseguido/Feio ••] → aparecem como "fora do catálogo" (Monstruoso, Perseguido) ou com pontos fora da faixa (Feio 2). A ficha não valida pontos; o Passo 7 mostra a pendência se o jogador reabrir o assistente.
- [Descrições longas do wiki cortadas pelo WebFetch] → buscar seção por seção e conferir contagens contra o Inventário.
- [Custo 0 quebra suposições (DotRating, somas)] → `DotRating` recebe `allowed=[0]` e fica só leitura; somas ignoram 0 naturalmente.

## Migration Plan

Sem migração de dados. Nomes renomeados resolvem por alias (`Vegano`, `Assombrado`, `Conta Sobrenatural`, `Belíssimo`). Rollback: reverter o commit.

## Open Questions

- Nomes PT-BR do Inventário são proposta; revisar antes ou durante a implementação.
- O Predador que oferece "Defeito Mítico" deve virar uma escolha entre os Defeitos Míticos do catálogo? Fora do escopo aqui.

## Inventário (nome PT-BR ← nome EN · custo)

Legenda: V = Vantagem, D = Defeito, `+` = 1–5, req = pré-requisito.

**Linguística** — V Linguística ← Linguistics · + · D Analfabeto ← Illiterate · ••

**Aparência** — V Bonito ← Beautiful · •• · V Deslumbrante ← Stunning · •••• · D Feio ← Ugly · • · D Repulsivo ← Repulsive · •• · V Semblante do Matusalém ← Semblance of the Methuselah · •–•• · D Fedor ← Stench · • · V Rosto Famoso ← Famous Face · • · D Transparente ← Transparent · • · V Ingênuo ← Ingénue · • · D Rosto Impassível ← Unblinking Visage · •• · V Traço Marcante ← Remarkable Feature · • · V Virado na Noite ← Up All Night · ••/•••• · V Da Cena ← Scene Kid · •

**Uso de Substâncias** — V Viciado Funcional ← High Functioning Addict · • · D Vício ← Addiction · • · D Vício Sem Volta ← Hopeless Addiction · ••

**Arcaicos** — V Guardião da História ← Custodian of History · • · D Vivendo no Passado ← Living in the Past · • · D Arcaico ← Archaic · •• · D Fobia do Luto ← Grief Phobia · • · D Truques Antigos ← Old Tricks · •

**Laço de Sangue** — V Resistência ao Laço ← Bond Resistance · •–••• · D Viciado em Laço ← Bond Junkie · • · V Laço Curto ← Short Bond · •• · D Laço Longo ← Long Bond · • · V Inquebrantável ← Unbondable · ••••• · D Escravo do Laço ← Bondslave · •• · V Laços de Lealdade ← Bonds of Fealty · ••• · V Laço Duradouro ← Enduring Bond · •

**Sobrenatural** — D Dois Senhores ← Two Masters · •

**Alimentação** — V Sabujo de Sangue ← Bloodhound · • · D Presa Excluída ← Prey Exclusion · • · V Estômago de Ferro ← Iron Gullet · ••• · D Sede de Matusalém ← Methuselah's Thirst · • · V Reconhecer Receptáculo ← Vessel Recognition · • · D Fazendeiro ← Farmer (alias Vegano; exclui Ventrue) · •• · V Drive-thru ← Drive-thru · • · D Organívoro ← Organovore · •• · D Sangria às Escondidas ← Vein Tapper · • · D Preferência Antiquada ← Outdated Preference · •• · D Sensível à Ressonância ← Resonance Sensitivity · • · D Mímico de Ressonância ← Resonance Mimic · •• · D Alimentador Desleixado ← Sloppy Feeder · ••

**Míticos** — V Comer Comida ← Eat Food · •• · D Perdição Folclórica ← Folkloric Bane · • · V Fome Fria e Morta ← Cold Dead Hunger · ••• · D Bloqueio Folclórico ← Folkloric Block · • · V Diablerie em Bando ← Pack Diablerie · •• · D Estigmas ← Stigmata · • · V Sorte do Diabo ← Luck of the Devil · •••• · D Isca de Estaca ← Stake Bait · •• · V Modo Nuit ← Nuit Mode · •• · D Decomposição Faminta ← Starving Decay · •• · V Objeto de Poder ← Object of Power · •–••• · D Objeto Amaldiçoado ← Cursed Object · • · V Sanguessuga de Linha Ley ← Ley Line Leach · • · D Duas Vezes Amaldiçoado ← Twice Cursed · •• · V Rubor Persistente ← Persistent Blush · ••• · D Rubor Resistente ← Resistant Blush · • · D Preso à Terra ← Land Locked · • · D Carne de Cadáver ← Corpse Flesh · ••

**Falhas de Disciplina Enraizada** (D, custo 0, req Disciplina) — Indomado ← Untamed (Animalismo) · Pesadelos Diurnos ← Daymares (Auspícios) · Animismo Sanguinário ← Sanguinary Animism (Feitiçaria de Sangue) · Colapso ← Breakdown (Celeridade) · Rude ← Blunt (Dominação) · Tecido Cicatricial ← Scar Tissue (Fortitude) · Esmaecido ← Faded (Ofuscação) · Monstruosidade ← Monstrous (Oblívio) · Instinto Assassino ← Killer Instinct (Potência) · Egomaníaco ← Egomaniac (Presença) · Estase ← Stasis (Proteanismo)

**Psicológicos** — V Vontade Profana ← Unholy Will · ••/•••• · D Farol de Profanação ← Beacon of Profanity · • · V Zelo ← Zealotry · •–••• · D Crise de Fé ← Crisis of Faith · • · V Penitência ← Penitence · •–••••• · D Cicatrizes da Penitência ← Horrible Scars of Penitence · • · V Fera Apaziguada ← Soothed Beast · • · D Verme Rastejante ← Groveling Worm · •• · V Falso Amor ← False Love · •

**Contágio** — D Vetor de Doença ← Disease Vector · • · D Pestilento ← Plaguebringer · •–••

**Laços de Linhagem** — V Sentido Consanguíneo ← Consanguineous Sense · •• · V Influência Consanguínea ← Consanguineous Influence · •• · V Pecados do Pai ← Sins of the Father · ••/•••

**Diablerie** — D Diablerista Descarado ← Blatant Diablerist · • · D Perdição Herdada ← Inherited Bane · ••

**Outros** — V Confira o Porta-malas ← Check the Trunk · • · D Sede de Saber ← Knowledge Hungry · • · V Corre por Fora ← Side Hustler · •• · D Dívidas de Prestação ← Prestation Debts · • · V Vontade Temperada ← Tempered Will · ••• · D Inconsequente ← Risk-Taker · • · V Intocável ← Untouchable · ••••• · D Vontade Fraca ← Weak-Willed · •• · V Místico do Vazio ← Mystic of the Void · •/••

**Caitiff** (clans: Caitiff) — V Sangue Favorecido ← Favored Blood · •••• · D Vitae Profanadora ← Befouling Vitae · •• · V Marca de Caim ← Mark of Caine · •• · D Maldição Alheia ← Clan Curse · •• · V Tordo ← Mockingbird · ••• · D Peão de Dívida ← Debt Peon · •• · V Marcado pelo Sol ← Sun-Scarred · ••••• · D Liquidador ← Liquidator · • · V Tio Presas ← Uncle Fangs · ••• · D Sangue Turvo ← Muddled Blood · • · D Presságio Ambulante ← Walking Omen · •• · D Marcado por Palavras ← Word-Scarred · •

**Sangue-ralo** (clans: Sangue Fraco, 1 ponto) — Qualidades (14): Camaradas Anarquistas, Contato da Camarilla, Catenação de Sangue, Bebedor Diurno, Afinidade de Disciplina, Realista, Alquimista de Sangue-ralo, Resiliência Vampírica, Sangue Abominável, À Prova de Fé, Baixo Apetite, Sonhador Lúcido, A Aparência da Mortalidade, Alimentador Rápido. Defeitos (16): Rejeitado pelos Anarquistas, Marcado pela Camarilla, Temperamento Bestial, Maldição do Clã, Dependência de Vitae, Carne Morta, Dentes de Leite, Fragilidade Mortal, Heliofobia, Terrores Noturnos, Portadores da Peste, Bebedor Descuidado, Desbotado pelo Sol, Sinal Sobrenatural (alias Conta Sobrenatural), **Presença do Crepúsculo**, **Fome Infinita**.

**Carniçais** (hidden) — V Empatia de Sangue ← Blood Empathy · •• · D Sangue Funesto ← Baneful Blood · •–•• · V Aura Imprópria ← Unseemly Aura · •• · D Maldição da Anciã ← Crone's Curse · •• · D Presas Perturbadoras ← Distressing Fangs · •

**Cultos** — *Gerais*: V Textos Apócrifos · • · D Excomungado · •–•• · V Artista Inspirado · •• · D Sem Fé ← Faithless · •• · V Pregador Itinerante · •• — *Ashfinders*: V Memórias dos Caídos · •• · D Vício em Cinzas ← Ashe Addiction · •• · V Streamer · •• — *Bahari*: V Jardineiro ← Gardener · •–••••• · V Canção da Mãe Sombria · •• — *Igreja de Caim*: V Resistente ao Fogo · • · D Cisma ← Schism (Lasombra) · • — *Igreja de Set*: V Vigilante · •• · D Alarme Falso · • · V Faz-Tudo ← Fixer · •• · V Sumir do Mapa ← Go to Ground · • — *Culto de Shalim*: V Sussurros Insidiosos · •• · D Vazio ← Empty · • · V Gematria · • — *Mistérios Mitraicos*: V Matador de Touros ← Bull-Slayer · ••• · D Iniciado Fracassado · • · V Negociador ← Bargainer · • — *Nefilim*: V Graça do Arcanjo · ••• · D Anseio ← Yearning · •

**Antecedentes e sub-itens** (`parent` = Antecedente; req = nível mínimo do Antecedente)
- Aliados ••–•••••• · D Inimigo ← Enemy · +
- Contatos •–•••
- Fama •–••••• · D Segredo Obscuro ← Dark Secret · + · V Influenciador · • (req Fama ••) · D Infâmia ← Infamy · + · V Fama Duradoura · • (req Fama •••) · D Banido ← Banned From · •–•••
- Influência •–••••• · D Rejeitado ← Disliked · • · D Desprezado ← Despised · ••
- Refúgio •–••• · D Sem Refúgio ← No Haven · • · V Arsenal Escondido · + (req Refúgio •) · D Refúgio Assustador ← Creepy · • · V Cela · + (req Refúgio •) · D Refúgio Assombrado ← Haunted (alias Assombrado) · + · V Vigias ← Watchmen · + (req Refúgio •) · D Refúgio Comprometido · •• · V Laboratório · + (req Refúgio •) · D Refúgio Compartilhado · •/•• · V Biblioteca · + (req Refúgio •) · D Nos Trilhos · • (req Refúgio Móvel •) · D Temperamental · • (req Refúgio Móvel •) · V Localização · • (req Refúgio •) · V Luxo · • (req Refúgio •) · V Saída Secreta ← Postern · + (req Refúgio •) · V Sistema de Segurança · + (req Refúgio •) · V Sala Cirúrgica ← Surgery · • (req Refúgio •) · V Proteção Mística ← Warding · + (req Refúgio •) · V Solo Sagrado · • (req Refúgio •) · V Santuário ← Shrine · •–••• (req Refúgio •) · V Estabelecimento Comercial · ••–••• (req Refúgio •) · V Furcus · •–••• (req Refúgio •) · V Oficina Mecânica · + (req Refúgio •) · V Refúgio Móvel ← Mobile · •–••• · V Blindado · • (req Refúgio Móvel •) · V Esconderijo de Contrabando · •–•• (req Refúgio Móvel •) · V Placas Reserva · •• (req Refúgio Móvel •)
- Rebanho •–••••• · D Predador Óbvio ← Obvious Predator · ••
- Máscara •–•• · D Cadáver Conhecido · • · V Zerado · • (req Máscara ••) · D Corpo em Branco Fichado ← Known Blankbody · •• · V Falsificador ← Cobbler · • (req Máscara ••)
- Mawla •–••••• · D Adversário · + · D Mestre Secreto · • (req Mawla •) · D Cria Vergonhosa · • · D Pedra de Toque Abraçada pelo Inimigo · ••
- Recursos •–••••• · D Destituído ← Destitute · •
- Lacaios •–••• · D Admiradores Obsessivos ← Stalkers · •
- Status •–••••• · D Suspeito · • · V Segredos da Cidade · •–••• · D Evitado ← Shunned · •• · D Pretendente Mortal · •

**Saem do catálogo**: Monstruoso (não existe no V5), Perseguido (V20; coberto por Inimigo/Adversário).
