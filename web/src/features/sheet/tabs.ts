import { settings } from "#/lib/settings";

export const SHEET_TABS = [
  { id: "caracteristicas", label: "Características" },
  { id: "disciplinas-e-sangue", label: "Disciplinas & Sangue" },
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
const LEGACY_TABS = new Map<string, SheetTab>([
  ["registros", "resumo"],
  ["ficha", "caracteristicas"],
  ["disciplinas", "disciplinas-e-sangue"],
]);

export function legacyTab(value: string): SheetTab | undefined {
  return LEGACY_TABS.get(value);
}

export function isSheetTab(value: string): value is SheetTab {
  return visibleTabs.some((t) => t.id === value);
}

export const DEFAULT_TAB: SheetTab = "caracteristicas";

/**
 * Aba a exibir para o valor da URL: a própria, a nova de um id antigo ou a
 * padrão. `redirect` indica que a URL precisa ser trocada.
 */
export function resolveTab(value: string): {
  redirect: boolean;
  tab: SheetTab;
} {
  if (isSheetTab(value)) {
    return { redirect: false, tab: value };
  }
  return { redirect: true, tab: legacyTab(value) ?? DEFAULT_TAB };
}
