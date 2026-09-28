import type { DamageMark, Sheet, TrackKey } from "#/lib/types";

export function vitalityMax(sheet: Pick<Sheet, "attrs">): number {
  return (sheet.attrs.Vigor || 1) + 3;
}

export function willpowerMax(sheet: Pick<Sheet, "attrs">): number {
  return (sheet.attrs.Autocontrole || 1) + (sheet.attrs.Determinação || 1);
}

export function trackMax(sheet: Sheet, key: TrackKey): number {
  return key === "vit" ? vitalityMax(sheet) : willpowerMax(sheet);
}

/** Caixas da trilha no tamanho atual, preservando marcas existentes. */
export function trackBoxes(
  marks: readonly DamageMark[] | undefined,
  max: number
): DamageMark[] {
  const out = (marks ?? []).slice(0, max);
  while (out.length < max) {
    out.push(0);
  }
  return out;
}

/** vazio → superficial → agravado → vazio */
export function cycleBox(
  marks: readonly DamageMark[],
  index: number
): DamageMark[] {
  const next = marks.slice();
  next[index] = (((next[index] ?? 0) + 1) % 3) as DamageMark;
  return next;
}

export interface DamageResult {
  applied: number;
  marks: DamageMark[];
  overflow: number;
}

/**
 * Marca `qty` danos. Sem caixa vazia, um superficial vira agravado (transbordo).
 */
export function addDamage(
  marks: readonly DamageMark[],
  level: 1 | 2,
  qty = 1
): DamageResult {
  const next = marks.slice();
  let applied = 0;
  let overflow = 0;
  for (let n = 0; n < qty; n += 1) {
    const empty = next.indexOf(0);
    if (empty >= 0) {
      next[empty] = level;
      applied += 1;
      continue;
    }
    const superficial = next.indexOf(1);
    if (superficial >= 0) {
      next[superficial] = 2;
      applied += 1;
    }
    overflow += 1;
  }
  return { applied, marks: next, overflow };
}

/** Cura até `amount` marcas do tipo `level`, da última caixa para a primeira; a caixa fica vazia. */
export function healMarks(
  marks: readonly DamageMark[],
  level: 1 | 2,
  amount: number
): { marks: DamageMark[]; healed: number } {
  const next = marks.slice();
  let healed = 0;
  for (let i = next.length - 1; i >= 0 && healed < amount; i -= 1) {
    if (next[i] === level) {
      next[i] = 0;
      healed += 1;
    }
  }
  return { healed, marks: next };
}

/** Quantas caixas têm a marca `level`: o máximo que dá para curar desse tipo. */
export function healable(marks: readonly DamageMark[], level: 1 | 2): number {
  return marks.filter((m) => m === level).length;
}

const TRACK_NAME: Record<TrackKey, string> = {
  fdv: "Força de Vontade",
  vit: "Vitalidade",
};

export interface TrackChangeResult {
  changed: boolean[];
  marks: DamageMark[];
  note: string;
  patch: Partial<Sheet>;
}

function plural(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}

/**
 * Resultado comum de dano e cura: `changed` compara com a ficha e, com caixas
 * clicadas (`base`), a nota descreve a trilha em vez de `plainNote`.
 */
function trackChange(
  track: TrackKey,
  marks: DamageMark[],
  before: readonly DamageMark[],
  base: readonly DamageMark[] | undefined,
  plainNote: string
): TrackChangeResult {
  const count = (mark: DamageMark) => marks.filter((m) => m === mark).length;
  let note = base
    ? `${TRACK_NAME[track]} atualizada: ${plural(count(1), "superficial", "superficiais")}, ${plural(count(2), "agravado", "agravados")}.`
    : plainNote;
  if (track === "vit" && marks.every((m) => m === 2)) {
    note += " Vitalidade toda agravada: torpor.";
  } else if (marks.every((m) => m !== 0)) {
    note += " Trilha cheia: Debilitado.";
  }
  return {
    changed: marks.map((m, i) => m !== before[i]),
    marks,
    note,
    patch: { [track]: marks },
  };
}

const LEVEL_NAME = { 1: "superficial", 2: "agravado" } as const;

/**
 * Aplica `amount` de dano na trilha, sem divisão, e descreve o que mudou.
 * `base` são as caixas marcadas à mão no diálogo; `changed` compara com a ficha.
 */
export function takeDamage(
  sheet: Sheet,
  track: TrackKey,
  level: 1 | 2,
  amount: number,
  base?: readonly DamageMark[]
): TrackChangeResult {
  const before = trackBoxes(sheet[track], trackMax(sheet, track));
  const { marks } = addDamage(base ?? before, level, amount);
  return trackChange(
    track,
    marks,
    before,
    base,
    `${amount} de dano ${LEVEL_NAME[level]} marcado na ${TRACK_NAME[track]}.`
  );
}

/**
 * Cura `amount` marcas do tipo `level` na trilha e descreve o que mudou.
 * `base` são as caixas marcadas à mão no diálogo; `changed` compara com a ficha.
 */
export function healDamage(
  sheet: Sheet,
  track: TrackKey,
  level: 1 | 2,
  amount: number,
  base?: readonly DamageMark[]
): TrackChangeResult {
  const before = trackBoxes(sheet[track], trackMax(sheet, track));
  const { marks } = healMarks(base ?? before, level, amount);
  return trackChange(
    track,
    marks,
    before,
    base,
    `${amount} de dano ${LEVEL_NAME[level]} curado na ${TRACK_NAME[track]}.`
  );
}
