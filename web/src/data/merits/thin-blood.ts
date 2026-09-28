// Qualidades e Defeitos de Sangue-ralo (Corebook e Players Guide). A regra conta itens, não pontos.
import type { MeritTemplate } from "./model";

const qualidade = {
  category: "Sangue-ralo",
  clans: ["Sangue-ralo"],
  points: 1,
  tipo: "qualidade-sr",
} as const;

const defeito = { ...qualidade, tipo: "defeito-sr" } as const;

export const THIN_BLOOD_MERITS: readonly MeritTemplate[] = [
  {
    ...qualidade,
    aliases: ["Anarch Comrades", "Companheiros Anarquistas"],
    description:
      "Uma coterie Anarquista tolera você, ou até o trata como mascote. Juntos, contam como um Mawla Anarquista de 1 ponto enquanto você seguir a linha do grupo. Não combina com Segregado pelos Anarquistas.",
    name: "Camaradas Anarquistas",
    source: "Corebook",
  },
  {
    ...qualidade,
    aliases: ["Camarilla Contact"],
    description:
      "A Camarilla notou você e o usa como informante. Conta como um Mawla da Camarilla de 1 ponto. Não combina com Marcado pela Camarilla.",
    name: "Contato da Camarilla",
    source: "Corebook",
  },
  {
    ...qualidade,
    aliases: ["Catenating Blood"],
    description:
      "Seu sangue é forte o bastante para criar Laços de Sangue e Abraçar outros sangues-ralos.",
    name: "Sangue Agregador",
    source: "Corebook",
  },
  {
    ...qualidade,
    aliases: ["Day Drinker"],
    description:
      "Você anda sob o sol. A luz do dia reduz sua Vitalidade à metade (arredondando para cima) e tira todas as suas capacidades vampíricas, inclusive Disciplinas, mas não causa outro dano. Você ainda sente Fome e precisa dormir.",
    name: "Bebedor Diurno",
    source: "Corebook",
  },
  {
    ...qualidade,
    aliases: ["Discipline Affinity"],
    description:
      "Escolha uma Disciplina: você ganha 1 ponto nela e pode comprar e manter mais pontos com XP, pelo custo de Disciplina fora do clã. Beber sangue de Ressonância correspondente não dá pontos extras nela.",
    name: "Afinidade de Disciplina",
    source: "Corebook",
  },
  {
    ...qualidade,
    aliases: ["Lifelike"],
    description:
      "Você tem batimento cardíaco, come comida e tem vida sexual como um mortal. À noite, só os exames médicos mais avançados notam algo estranho. Não combina com Carne Morta.",
    name: "Semblante de Vida",
    source: "Corebook",
  },
  {
    ...qualidade,
    aliases: ["Thin-blood Alchemist", "Alquimista de Sangue Fino"],
    description: "Você ganha 1 ponto em Alquimia de Sangue-ralo e uma fórmula.",
    name: "Alquimista de Sangue-ralo",
    source: "Corebook",
  },
  {
    ...qualidade,
    aliases: ["Vampiric Resilience"],
    description:
      "Você sofre dano como um vampiro comum (dano Superficial de fontes físicas mundanas é dividido por dois). Não combina com Fragilidade Mortal.",
    name: "Resiliência Vampírica",
    source: "Corebook",
  },
  {
    ...qualidade,
    aliases: ["Abhorrent Blood"],
    description:
      "Seu sangue enoja outros vampiros: para beber de você, precisam gastar 2 de Força de Vontade por turno. Mortais não são afetados.",
    name: "Sangue Abominável",
    source: "Players Guide",
  },
  {
    ...qualidade,
    aliases: ["Faith-Proof", "Faith Proof"],
    description:
      "Ateu ou devoto, você ainda está perto demais da mortalidade para a Fé Verdadeira afetá-lo.",
    name: "À Prova de Fé",
    source: "Players Guide",
  },
  {
    ...qualidade,
    aliases: ["Low Appetite"],
    description:
      "Se você acorda com Fome 0 ou 1, role dois dados na Checagem de Sangue do despertar e fique com o melhor.",
    name: "Baixo Apetite",
    source: "Players Guide",
  },
  {
    ...qualidade,
    aliases: ["Lucid Dreamer"],
    description:
      "Você ainda sonha e às vezes controla os sonhos. Uma vez por sessão, se dormiu durante o dia, peça ao Narrador uma pista das memórias da noite anterior ou uma dica da história vinda do sonho.",
    name: "Sonhador Lúcido",
    source: "Players Guide",
  },
  {
    ...qualidade,
    aliases: ["Mortality's Mien", "Mortalitys Mien"],
    description:
      "Sua aura parece mortal para quem detecta o sobrenatural, e você soma 2 dados para passar por mortal de outras formas, como maquiagem.",
    name: "Aparência de Morte",
    source: "Players Guide",
  },
  {
    ...qualidade,
    aliases: ["Swift Feeder"],
    description:
      "Você bebe rápido e limpo: sacia 1 de Fome em um turno, já lambendo a ferida para fechá-la. Uma vez por cena.",
    name: "Alimentador Rápido",
    source: "Players Guide",
  },
];

