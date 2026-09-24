// Portado de design/reference/logic.js. Não editar à mão sem conferir a referência.
export interface Generation {
  bloodPotency: number;
  label: string;
}

export const GENERATIONS: readonly Generation[] = [
  { bloodPotency: 0, label: "16ª" },
  { bloodPotency: 0, label: "15ª" },
  { bloodPotency: 1, label: "14ª" },
  { bloodPotency: 1, label: "13ª" },
  { bloodPotency: 1, label: "12ª" },
  { bloodPotency: 1, label: "11ª" },
  { bloodPotency: 2, label: "10ª" },
  { bloodPotency: 2, label: "9ª" },
];
