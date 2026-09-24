// Portado de design/reference/logic.js. Não editar à mão sem conferir a referência.
export interface BloodPotencyRow {
  baneSeverity: number;
  bloodSurge: string;
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
    bloodSurge: "+1 dado",
    feedingPenalty: "Nenhuma",
    level: 0,
    mend: 1,
    mendAmount: "1 dano superficial por Teste de Despertar",
    powerBonus: "Nenhum",
    rouseReroll: "Nenhuma",
  },
  {
    baneSeverity: 2,
    bloodSurge: "+2 dados",
    feedingPenalty: "Nenhuma",
    level: 1,
    mend: 1,
    mendAmount: "1 dano superficial por Teste de Despertar",
    powerBonus: "+1 dado",
    rouseReroll: "1 rerrolagem por noite para poderes de Disciplina de nível 1",
  },
  {
    baneSeverity: 2,
    bloodSurge: "+2 dados",
    feedingPenalty: "Sangue animal rende metade",
    level: 2,
    mend: 2,
    mendAmount: "2 danos superficiais por Teste de Despertar",
    powerBonus: "+1 dado",
    rouseReroll: "1 rerrolagem por noite para poderes de Disciplina de nível 1",
  },
  {
    baneSeverity: 3,
    bloodSurge: "+3 dados",
    feedingPenalty: "Sangue animal não sacia",
    level: 3,
    mend: 2,
    mendAmount: "2 danos superficiais por Teste de Despertar",
    powerBonus: "+2 dados",
    rouseReroll: "1 rerrolagem por noite para poderes de Disciplina de nível 2",
  },
  {
    baneSeverity: 3,
    bloodSurge: "+3 dados",
    feedingPenalty: "Precisa drenar um humano por completo",
    level: 4,
    mend: 3,
    mendAmount: "3 danos superficiais por Teste de Despertar",
    powerBonus: "+2 dados",
    rouseReroll: "1 rerrolagem por noite para poderes de Disciplina de nível 2",
  },
  {
    baneSeverity: 4,
    bloodSurge: "+4 dados",
    feedingPenalty: "Só sacia matando",
    level: 5,
    mend: 3,
    mendAmount: "3 danos superficiais por Teste de Despertar",
    powerBonus: "+3 dados",
    rouseReroll: "1 rerrolagem por noite para poderes de Disciplina de nível 3",
  },
  {
    baneSeverity: 4,
    bloodSurge: "+4 dados",
    feedingPenalty: "Só sacia matando",
    level: 6,
    mend: 3,
    mendAmount: "3 danos superficiais por Teste de Despertar",
    powerBonus: "+3 dados",
    rouseReroll: "1 rerrolagem por noite para poderes de Disciplina de nível 3",
  },
  {
    baneSeverity: 5,
    bloodSurge: "+5 dados",
    feedingPenalty: "Só sacia matando; sangue de bolsa não sustenta",
    level: 7,
    mend: 3,
    mendAmount: "3 danos superficiais por Teste de Despertar",
    powerBonus: "+4 dados",
    rouseReroll: "1 rerrolagem por noite para poderes de Disciplina de nível 4",
  },
  {
    baneSeverity: 5,
    bloodSurge: "+5 dados",
    feedingPenalty: "Só sacia matando; sangue de bolsa não sustenta",
    level: 8,
    mend: 4,
    mendAmount: "4 danos superficiais por Teste de Despertar",
    powerBonus: "+4 dados",
    rouseReroll: "1 rerrolagem por noite para poderes de Disciplina de nível 4",
  },
  {
    baneSeverity: 6,
    bloodSurge: "+6 dados",
    feedingPenalty: "Só sacia matando; sangue humano rende cada vez menos",
    level: 9,
    mend: 4,
    mendAmount: "4 danos superficiais por Teste de Despertar",
    powerBonus: "+5 dados",
    rouseReroll: "1 rerrolagem por noite para poderes de Disciplina de nível 5",
  },
  {
    baneSeverity: 6,
    bloodSurge: "+6 dados",
    feedingPenalty: "Só sacia matando; sangue humano rende cada vez menos",
    level: 10,
    mend: 5,
    mendAmount: "5 danos superficiais por Teste de Despertar",
    powerBonus: "+5 dados",
    rouseReroll: "1 rerrolagem por noite para poderes de Disciplina de nível 5",
  },
];

export function bloodPotencyRow(level: number): BloodPotencyRow {
  return BLOOD_POTENCY[level] ?? BLOOD_POTENCY[0];
}
