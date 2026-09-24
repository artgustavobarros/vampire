import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import { BootScreen } from "#/features/auth/boot-screen";
import { useBoot } from "#/features/auth/use-boot";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
  component: RootComponent,
  head: () => ({
    links: [{ href: appCss, rel: "stylesheet" }],
    meta: [
      { charSet: "utf-8" },
      { content: "width=device-width, initial-scale=1", name: "viewport" },
      { title: "Ficha · Vampiro: A Máscara V5" },
      { content: "#EDEDEB", name: "theme-color" },
    ],
  }),
  shellComponent: RootDocument,
});

/** Tudo depende do localStorage: a abertura cobre a restauração da sessão no cliente. */
function RootComponent() {
  const booting = useBoot();
  return booting ? <BootScreen /> : <Outlet />;
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
