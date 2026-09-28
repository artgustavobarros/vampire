import { settings } from "#/lib/settings";

export const SHEET_TABS = [
  { id: "caracteristicas", label: "Características" },
  { id: "disciplinas-e-sangue", label: "Disciplinas & Sangue" },
  { id: "acoes", label: "Ações" },
  { id: "coterie", label: "Coterie" },
  { id: "rodada", label: "Rodada" },
  { id: "resumo", label: "Biografia" },
  { id: "rolagens", label: "Rolagens" },
  { id: "sessoes", label: "Sessões & XP" },
] as const;

export type SheetTab = (typeof SHEET_TABS)[number]["id"];

/** A ficha do jogador ou a de um jogador aberta pelo Mestre. */
export type TabContext = "jogador" | "mestre";

/** O Mestre acompanha Coterie e Rodada pelo painel, não pela ficha. */
const PLAYER_ONLY: ReadonlySet<SheetTab> = new Set(["coterie", "rodada"]);

export function tabsFor(context: TabContext) {
  return SHEET_TABS.filter(
    (t) =>
      (t.id !== "sessoes" || settings.mostrarXP) &&
      (context === "jogador" || !PLAYER_ONLY.has(t.id))
  );
}

/** ids antigos que redirecionam para a aba atual */
const LEGACY_TABS = new Map<string, SheetTab>([
  ["registros", "resumo"],
  ["ficha", "caracteristicas"],
  ["disciplinas", "disciplinas-e-sangue"],
  ["notas", "rolagens"],
]);

export function legacyTab(value: string): SheetTab | undefined {
  return LEGACY_TABS.get(value);
}

export function isSheetTab(
  value: string,
  context: TabContext = "jogador"
): value is SheetTab {
  return tabsFor(context).some((t) => t.id === value);
}

export const DEFAULT_TAB: SheetTab = "caracteristicas";

/**
 * Aba a exibir para o valor da URL: a própria, a nova de um id antigo ou a
 * padrão. `redirect` indica que a URL precisa ser trocada.
 */
export function resolveTab(
  value: string,
  context: TabContext = "jogador"
): {
  redirect: boolean;
  tab: SheetTab;
} {
  if (isSheetTab(value, context)) {
    return { redirect: false, tab: value };
  }
  return { redirect: true, tab: legacyTab(value) ?? DEFAULT_TAB };
}
