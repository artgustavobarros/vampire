import { POWER_ALIASES, POWERS, type PowerTemplate } from "#/data/disciplines";
import {
  type Dyscrasia,
  type Intensity,
  type Mood,
  RESONANCE_MOODS,
} from "#/data/resonance";

export const RANDOM = "Aleatória";
export type Choice<T> = T | typeof RANDOM;

export interface ResonanceChoice {
  intensidade: Choice<Intensity>;
  /** sangue-fraco ganha um poder do humor em Intensa (nível 1) e Aguçada (nível 2) */
  sangueFraco: boolean;
  tipo: Choice<Mood>;
}

export interface ThinBloodPower {
  disciplina: string;
  nivel: 1 | 2;
  poder: PowerTemplate;
}

export interface ResonanceRoll {
  /** só os dados rolados; o que foi escolhido não tem dado */
  dados: {
    disciplina?: number;
    discrasia?: number;
    intensidade?: number[];
    /** `faces` é o tamanho da lista de poderes do nível */
    poder?: { faces: number; valor: number };
    ressonancia?: number;
  };
  discrasia: Dyscrasia | null;
  intensidade: Intensity;
  poder: ThinBloodPower | null;
  tipo: Mood;
}

/** Rola um dado de `faces` lados: 1..faces. */
export type Die = (faces: number) => number;

export const rollDie: Die = (faces) => {
  try {
    const [n] = crypto.getRandomValues(new Uint32Array(1));
    return (n % faces) + 1;
  } catch {
    return Math.floor(Math.random() * faces) + 1;
  }
};

/** Ressonância em d10: 1–3 fleumática, 4–6 melancólica, 7–8 colérica, 9–10 sanguínea. */
function moodFromD10(n: number): Mood {
  if (n <= 3) {
    return "Fleumática";
  }
  if (n <= 6) {
    return "Melancólica";
  }
  return n <= 8 ? "Colérica" : "Sanguínea";
}

/** Intensidade em d10: 1–5 negligenciável, 6–8 difusa, 9–10 rola de novo (9–10 aguçada, senão intensa). */
function rollIntensity(d: Die): { dados: number[]; intensidade: Intensity } {
  const first = d(10);
  if (first <= 5) {
    return { dados: [first], intensidade: "Negligenciável" };
  }
  if (first <= 8) {
    return { dados: [first], intensidade: "Difusa" };
  }
  const second = d(10);
  return {
    dados: [first, second],
    intensidade: second >= 9 ? "Aguçada" : "Intensa",
  };
}

/** Poderes do nível que um sangue-fraco pode ganhar: sem rituais, amálgamas e apelidos. */
export function thinBloodPowers(
  disciplina: string,
  nivel: number
): PowerTemplate[] {
  return (POWERS[disciplina] ?? []).filter(
    (p) =>
      p.level === nivel &&
      !(p.ingredients || p.amalgam) &&
      !(p.name in POWER_ALIASES)
  );
}

function rollThinBloodPower(
  tipo: Mood,
  nivel: 1 | 2,
  d: Die,
  dados: ResonanceRoll["dados"]
): ThinBloodPower | null {
  const { disciplinas } = RESONANCE_MOODS[tipo];
  dados.disciplina = d(disciplinas.length);
  const disciplina = disciplinas[dados.disciplina - 1];
  const poderes = thinBloodPowers(disciplina, nivel);
  if (poderes.length === 0) {
    return null;
  }
  // um só poder no nível: não rola
  const valor = poderes.length > 1 ? d(poderes.length) : 1;
  if (poderes.length > 1) {
    dados.poder = { faces: poderes.length, valor };
  }
  return { disciplina, nivel, poder: poderes[valor - 1] };
}

/**
 * Sorteia o que estiver em Aleatória; em Aguçada, rola a discrasia em d3; com
 * sangue-fraco em Intensa ou Aguçada, rola uma Disciplina do humor e um poder.
 */
export function rollResonance(
  escolha: ResonanceChoice,
  d: Die = rollDie
): ResonanceRoll {
  const dados: ResonanceRoll["dados"] = {};

  const ressonancia = escolha.tipo === RANDOM ? d(10) : undefined;
  const tipo =
    ressonancia === undefined
      ? (escolha.tipo as Mood)
      : moodFromD10(ressonancia);
  if (ressonancia !== undefined) {
    dados.ressonancia = ressonancia;
  }

  const rolled =
    escolha.intensidade === RANDOM
      ? rollIntensity(d)
      : { dados: undefined, intensidade: escolha.intensidade };
  if (rolled.dados) {
    dados.intensidade = rolled.dados;
  }
  const { intensidade } = rolled;

  let discrasia: Dyscrasia | null = null;
  if (intensidade === "Aguçada") {
    dados.discrasia = d(3);
    discrasia = RESONANCE_MOODS[tipo].discrasias[dados.discrasia - 1];
  }

  const nivel = THIN_BLOOD_LEVEL[intensidade];
  const poder =
    escolha.sangueFraco && nivel
      ? rollThinBloodPower(tipo, nivel, d, dados)
      : null;

  return { dados, discrasia, intensidade, poder, tipo };
}

const THIN_BLOOD_LEVEL: Partial<Record<Intensity, 1 | 2>> = {
  Aguçada: 2,
  Intensa: 1,
};

/**
 * Linha dos dados do resultado: primeiro os dados, na ordem em que foram
 * rolados, depois o que foi escolhido. Ex.: "Discrasia d3: 1 · Fleumática
 * (escolhida) · Aguçada (escolhida)".
 */
export function diceLine({ dados, intensidade, tipo }: ResonanceRoll): string {
  const rolados: string[] = [];
  const escolhidos: string[] = [];
  if (dados.ressonancia === undefined) {
    escolhidos.push(`${tipo} (escolhida)`);
  } else {
    rolados.push(`Ressonância d10: ${dados.ressonancia}`);
  }
  if (dados.intensidade === undefined) {
    escolhidos.push(`${intensidade} (escolhida)`);
  } else {
    rolados.push(`Intensidade d10: ${dados.intensidade.join(", ")}`);
  }
  if (dados.discrasia !== undefined) {
    rolados.push(`Discrasia d3: ${dados.discrasia}`);
  }
  if (dados.disciplina !== undefined) {
    rolados.push(`Disciplina d2: ${dados.disciplina}`);
  }
  if (dados.poder) {
    rolados.push(`Poder d${dados.poder.faces}: ${dados.poder.valor}`);
  }
  return [...rolados, ...escolhidos].join(" · ");
}
