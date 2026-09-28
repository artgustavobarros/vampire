import { settings } from "#/lib/settings";

export const SHEET_TABS = [
  { id: "ficha", label: "Características" },
  { id: "disciplinas", label: "Disciplinas" },
  { id: "acoes", label: "Ações" },
  { id: "resumo", label: "Biografia" },
  { id: "notas", label: "Notas" },
  { id: "sessoes", label: "Sessões & XP" },
] as const;

export type SheetTab = (typeof SHEET_TABS)[number]["id"];

export const visibleTabs = SHEET_TABS.filter(
  (t) => t.id !== "sessoes" || settings.mostrarXP
);

/** ids antigos que redirecionam para a aba atual */
const LEGACY_TABS = new Map<string, SheetTab>([["registros", "resumo"]]);

export function legacyTab(value: string): SheetTab | undefined {
  return LEGACY_TABS.get(value);
}

export function isSheetTab(value: string): value is SheetTab {
  return visibleTabs.some((t) => t.id === value);
}

export function tabLabel(tab: SheetTab): string {
  return SHEET_TABS.find((t) => t.id === tab)?.label ?? "Características";
}
