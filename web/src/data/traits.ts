// Portado de design/reference/logic.js. Não editar à mão sem conferir a referência.
export interface TraitGroup {
  label: string;
  traits: readonly string[];
}

export const ATTRIBUTE_GROUPS: readonly TraitGroup[] = [
  { label: "Físicos", traits: ["Força", "Destreza", "Vigor"] },
  { label: "Sociais", traits: ["Carisma", "Manipulação", "Autocontrole"] },
  { label: "Mentais", traits: ["Inteligência", "Raciocínio", "Determinação"] },
];

export const SKILL_GROUPS: readonly TraitGroup[] = [
  {
    label: "Físicas",
    traits: [
      "Armas Brancas",
      "Armas de Fogo",
      "Atletismo",
      "Briga",
      "Condução",
      "Furtividade",
      "Ladroagem",
      "Ofícios",
      "Sobrevivência",
    ],
  },
  {
    label: "Sociais",
    traits: [
      "Empatia com Animais",
      "Etiqueta",
      "Intimidação",
      "Liderança",
      "Manha",
      "Performance",
      "Persuasão",
      "Sagacidade",
      "Subterfúgio",
    ],
  },
  {
    label: "Mentais",
    traits: [
      "Ciência",
      "Erudição",
      "Finanças",
      "Investigação",
      "Medicina",
      "Ocultismo",
      "Percepção",
      "Política",
      "Tecnologia",
    ],
  },
];

export const ATTRIBUTES: readonly string[] = ATTRIBUTE_GROUPS.flatMap(
  (g) => g.traits
);
export const SKILLS: readonly string[] = SKILL_GROUPS.flatMap((g) => g.traits);

/** Habilidades amplas que exigem especialidade quando têm pontos. */
export const REQUIRED_SPECIALTY_SKILLS: readonly string[] = [
  "Ciência",
  "Erudição",
  "Ofícios",
  "Performance",
];
