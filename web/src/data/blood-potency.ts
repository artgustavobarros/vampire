// Portado de design/reference/logic.js. Não editar à mão sem conferir a referência.
export interface BloodPotencyRow {
  baneSeverity: number;
  bloodSurge: string;
  /** itens da penalidade, um por linha na tabela do painel */
  feedingList: readonly string[];
  feedingPenalty: string;
  level: number;
  mend: number;
  mendAmount: string;
  powerBonus: string;
  rouseReroll: string;
}

export const BLOOD_POTENCY: readonly BloodPotencyRow[] = [
  {
    baneSeverity: 0,
    bloodSurge: "Adicione 1 dado",
    feedingList: ["Nenhum efeito"],
    feedingPenalty: "Nenhum efeito",
    level: 0,
    mend: 1,
    mendAmount: "1 ponto de dano Superficial por Checagem de Sangue",
    powerBonus: "Nenhum",
    rouseReroll: "Nenhum",
  },
  {
    baneSeverity: 2,
    bloodSurge: "Adicione 2 dados",
    feedingList: ["Nenhum efeito"],
    feedingPenalty: "Nenhum efeito",
    level: 1,
    mend: 1,
    mendAmount: "1 ponto de dano Superficial por Checagem de Sangue",
    powerBonus: "Nenhum",
    rouseReroll: "Nível 1",
  },
  {
    baneSeverity: 2,
    bloodSurge: "Adicione 2 dados",
    feedingList: ["Sangue animal ou ensacado sacia meia Fome"],
    feedingPenalty: "Sangue animal ou ensacado sacia meia Fome",
    level: 2,
    mend: 2,
    mendAmount: "2 pontos de dano Superficial por Checagem de Sangue",
    powerBonus: "Adicione 1 dado",
    rouseReroll: "Nível 1",
  },
  {
    baneSeverity: 3,
    bloodSurge: "Adicione 3 dados",
    feedingList: ["Sangue animal ou ensacado não sacia nenhuma Fome"],
    feedingPenalty: "Sangue animal ou ensacado não sacia nenhuma Fome",
    level: 3,
    mend: 2,
    mendAmount: "2 pontos de dano Superficial por Checagem de Sangue",
    powerBonus: "Adicione 1 dado",
    rouseReroll: "Nível 2 e abaixo",
  },
  {
    baneSeverity: 3,
    bloodSurge: "Adicione 3 dados",
    feedingList: [
      "Sangue animal ou ensacado não sacia nenhuma Fome",
      "Sacia 1 a menos de Fome por humano",
    ],
    feedingPenalty:
      "Sangue animal ou ensacado não sacia nenhuma Fome. Sacia 1 a menos de Fome por humano",
    level: 4,
    mend: 3,
    mendAmount: "3 pontos de dano Superficial por Checagem de Sangue",
    powerBonus: "Adicione 2 dados",
    rouseReroll: "Nível 2 e abaixo",
  },
  {
    baneSeverity: 4,
    bloodSurge: "Adicione 4 dados",
    feedingList: [
      "Sangue animal ou ensacado não sacia nenhuma Fome",
      "Sacia 1 a menos de Fome por humano",
      "Precisa drenar e matar um humano para reduzir a Fome abaixo de 2",
    ],
    feedingPenalty:
      "Sangue animal ou ensacado não sacia nenhuma Fome. Sacia 1 a menos de Fome por humano. Precisa drenar e matar um humano para reduzir a Fome abaixo de 2",
    level: 5,
    mend: 3,
    mendAmount: "3 pontos de dano Superficial por Checagem de Sangue",
    powerBonus: "Adicione 2 dados",
    rouseReroll: "Nível 3 e abaixo",
  },
  {
    baneSeverity: 4,
    bloodSurge: "Adicione 4 dados",
    feedingList: [
      "Sangue animal ou ensacado não sacia nenhuma Fome",
      "Sacia 2 a menos de Fome por humano",
      "Precisa drenar e matar um humano para reduzir a Fome abaixo de 2",
    ],
    feedingPenalty:
      "Sangue animal ou ensacado não sacia nenhuma Fome. Sacia 2 a menos de Fome por humano. Precisa drenar e matar um humano para reduzir a Fome abaixo de 2",
    level: 6,
    mend: 3,
    mendAmount: "3 pontos de dano Superficial por Checagem de Sangue",
    powerBonus: "Adicione 3 dados",
    rouseReroll: "Nível 3 e abaixo",
  },
  {
    baneSeverity: 5,
    bloodSurge: "Adicione 5 dados",
    feedingList: [
      "Sangue animal ou ensacado não sacia nenhuma Fome",
      "Sacia 2 a menos de Fome por humano",
      "Precisa drenar e matar um humano para reduzir a Fome abaixo de 2",
    ],
    feedingPenalty:
      "Sangue animal ou ensacado não sacia nenhuma Fome. Sacia 2 a menos de Fome por humano. Precisa drenar e matar um humano para reduzir a Fome abaixo de 2",
    level: 7,
    mend: 3,
    mendAmount: "3 pontos de dano Superficial por Checagem de Sangue",
    powerBonus: "Adicione 3 dados",
    rouseReroll: "Nível 4 e abaixo",
  },
  {
    baneSeverity: 5,
    bloodSurge: "Adicione 5 dados",
    feedingList: [
      "Sangue animal ou ensacado não sacia nenhuma Fome",
      "Sacia 2 a menos de Fome por humano",
      "Precisa drenar e matar um humano para reduzir a Fome abaixo de 3",
    ],
    feedingPenalty:
      "Sangue animal ou ensacado não sacia nenhuma Fome. Sacia 2 a menos de Fome por humano. Precisa drenar e matar um humano para reduzir a Fome abaixo de 3",
    level: 8,
    mend: 4,
    mendAmount: "4 pontos de dano Superficial por Checagem de Sangue",
    powerBonus: "Adicione 4 dados",
    rouseReroll: "Nível 4 e abaixo",
  },
  {
    baneSeverity: 6,
    bloodSurge: "Adicione 6 dados",
    feedingList: [
      "Sangue animal ou ensacado não sacia nenhuma Fome",
      "Sacia 2 a menos de Fome por humano",
      "Precisa drenar e matar um humano para reduzir a Fome abaixo de 3",
    ],
    feedingPenalty:
      "Sangue animal ou ensacado não sacia nenhuma Fome. Sacia 2 a menos de Fome por humano. Precisa drenar e matar um humano para reduzir a Fome abaixo de 3",
    level: 9,
    mend: 4,
    mendAmount: "4 pontos de dano Superficial por Checagem de Sangue",
    powerBonus: "Adicione 4 dados",
    rouseReroll: "Nível 5 e abaixo",
  },
  {
    baneSeverity: 6,
    bloodSurge: "Adicione 6 dados",
    feedingList: [
      "Sangue animal ou ensacado não sacia nenhuma Fome",
      "Sacia 3 a menos de Fome por humano",
      "Precisa drenar e matar um humano para reduzir a Fome abaixo de 3",
    ],
    feedingPenalty:
      "Sangue animal ou ensacado não sacia nenhuma Fome. Sacia 3 a menos de Fome por humano. Precisa drenar e matar um humano para reduzir a Fome abaixo de 3",
    level: 10,
    mend: 5,
    mendAmount: "5 pontos de dano Superficial por Checagem de Sangue",
    powerBonus: "Adicione 5 dados",
    rouseReroll: "Nível 5 e abaixo",
  },
];

export function bloodPotencyRow(level: number): BloodPotencyRow {
  return BLOOD_POTENCY[level] ?? BLOOD_POTENCY[0];
}
