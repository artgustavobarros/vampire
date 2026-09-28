import type { MeritKind } from "#/lib/types";

/** Antecedente com nível mínimo, ou Disciplina que o personagem precisa ter. */
export type MeritRequirement =
  | { merit: string; min: number }
  | { discipline: string };

export interface MeritTemplate {
  /** nome em inglês e nomes antigos; entram na busca e no `findMerit` */
  aliases?: readonly string[];
  category: string;
  /** só estes clãs podem ter */
  clans?: readonly string[];
  description: string;
  excludeClans?: readonly string[];
  /** fora do Passo 7 (ex.: méritos de carniçal) */
  hidden?: boolean;
  /** um texto por valor permitido de `points` */
  levels?: readonly string[];
  name: string;
  /** Antecedente dono de uma sub-vantagem ou sub-defeito */
  parent?: string;
  /** 0 = sem valor em pontos */
  points: number | readonly number[];
  requires?: MeritRequirement;
  /** livro de origem */
  source: string;
  tipo: MeritKind;
}

/** Faixa "• +" sem teto no livro. */
export const OPEN_RANGE = [1, 2, 3, 4, 5] as const;
