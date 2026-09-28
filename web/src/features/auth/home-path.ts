import type { Role } from "#/lib/api";

/** Para onde levar o usuário conforme sessão, papel e ficha. */
export function homeTarget({
  criada,
  role,
  user,
}: {
  criada: boolean;
  role: Role | null;
  user: string | null;
}): "/entrar" | "/criar" | "/ficha" | "/personagens" {
  if (!user) {
    return "/entrar";
  }
  if (role === "dm") {
    return "/personagens";
  }
  return criada ? "/ficha" : "/criar";
}
