import type { TextFieldKey } from "#/data/fields";

/** 0 = vazio, 1 = superficial (/), 2 = agravado (✕) */
export type DamageMark = 0 | 1 | 2;

export type TrackKey = "vit" | "fdv";

export interface Power {
  custo?: string;
  desc?: string;
  duracao?: string;
  nivel: number;
  nome: string;
  rouse?: boolean;
}

export interface Discipline {
  nivel: number;
  nome: string;
  powers: Power[];
}

/** `qualidade-sr` e `defeito-sr` só existem para Sangue Fraco. */
export type MeritKind = "vantagem" | "defeito" | "qualidade-sr" | "defeito-sr";

export interface Merit {
  nome: string;
  /** linha acrescentada pelo Predador ao concluir o assistente */
  origem?: "predador";
  pontos: number;
  tipo: MeritKind;
}

/** O que o Predador somou à ficha ao concluir, para desfazer sem duplicar. */
export interface PredatorBonus {
  disciplina: string;
  humanidade: number;
  /** a Disciplina não existia e foi acrescentada com 1 ponto */
  novaDisciplina: boolean;
  /** nome do poder acrescentado junto com o ponto */
  poder?: string;
  potencia: number;
}

export interface Conviction {
  /** convicção */
  c: string;
  /** pilar */
  p: string;
}

export interface SessionLog {
  data: string;
  resumo: string;
  xp: string;
}

/**
 * Formato da ficha herdado do standalone (`vtm5.sheet.<email>`).
 * Os nomes em português são mantidos para não mudar o JSON salvo.
 */
export type Sheet = Partial<Record<TextFieldKey, string>> & {
  criada: boolean;
  attrs: Record<string, number>;
  skills: Record<string, number>;
  fome: number;
  humanidade: number;
  /** quantidade de manchas; derivado de `manchasIdx` quando existe */
  manchas: number;
  /** marca de mancha por caixa de Humanidade (10 posições) */
  manchasIdx?: boolean[];
  /** usado só quando a geração não é reconhecida */
  potencia: number;
  vit: DamageMark[];
  fdv: DamageMark[];
  disc: Discipline[];
  conv: Conviction[];
  sessoes: SessionLog[];
  notas: string;
  ressonancia: string;
  resIntensidade?: string;
  xpTotal: string;
  xpGasto: string;
  noites: number;
  /** especialidades por habilidade; a primeira é a escolhida no assistente */
  espec?: Record<string, string[]>;
  especLivre?: string;
  /** nome da distribuição de habilidades */
  dist?: string;
  predEspec?: string;
  /** nome confirmado da especialidade do Predador; sem ele, ela está pendente */
  predEspecNome?: string;
  predDisc?: string;
  /** nome do poder que o ponto de Disciplina do Predador dá */
  predPoder?: string;
  /** escolhas dos ajustes do Predador: id do ajuste → pontos por opção */
  predEscolhas?: Record<string, Record<string, number>>;
  predBonus?: PredatorBonus;
  meritos?: Merit[];
};
