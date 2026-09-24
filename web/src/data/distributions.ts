// Portado de design/reference/logic.js. Não editar à mão sem conferir a referência.
export interface SkillDistribution {
  description: string;
  name: string;
  /** nível → quantidade de habilidades nesse nível */
  targets: Readonly<Record<number, number>>;
}

export const SKILL_DISTRIBUTIONS: readonly SkillDistribution[] = [
  {
    description: "Um pouco de tudo, sem especialidade.",
    name: "Faz-tudo",
    targets: { 1: 10, 2: 8, 3: 1 },
  },
  {
    description: "Competência distribuída em várias frentes.",
    name: "Equilibrado",
    targets: { 1: 7, 2: 5, 3: 3 },
  },
  {
    description: "Excelência em poucas coisas.",
    name: "Especialista",
    targets: { 1: 3, 2: 3, 3: 3, 4: 1 },
  },
];

/** O standalone usa "Equilibrado" quando nenhuma distribuição foi escolhida. */
export const [, DEFAULT_DISTRIBUTION] = SKILL_DISTRIBUTIONS;