export const THIN_BLOOD_FLAWS: readonly MeritTemplate[] = [
  {
    ...defeito,
    aliases: ["Shunned by the Anarchs"],
    description:
      "Você quebrou uma regra não escrita dos Anarquistas. Eles o evitam e preferem entregá-lo à Camarilla a ouvi-lo. Não combina com Camaradas Anarquistas.",
    name: "Segregado pelos Anarquistas",
    source: "Corebook",
  },
  {
    ...defeito,
    aliases: ["Branded by the Camarilla"],
    description:
      "A Camarilla marcou você a ferro como sangue-ralo; a marca dolorosa nunca cicatriza e o identifica para qualquer Membro. Não combina com Contato da Camarilla.",
    name: "Marcado pela Camarilla",
    source: "Corebook",
  },
  {
    ...defeito,
    aliases: ["Bestial Temper"],
    description:
      "Sua Besta é tão forte quanto a de um vampiro completo: você testa frenesi pelas regras normais.",
    name: "Temperamento Bestial",
    source: "Corebook",
  },
  {
    ...defeito,
    aliases: ["Clan Curse"],
    description:
      "Você sofre a Perdição de um clã com Gravidade 1. Só Banu Haqim, Brujah, Gangrel (exige Temperamento Bestial) ou Tremere (exige Sangue Agregador).",
    name: "Maldição do Clã",
    source: "Corebook",
  },
  {
    ...defeito,
    aliases: ["Vitae Dependency", "Dependência Vitae"],
    description:
      "Seu sangue não sustenta poderes sozinho. Se não saciar 1 de Fome com sangue de vampiro a cada semana, você perde todas as Disciplinas (inclusive Alquimia de Sangue-ralo) até voltar a fazê-lo.",
    name: "Dependência de Vitae",
    source: "Corebook",
  },
  {
    ...defeito,
    aliases: ["Dead Flesh"],
    description:
      "Sua carne apodrece devagar, esverdeada e com cheiro leve de podridão. Exames médicos o dão como morto, e você perde 1 dado nos testes Sociais cara a cara com mortais. Não combina com Semblante de Vida.",
    name: "Carne Morta",
    source: "Corebook",
  },
  {
    ...defeito,
    aliases: ["Baby Teeth"],
    description:
      "Suas presas nunca cresceram ou não furam a pele. Para se alimentar, você precisa abrir a vítima ou tirar o sangue com seringa.",
    name: "Dentes de Leite",
    source: "Corebook",
  },
  {
    ...defeito,
    aliases: ["Mortal Frailty"],
    description:
      "Você não pode usar o sangue para se curar; cura como um mortal. Não combina com Resiliência Vampírica.",
    name: "Fragilidade Mortal",
    source: "Corebook",
  },
  {
    ...defeito,
    aliases: ["Heliophobia"],
    description:
      "Você teme o sol como um vampiro completo e está sujeito ao frenesi de Terror diante dele.",
    name: "Heliofobia",
    source: "Players Guide",
  },
  {
    ...defeito,
    aliases: ["Night Terrors"],
    description:
      "Os sonhos que você não lembra de dia voltam à noite como pesadelos. Uma vez por sessão, eles atacam: −1 dado em todas as ações pelo resto da cena.",
    name: "Terrores Noturnos",
    source: "Players Guide",
  },
  {
    ...defeito,
    aliases: ["Plague Bearers", "Plague Bearer"],
    description:
      "Você ainda pega doenças mortais. Ao se alimentar, role um dado: num 1, você contrai a doença da vítima. Remédios não curam; só saciar a Fome até 0 cura.",
    name: "Portadores de Pragas",
    source: "Players Guide",
  },
  {
    ...defeito,
    aliases: ["Sloppy Drinker"],
    description:
      "Ao se alimentar, teste Destreza + Medicina contra Dificuldade igual à Fome saciada. Numa falha, a ferida não fecha e o mortal pode sangrar até morrer, ameaçando a Máscara.",
    name: "Bebedor Descuidado",
    source: "Players Guide",
  },
  {
    ...defeito,
    aliases: ["Sun-Faded", "Sun Faded"],
    description:
      "Você não usa Disciplinas nem Alquimia sob o sol, e poderes ativos acabam quando você entra nele. Dentro de casa durante o dia, longe da luz direta, pode usá-los com −2 dados.",
    name: "Desbotado pelo Sol",
    source: "Players Guide",
  },
  {
    ...defeito,
    aliases: ["Supernatural Tell", "Conta Sobrenatural"],
    description:
      "Criaturas sobrenaturais percebem você com facilidade: −2 dados em Furtividade e parecidos contra elas, inclusive outros vampiros.",
    name: "Sinal Sobrenatural",
    source: "Players Guide",
  },
  {
    ...defeito,
    aliases: ["Twilight Presence"],
    description:
      "Você deixa os outros desconfortáveis: mortais o evitam e Membros o desprezam ainda mais que a outros sangues-ralos. −1 dado nas paradas Sociais com qualquer um que não seja sangue-ralo.",
    name: "Presença do Crepúsculo",
    source: "Players Guide",
  },
  {
    ...defeito,
    aliases: ["Unending Hunger"],
    description:
      "Sua Besta nunca se satisfaz com pouco: ao se alimentar numa cena, você sacia 1 de Fome a menos. Vale uma vez por cena.",
    name: "Fome Infinita",
    source: "Players Guide",
  },
];
