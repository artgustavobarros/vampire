export type GeneralCompulsion = "Fome" | "Dominância" | "Dano" | "Paranoia";

/** Compulsões gerais da falha bestial: efeito para ler na mesa. */
export const COMPULSIONS: Record<GeneralCompulsion, string> = {
  Dano: "A Besta quer ferir. −2 dados em toda ação que não seja para machucar alguém, até causar dano, mesmo Superficial.",
  Dominância:
    "Precisa provar que está no controle. −2 dados em toda ação que não seja para impor sua vontade, até dominar alguém ou vencer uma disputa.",
  Fome: "A Besta exige sangue. −2 dados em toda ação que não seja para se alimentar, até saciar ao menos 1 de Fome.",
  Paranoia:
    "Todos parecem uma ameaça. −2 dados em toda ação que não seja para se proteger ou descobrir quem está contra ele, até se sentir seguro.",
};

export const COMPULSION_DURATION =
  "Dura até ser satisfeita ou até o fim da cena.";
