import { settings } from "#/lib/settings";

export const SHEET_TABS = [
  { id: "ficha", label: "Ficha" },
  { id: "disciplinas", label: "Disciplinas" },
  { id: "acoes", label: "Ações" },
  { id: "registros", label: "Registros" },
  { id: "notas", label: "Notas" },
  { id: "sessoes", label: "Sessões & XP" },
] as const;

export type SheetTab = (typeof SHEET_TABS)[number]["id"];

export const visibleTabs = SHEET_TABS.filter(
  (t) => t.id !== "sessoes" || settings.mostrarXP
);

export function isSheetTab(value: string): value is SheetTab {
  return visibleTabs.some((t) => t.id === value);
}

export function tabLabel(tab: SheetTab): string {
  return SHEET_TABS.find((t) => t.id === tab)?.label ?? "Ficha";
}
