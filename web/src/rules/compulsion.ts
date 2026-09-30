import { type Clan, findClan } from "#/data/clans";
import type { GeneralCompulsion } from "#/data/compulsions";
import { type Die, rollDie } from "./resonance";

export type CompulsionRoll =
  | { dados: number[]; tipo: GeneralCompulsion }
  /** `clan` só existe quando o Mestre marcou um clã com compulsão */
  | { clan?: Clan; dados: number[]; tipo: "Clã" };

/** Compulsão em d10: 1–3 Fome, 4–5 Dominância, 6–7 Dano, 8–9 Paranoia. */
function compulsionFromD10(n: number): GeneralCompulsion {
  if (n <= 3) {
    return "Fome";
  }
  if (n <= 5) {
    return "Dominância";
  }
  return n <= 7 ? "Dano" : "Paranoia";
}

/**
 * Rola a compulsão da falha bestial em d10. No 10 vale a do clã; clãs sem
 * compulsão (Caitiff, Sangue-ralo) rolam de novo até sair 1–9.
 */
export function rollCompulsion(
  clanName: string | null,
  d: Die = rollDie
): CompulsionRoll {
  const clan = clanName ? findClan(clanName) : undefined;
  const semCompulsao = clan?.compulsion === "Nenhuma";
  const dados = [d(10)];
  while (semCompulsao && dados.at(-1) === 10) {
    dados.push(d(10));
  }
  const ultimo = dados.at(-1) ?? 1;
  if (ultimo === 10) {
    return clan ? { clan, dados, tipo: "Clã" } : { dados, tipo: "Clã" };
  }
  return { dados, tipo: compulsionFromD10(ultimo) };
}

/** Ex.: "Compulsão d10: 4" ou, com nova rolagem, "Compulsão d10: 10, 10, 6". */
export function compulsionDiceLine({ dados }: CompulsionRoll): string {
  return `Compulsão d10: ${dados.join(", ")}`;
}
