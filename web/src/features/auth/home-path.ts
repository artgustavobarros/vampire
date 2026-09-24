/** Para onde levar o usuário conforme sessão e ficha. */
export function homeTarget({
  criada,
  user,
}: {
  criada: boolean;
  user: string | null;
}): "/entrar" | "/criar" | "/ficha" {
  if (!user) {
    return "/entrar";
  }
  return criada ? "/ficha" : "/criar";
}
