import { Link, Outlet, useNavigate, useParams } from "@tanstack/react-router";
import { type ReactNode, useState } from "react";
import {
  Sheet as Drawer,
  SheetContent as DrawerContent,
  SheetTitle as DrawerTitle,
} from "#/components/ui/sheet";
import { HungerAlert } from "#/features/actions/hunger-alert";
import { RuleDialogProvider } from "#/features/actions/rule-dialog";
import { logout } from "#/lib/auth";
import { cn } from "#/lib/utils";
import { useCharacterStore, useSheet } from "#/stores/character-store";
import { usePlayerStore } from "#/stores/player-store";
import { BottomBar } from "./bottom-bar";
import { DEFAULT_TAB, isSheetTab, type SheetTab, tabsFor } from "./tabs";

/** Botão da faixa do Mestre: Karla caixa-alta com borda. */
const BAR_BTN =
  "flex min-h-9 cursor-pointer items-center border px-3 font-label font-semibold text-xs uppercase leading-none tracking-[.12em] focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2";

const MENU_ITEM =
  "cursor-pointer flex min-h-12 items-center border-line-soft border-b font-label font-semibold text-xs uppercase leading-none tracking-widest";

/** Onde ficam as abas: a ficha do jogador ou a de um jogador aberta pelo Mestre. */
export type SheetTabsBase =
  | { to: "/ficha/$aba" }
  | { id: string; to: "/personagens/$id/$aba" };

interface TabLinkProps {
  aba: SheetTab;
  "aria-current"?: "page";
  base: SheetTabsBase;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

function TabLink({ aba, base, ...props }: TabLinkProps) {
  return base.to === "/ficha/$aba" ? (
    <Link {...props} params={{ aba }} to="/ficha/$aba" />
  ) : (
    <Link {...props} params={{ aba, id: base.id }} to="/personagens/$id/$aba" />
  );
}

export function SheetLayout({ tabs }: { tabs: SheetTabsBase }) {
  const role = usePlayerStore((s) => s.role);
  const ownerEmail = useCharacterStore((s) => s.owner?.email);
  const sheet = useSheet();
  const { aba } = useParams({ strict: false });
  const context = tabs.to === "/ficha/$aba" ? "jogador" : "mestre";
  const current = aba && isSheetTab(aba, context) ? aba : DEFAULT_TAB;
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const name = sheet.nome || "Sem nome";

  const signOut = async () => {
    await logout();
    navigate({ to: "/entrar" });
  };

  return (
    <RuleDialogProvider>
      <div className="min-h-screen pb-84 sm:pb-52">
        <div className="mx-auto max-w-[1440px] pb-5">
          {tabs.to === "/personagens/$id/$aba" && (
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 bg-blood px-4 py-3">
              <div className="min-w-0 basis-full truncate font-label font-semibold text-white text-xs uppercase leading-none tracking-[.12em] sm:flex-1 sm:basis-auto">
                Modo Mestre · {name} · Ficha de jogador
              </div>
              <div className="ml-auto flex flex-none gap-2">
                <Link
                  className={cn(BAR_BTN, "border-white text-white")}
                  to="/personagens"
                >
                  Lista de personagens
                </Link>
                <button
                  className={cn(BAR_BTN, "border-white bg-white text-blood")}
                  onClick={signOut}
                  type="button"
                >
                  Sair
                </button>
              </div>
            </div>
          )}
          <header className="flex items-center justify-between gap-3 border-line border-b px-4 py-2">
            <TabLink
              aba={DEFAULT_TAB}
              base={tabs}
              className="min-w-0 truncate font-semibold text-2xl leading-tight sm:text-3xl focus-visible:outline-2 focus-visible:outline-ink"
            >
              {name}
            </TabLink>
            <button
              aria-expanded={menuOpen}
              aria-label="Abrir menu"
              className="flex size-10 flex-none cursor-pointer flex-col items-end justify-center gap-1 focus-visible:outline-2 focus-visible:outline-ink"
              onClick={() => setMenuOpen(true)}
              type="button"
            >
              <span className="block h-px w-5 bg-ink" />
              <span className="block h-px w-5 bg-ink" />
              <span className="block h-px w-5 bg-ink" />
            </button>
          </header>

          <Drawer onOpenChange={setMenuOpen} open={menuOpen}>
            <DrawerContent
              aria-describedby={undefined}
              className="w-70 max-w-[84vw] gap-1 border-line border-l px-5 py-6 sm:max-w-70"
              showCloseButton={false}
            >
              <div className="mb-2 font-label font-semibold text-ink-faint text-xs uppercase leading-none tracking-[.12em]">
                {ownerEmail}
              </div>
              <DrawerTitle className="mb-6 font-semibold font-serif text-2xl leading-tight">
                {name}
              </DrawerTitle>
              <nav className="flex flex-col">
                {tabsFor(context).map((t) => (
                  <TabLink
                    aba={t.id}
                    aria-current={t.id === current ? "page" : undefined}
                    base={tabs}
                    className={cn(
                      MENU_ITEM,
                      t.id === current ? "bg-ink px-4 text-white" : "text-ink"
                    )}
                    key={t.id}
                    onClick={() => setMenuOpen(false)}
                  >
                    {t.label}
                  </TabLink>
                ))}
                {role === "dm" && (
                  <Link
                    className={cn(MENU_ITEM, "text-blood")}
                    onClick={() => setMenuOpen(false)}
                    to="/personagens"
                  >
                    Lista de personagens
                  </Link>
                )}
                <button
                  className={cn(MENU_ITEM, "text-left text-blood")}
                  onClick={() => {
                    setMenuOpen(false);
                    signOut();
                  }}
                  type="button"
                >
                  Sair
                </button>
              </nav>
            </DrawerContent>
          </Drawer>

          <main className="px-4 py-5">
            <Outlet />
          </main>
        </div>
        <BottomBar />
      </div>
      <HungerAlert />
    </RuleDialogProvider>
  );
}
