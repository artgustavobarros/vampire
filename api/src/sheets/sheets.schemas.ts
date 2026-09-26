import { z } from "zod";

const INVALID = "Ficha inválida.";

/** Só um objeto JSON; as regras de Vampiro continuam no web. */
const sheetObject = z.record(z.string(), z.unknown(), { error: INVALID });

export const replaceSheetSchema = z.object(
  { sheet: sheetObject },
  { error: INVALID }
);

export const patchSheetSchema = z.object(
  { patch: sheetObject },
  { error: INVALID }
);

export type SheetData = z.infer<typeof sheetObject>;
export type ReplaceSheetDto = z.infer<typeof replaceSheetSchema>;
export type PatchSheetDto = z.infer<typeof patchSheetSchema>;
