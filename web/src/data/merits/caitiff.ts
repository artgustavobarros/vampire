// Vantagens e Defeitos exclusivos de Caitiff (Players Guide).
import type { MeritTemplate } from "./model";

const caitiff = {
  category: "Caitiff",
  clans: ["Caitiff"],
  source: "Players Guide",
} as const;

export const CAITIFF: readonly MeritTemplate[] = [
  {
    ...caitiff,
    aliases: ["Favored Blood"],
    description:
      "Você compra pontos em qualquer Disciplina sem precisar provar antes o sangue de um vampiro que a tenha. Não combina com Sangue Turvo.",
    name: "Sangue Favorecido",
    points: 4,
    tipo: "vantagem",
  },
  {
    ...caitiff,
    aliases: ["Befouling Vitae"],
    description:
      "Mortais que você mata ao se alimentar ou Abraça voltam como aparições dias depois.",
    name: "Vitae Profanadora",
    points: 2,
    tipo: "defeito",
  },
  {
    ...caitiff,
    aliases: ["Mark of Caine"],
    description:
      "+2 dados para intimidar vampiros que acreditam em Caim. Numa diablerie, você não ganha Potência de Sangue, e uma falha vira falha crítica.",
    name: "Marca de Caim",
    points: 2,
    tipo: "vantagem",
  },
  {
    ...caitiff,
    aliases: ["Caitiff Clan Curse"],
    description:
      "Você sofre a Perdição de um clã à sua escolha, com metade da Gravidade (mínimo 1).",
    name: "Maldição Alheia",
    points: 2,
    tipo: "defeito",
  },
  {
    ...caitiff,
    aliases: ["Mockingbird"],
    description:
      "Por uma noite depois de beber sangue de um vampiro, use uma das Disciplinas dele (até o seu maior nível de Disciplina), com a pontuação dele e os seus Atributos. Você sofre a Perdição dele nesse período.",
    name: "Tordo",
    points: 3,
    tipo: "vantagem",
  },
  {
    ...caitiff,
    aliases: ["Debt Peon"],
    description:
      "Você deve favores a um vampiro de alto Status, que ganha +2 dados em combate social contra você diante de outros Membros. Recusar leva a Evitado e a uma Caçada de Sangue.",
    name: "Peão de Dívida",
    points: 2,
    tipo: "defeito",
  },
  {
    ...caitiff,
    aliases: ["Sun-Scarred", "Sun Scarred"],
    description:
      "No primeiro turno sob o sol, você não sofre dano de Vitalidade: sofre 1 de dano Agravado de Força de Vontade e passa automaticamente no frenesi de Terror. No resto da cena, o dano do sol é Superficial.",
    name: "Marcado pelo Sol",
    points: 5,
    tipo: "vantagem",
  },
  {
    ...caitiff,
    aliases: ["Liquidator"],
    description:
      "−2 dados nas paradas Sociais com sangues-ralos, exceto Intimidação. Não combina com Tio Presas.",
    name: "Liquidador",
    points: 1,
    tipo: "defeito",
  },
  {
    ...caitiff,
    aliases: ["Uncle Fangs"],
    description:
      "Um bando de três a cinco sangues-ralos conta com você e age como Aliados. Não combina com Liquidador.",
    name: "Tio Presas",
    points: 3,
    tipo: "vantagem",
  },
  {
    ...caitiff,
    aliases: ["Muddled Blood"],
    description:
      "Para comprar pontos numa Disciplina, você precisa beber o sangue de um vampiro que a tenha. Não combina com Sangue Favorecido.",
    name: "Sangue Turvo",
    points: 1,
    tipo: "defeito",
  },
  {
    ...caitiff,
    aliases: ["Walking Omen"],
    description:
      "Vidências e premonições apontam você como fonte de desgraça. O Narrador define os efeitos.",
    name: "Presságio Ambulante",
    points: 2,
    tipo: "defeito",
  },
  {
    ...caitiff,
    aliases: ["Word-Scarred", "Word Scarred"],
    description:
      "Seu corpo é coberto por textos antigos da tradição vampírica. Jogador e Narrador definem os efeitos.",
    name: "Marcado por Palavras",
    points: 1,
    tipo: "defeito",
  },
];
