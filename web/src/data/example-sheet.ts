import { normalizeSheet } from "#/lib/sheet";
import type { Sheet } from "#/lib/types";
import example from "./example-sheet.json";

/** Ficha de exemplo do standalone (`dadosDeExemplo`), completada com os padrões. */
export function exampleSheet(): Sheet {
  return normalizeSheet(example);
}
