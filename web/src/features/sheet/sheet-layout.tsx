import {
  Link,
  Outlet,
  useNavigate,
  useParams,
  useRouterState,
} from "@tanstack/react-router";
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

/** A página "Conta" do dono da ficha, no mesmo layout. */
function AccountLink({
  base,
  ...props
}: Omit<TabLinkProps, "aba" | "children">) {
  return base.to === "/ficha/$aba" ? (
    <Link {...props} to="/ficha/conta">
      Conta
    </Link>
  ) : (
    <Link {...props} params={{ id: base.id }} to="/personagens/$id/conta">
      Conta
    </Link>
  );
}

const ACCOUNT_ROUTES = new Set(["/ficha/conta", "/personagens/$id/conta"]);

function TabLink({ aba, base, ...props }: TabLinkProps) {
  return base.to === "/ficha/$aba" ? (
    <Link {...props} params={{ aba }} to="/ficha/$aba" />
  ) : (
    <Link {...props} params={{ aba, id: base.id }} to="/personagens/$id/$aba" />
  );
}

export function SheetLayout({ tabs }: { tabs: SheetTabsBase }) {
  const role = usePlayerStore((s) => s.role);
  const ownerUsername = useCharacterStore((s) => s.owner?.username);
  const onAccount = useRouterState({
    select: (s) => s.matches.some((m) => ACCOUNT_ROUTES.has(m.routeId)),
  });
  const sheet = useSheet();
  const { aba } = useParams({ strict: false });
  const context = tabs.to === "/ficha/$aba" ? "jogador" : "mestre";
  const tab = aba && isSheetTab(aba, context) ? aba : DEFAULT_TAB;
  // na página "Conta" nenhuma aba fica destacada
  const current = onAccount ? null : tab;
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const name = sheet.nome || "Sem nome";
  const lineage = [sheet.geracao && `${sheet.geracao} Geração`, sheet.cla]
    .filter(Boolean)
    .join(" · ");

  const signOut = async () => {
    await logout();
    navigate({ to: "/entrar" });
  };

  return (
    <RuleDialogProvider>
      <div className="min-h-screen pb-16 sm:pb-52">
        <div className="mx-auto max-w-[1440px] pb-5">
          {tabs.to === "/personagens/$id/$aba" && (
            <div className="bg-blood px-4 py-3 font-label font-semibold text-white text-xs uppercase leading-none tracking-[.12em]">
              Modo Mestre
            </div>
          )}
          <header className="flex items-center justify-between gap-3 border-line border-b px-4 py-2">
            <div className="flex min-w-0 items-center gap-3">
              <TabLink
                aba={DEFAULT_TAB}
                base={tabs}
                className="min-w-0 truncate font-semibold text-2xl leading-tight focus-visible:outline-2 focus-visible:outline-ink sm:text-3xl"
              >
                {name}
              </TabLink>
              {lineage && (
                <span className="mt-2 flex-none font-label font-semibold text-ink-soft text-xs uppercase leading-none tracking-[.12em]">
                  {lineage}
                </span>
              )}
            </div>
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
              <div className="mb-2 font-label font-semibold text-ink-faint text-sm leading-none tracking-[.04em]">
                {ownerUsername && `@${ownerUsername}`}
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
                <AccountLink
                  aria-current={onAccount ? "page" : undefined}
                  base={tabs}
                  className={cn(
                    MENU_ITEM,
                    onAccount ? "bg-ink px-4 text-white" : "text-ink"
                  )}
                  onClick={() => setMenuOpen(false)}
                />
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
