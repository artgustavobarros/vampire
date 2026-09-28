import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Toaster } from "#/components/ui/sonner";
import { BootScreen } from "#/features/auth/boot-screen";
import { useBoot } from "#/features/auth/use-boot";
import { InfoProvider } from "#/features/info/info-sheet";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
  component: RootComponent,
  head: () => ({
    links: [
      { href: appCss, rel: "stylesheet" },
      { href: "/favicon.ico", rel: "icon" },
    ],
    meta: [
      { charSet: "utf-8" },
      { content: "width=device-width, initial-scale=1", name: "viewport" },
      { title: "Ficha · Vampiro: A Máscara V5" },
      { content: "#EDEDEB", name: "theme-color" },
    ],
  }),
  shellComponent: RootDocument,
});

/** A abertura cobre a restauração da sessão pela API, no cliente. */
function RootComponent() {
  const booting = useBoot();
  return (
    <InfoProvider>
      {booting ? <BootScreen /> : <Outlet />}
      <AppToaster />
    </InfoProvider>
  );
}

/** ficha do jogador ou ficha aberta pelo Mestre (não a lista) */
const SHEET_PATH = /^\/(ficha|personagens\/[^/]+)(\/|$)/;

/** Na ficha os avisos sobem acima da barra inferior preta. */
function AppToaster() {
  const onSheet = useRouterState({
    select: (s) => SHEET_PATH.test(s.location.pathname),
  });
  return <Toaster bottom={onSheet ? 96 : 16} />;
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html className="min-h-full" lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-full overflow-x-hidden bg-paper font-serif text-ink antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}
