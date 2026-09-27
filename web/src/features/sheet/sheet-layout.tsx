import { Link, Outlet, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import {
  Sheet as Drawer,
  SheetContent as DrawerContent,
  SheetTitle as DrawerTitle,
} from "#/components/ui/sheet";
import { HungerAlert } from "#/features/actions/hunger-alert";
import {
  RuleDialogProvider,
  useRuleDialog,
} from "#/features/actions/rule-dialog";
import { logout } from "#/lib/auth";
import { cn } from "#/lib/utils";
import { useSheet } from "#/stores/character-store";
import { usePlayerStore } from "#/stores/player-store";
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
      <div className="min-h-screen pb-24">
        <div className="mx-auto max-w-[1000px] pb-5">
          <header className="flex items-center justify-between gap-3 border-line border-b px-4 py-2">
            <div className="flex min-w-0 items-baseline gap-2">
              <span className="truncate font-semibold text-xl leading-tight">
                {name}
              </span>
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
                  className={cn(MENU_ITEM, "text-left text-ink")}
                  onClick={() => {
                    setMenuOpen(false);
                    navigate({
                      search: { passo: 1, refazer: true },
                      to: "/criar",
                    });
                  }}
                  type="button"
                >
                  Refazer personagem
                </button>
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

function BottomBar() {
  const sheet = useSheet();
  const dialog = useRuleDialog();
  const btn =
    "cursor-pointer flex min-h-12 flex-1 items-center justify-center px-3 py-4 font-label font-semibold text-white text-xs uppercase leading-none tracking-widest hover:opacity-85 focus-visible:outline-2 focus-visible:outline-white";
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-blood border-t-4 bg-ink px-4 py-3">
      <button
        className={cn(btn, "bg-blood")}
        onClick={() => dialog.open("rouse")}
        type="button"
      >
        Rouse Check
      </button>
      <div aria-live="polite" className="flex-none px-1 text-center">
        <div className="font-label font-semibold text-white/60 text-xs uppercase leading-none tracking-[.12em]">
          Fome
        </div>
        <div className="mt-1 font-bold font-label text-2xl text-ember leading-tight">
          {sheet.fome || 0}
        </div>
      </div>
      <button
        className={cn(btn, "border border-white/35 bg-transparent")}
        onClick={() => dialog.open("sleep")}
        type="button"
      >
        Dormir
      </button>
    </div>
  );
}
