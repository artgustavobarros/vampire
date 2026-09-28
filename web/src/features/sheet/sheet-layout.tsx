import { Link, Outlet, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import {
  Sheet as Drawer,
  SheetContent as DrawerContent,
  SheetTitle as DrawerTitle,
} from "#/components/ui/sheet";
import { HungerAlert } from "#/features/actions/hunger-alert";
import { RuleDialogProvider } from "#/features/actions/rule-dialog";
import { logout } from "#/lib/auth";
import { cn } from "#/lib/utils";
import { useSheet } from "#/stores/character-store";
import { usePlayerStore } from "#/stores/player-store";
import { BottomBar } from "./bottom-bar";
import { isSheetTab, tabLabel, visibleTabs } from "./tabs";

const MENU_ITEM =
  "cursor-pointer flex min-h-12 items-center border-line-soft border-b font-label font-semibold text-xs uppercase leading-none tracking-widest";

export function SheetLayout() {
  const user = usePlayerStore((s) => s.user);
  const sheet = useSheet();
  const { aba } = useParams({ strict: false });
  const current = aba && isSheetTab(aba) ? aba : "ficha";
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const name = sheet.nome || "Sem nome";

  return (
    <RuleDialogProvider>
      <div className="min-h-screen pb-84 sm:pb-52">
        <div className="mx-auto max-w-[1000px] pb-5">
          <header className="flex items-center justify-between gap-3 border-line border-b px-4 py-2">
            <div className="flex min-w-0 items-baseline gap-2">
              <Link
                className="truncate font-semibold text-xl leading-tight focus-visible:outline-2 focus-visible:outline-ink"
                params={{ aba: "ficha" }}
                to="/ficha/$aba"
              >
                {name}
              </Link>
              <span className="whitespace-nowrap font-label font-semibold text-ink text-xs uppercase leading-none tracking-[.12em]">
                {tabLabel(current)}
              </span>
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
              <div className="mb-2 font-label font-semibold text-ink-faint text-xs uppercase leading-none tracking-[.12em]">
                {user}
              </div>
              <DrawerTitle className="mb-6 font-semibold font-serif text-2xl leading-tight">
                {name}
              </DrawerTitle>
              <nav className="flex flex-col">
                {visibleTabs.map((t) => (
                  <Link
                    aria-current={t.id === current ? "page" : undefined}
                    className={cn(
                      MENU_ITEM,
                      t.id === current ? "bg-ink px-4 text-white" : "text-ink"
                    )}
                    key={t.id}
                    onClick={() => setMenuOpen(false)}
                    params={{ aba: t.id }}
                    to="/ficha/$aba"
                  >
                    {t.label}
                  </Link>
                ))}
                <button
                  className={cn(MENU_ITEM, "text-left text-blood")}
                  onClick={async () => {
                    setMenuOpen(false);
                    await logout();
                    navigate({ to: "/entrar" });
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
