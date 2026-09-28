// Só carniçais podem ter; ficam fora do Passo 7 (o app não tem ficha de carniçal).
import type { MeritTemplate } from "./model";

const ghoul = {
  category: "Carniçais",
  hidden: true,
  source: "Companion",
} as const;

export const GHOULS: readonly MeritTemplate[] = [
  {
    ...ghoul,
    aliases: ["Blood Empathy"],
    description:
      "Você sente quando seu regente está em perigo ou precisa de você com urgência (sem telepatia).",
    name: "Empatia de Sangue",
    points: 2,
    tipo: "vantagem",
  },
  {
    ...ghoul,
    aliases: ["Baneful Blood"],
    description:
      "Você sofre para sempre a Perdição do clã do primeiro domitor. Só se o domitor for Lasombra, Malkaviano, Ministério, Nosferatu, Ravnos, Salubri ou Toreador.",
    name: "Sangue Funesto",
    points: [1, 2],
    tipo: "defeito",
  },
  {
    ...ghoul,
    aliases: ["Unseemly Aura"],
    description: "Sua aura é indistinguível da de um Membro.",
    name: "Aura Imprópria",
    points: 2,
    tipo: "vantagem",
  },
  {
    ...ghoul,
    aliases: ["Crone's Curse", "Crones Curse"],
    description:
      "Você aparenta uma década a mais que sua idade e tem uma caixa de Vitalidade a menos.",
    name: "Maldição da Anciã",
    points: 2,
    tipo: "defeito",
  },
  {
    ...ghoul,
    aliases: ["Distressing Fangs"],
    description:
      "Você desenvolveu presas como as de um Membro: −1 dado nas paradas Sociais com mortais.",
    name: "Presas Perturbadoras",
    points: 1,
    tipo: "defeito",
  },
];
