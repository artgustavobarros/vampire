import { Link, Outlet, useNavigate } from "@tanstack/react-router";
import { Button } from "#/components/ui/button";
import { logout } from "#/lib/auth";
import { usePlayerStore } from "#/stores/player-store";

const TAB =
  "-mb-px flex min-h-11 flex-none items-center whitespace-nowrap border-transparent border-b-2 font-label font-semibold text-ink-soft text-xs uppercase leading-none tracking-[.12em] transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-ink data-[status=active]:border-blood data-[status=active]:text-ink";

const TABS = [
  { label: "Coteries", to: "/personagens/coteries" },
  { label: "Ações", to: "/personagens/acoes" },
  { label: "Rodada", to: "/personagens/rodada" },
  { label: "Bestiário", to: "/personagens/bestiario" },
] as const;

/** Painel do Mestre: cabeçalho e as abas da mesa. */
export function DmShell() {
  const name = usePlayerStore((s) => s.name);
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-[1440px] pb-10">
      <header className="flex items-center justify-between gap-3 border-line border-b px-4 py-2">
        <div className="flex min-w-0 items-baseline gap-2">
          <span className="truncate font-semibold text-xl leading-tight">
            {name}
          </span>
          <span className="whitespace-nowrap font-label font-semibold text-blood text-xs uppercase leading-none tracking-[.12em]">
            Mestre
          </span>
        </div>
        <Button
          onClick={async () => {
            await logout();
            navigate({ to: "/entrar" });
          }}
          variant="outline"
        >
          Sair da conta
        </Button>
      </header>
      <nav className="flex gap-6 overflow-x-auto border-line border-b px-4">
        <Link activeOptions={{ exact: true }} className={TAB} to="/personagens">
          Lista de personagens
        </Link>
        {TABS.map((tab) => (
          <Link className={TAB} key={tab.to} to={tab.to}>
            {tab.label}
          </Link>
        ))}
      </nav>
      <main className="px-4 py-5">
        <Outlet />
      </main>
    </div>
  );
}
