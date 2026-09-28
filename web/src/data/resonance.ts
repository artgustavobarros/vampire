/** Humores da Ressonância que o Mestre pode sortear (sem "Sem ressonância"). */
export const MOODS = [
  "Colérica",
  "Melancólica",
  "Fleumática",
  "Sanguínea",
] as const;
export type Mood = (typeof MOODS)[number];

export const INTENSITIES = [
  "Negligenciável",
  "Difusa",
  "Intensa",
  "Aguçada",
] as const;
export type Intensity = (typeof INTENSITIES)[number];

export interface Dyscrasia {
  descricao: string;
  nome: string;
}

export interface MoodInfo {
  disciplinas: readonly string[];
  /** as três discrasias, na ordem do d3 */
  discrasias: readonly [Dyscrasia, Dyscrasia, Dyscrasia];
  emocoes: string;
}

export const RESONANCE_MOODS: Record<Mood, MoodInfo> = {
  Colérica: {
    disciplinas: ["Celeridade", "Potência"],
    discrasias: [
      {
        descricao: "Qualquer provocação vira briga; a raiva não esfria.",
        nome: "Fúria",
      },
      {
        descricao: "Deseja o que é dos outros e não suporta ficar atrás.",
        nome: "Inveja",
      },
      {
        descricao: "Prazer em ferir e dominar quem é mais fraco.",
        nome: "Crueldade",
      },
    ],
    emocoes: "Raiva, paixão, violência, inveja, ambição.",
  },
  Fleumática: {
    disciplinas: ["Auspícios", "Dominação"],
    discrasias: [
      {
        descricao: "Calma absoluta, quase clínica, diante de qualquer coisa.",
        nome: "Frieza",
      },
      { descricao: "Nada importa o bastante para agir.", nome: "Apatia" },
      {
        descricao: "Tudo precisa seguir o plano, sem desvio.",
        nome: "Controle",
      },
    ],
    emocoes: "Preguiça, apatia, calma, controle, sentimentalismo.",
  },
  Melancólica: {
    disciplinas: ["Fortitude", "Oblívio"],
    discrasias: [
      { descricao: "Uma perda recente pesa sobre tudo.", nome: "Luto" },
      {
        descricao: "Preso ao passado, revive o que já não existe.",
        nome: "Nostalgia",
      },
      { descricao: "Nenhuma saída parece possível.", nome: "Desespero" },
    ],
    emocoes: "Tristeza, medo, luto, introspecção, desânimo.",
  },
  Sanguínea: {
    disciplinas: ["Feitiçaria de Sangue", "Presença"],
    discrasias: [
      {
        descricao: "Alegria transbordante, sem medo das consequências.",
        nome: "Euforia",
      },
      { descricao: "Desejo intenso por uma pessoa ou coisa.", nome: "Paixão" },
      { descricao: "Precisa de mais, e de novo.", nome: "Vício" },
    ],
    emocoes: "Alegria, desejo, entusiasmo, excitação, vício.",
  },
};

export const INTENSITY_EFFECTS: Record<Intensity, string> = {
  Aguçada:
    "Mesmo bônus da Intensa, e o sangue carrega uma discrasia. Para obtê-la é preciso drenar o recipiente ou alimentar-se dele por três noites.",
  Difusa:
    "+1 dado nas paradas das Disciplinas do humor enquanto a Ressonância durar.",
  Intensa:
    "Mesmo bônus da Difusa, e o sangue permite aprender pontos das Disciplinas do humor.",
  Negligenciável: "Humor fraco demais: o sangue só sacia a Fome, sem bônus.",
};
