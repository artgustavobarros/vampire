import type { AppState } from "#/lib/store";

/** Para onde levar o usuário conforme sessão e ficha. */
export function homeTarget(app: AppState): "/entrar" | "/criar" | "/ficha" {
  if (!app.user) {
    return "/entrar";
  }
  return app.sheet.criada ? "/ficha" : "/criar";
}
