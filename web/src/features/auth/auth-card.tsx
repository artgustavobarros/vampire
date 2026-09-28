import { useNavigate } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { FieldLabel, Kicker } from "#/components/vtm/text";
import { authenticate } from "#/lib/auth";
import { useCharacterStore } from "#/stores/character-store";
import { usePlayerStore } from "#/stores/player-store";
import { homeTarget } from "./home-path";

function submitLabel(signup: boolean, pending: boolean): string {
  if (pending) {
    return signup ? "Criando…" : "Entrando…";
  }
  return signup ? "Criar conta" : "Entrar";
}

export function AuthCard({ mode }: { mode: "login" | "signup" }) {
  const navigate = useNavigate();
  const signup = mode === "signup";
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [pending, setPending] = useState(false);

  const edit =
    (set: (v: string) => void) => (e: { target: { value: string } }) =>
      set(e.target.value);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (pending) {
      return;
    }
    setPending(true);
    const ok = await authenticate({
      email,
      identifier,
      mode,
      name,
      password,
      password2,
      username,
    });
    setPending(false);
    if (!ok) {
      return;
    }
    setPassword("");
    const { role, user } = usePlayerStore.getState();
    const target = homeTarget({
      criada: useCharacterStore.getState().sheet.criada,
      role,
      user,
    });
    navigate({
      search: target === "/criar" ? { passo: 1 } : undefined,
      to: target,
    });
  };

  const toggleMode = () => {
    setPassword("");
    setPassword2("");
    navigate({ search: signup ? {} : { modo: "cadastro" }, to: "/entrar" });
  };

  return (
    <div className="grid min-h-screen place-items-center px-4 py-8">
      <form
        className="w-full max-w-105 border border-line bg-surface px-6 py-8"
        noValidate
        onSubmit={submit}
      >
        <div className="mb-6 border-line border-b pb-4">
          <Kicker>Vampiro · A Máscara</Kicker>
          <h1 className="mt-3 mb-2 font-semibold text-[32px] leading-[1.2]">
            {signup ? "Criar conta" : "Entrar"}
          </h1>
          <p className="m-0 text-ink-soft text-lg">
            {signup
              ? "Abraçe um novo personagem"
              : "Seu não-vivo está pronto para despertar?"}
          </p>
        </div>

        {signup ? (
          <>
            <FieldLabel htmlFor="auth-name">Nome</FieldLabel>
            <Input
              autoComplete="name"
              className="mb-4"
              id="auth-name"
              onChange={edit(setName)}
              placeholder="Nome completo"
              value={name}
            />
            <FieldLabel htmlFor="auth-username">Nome de usuário</FieldLabel>
            <Input
              autoCapitalize="none"
              autoComplete="username"
              autoCorrect="off"
              className="mb-4"
              id="auth-username"
              onChange={edit(setUsername)}
              placeholder="vitoria_salles"
              spellCheck={false}
              value={username}
            />
            <FieldLabel htmlFor="auth-email">E-mail</FieldLabel>
            <Input
              autoComplete="email"
              className="mb-4"
              id="auth-email"
              onChange={edit(setEmail)}
              placeholder="voce@exemplo.com"
              type="email"
              value={email}
            />
          </>
        ) : (
          <>
            <FieldLabel htmlFor="auth-identifier">E-mail ou usuário</FieldLabel>
            <Input
              autoCapitalize="none"
              autoComplete="username"
              autoCorrect="off"
              className="mb-4"
              id="auth-identifier"
              onChange={edit(setIdentifier)}
              placeholder="E-mail ou nome de usuário"
              spellCheck={false}
              value={identifier}
            />
          </>
        )}
        <FieldLabel htmlFor="auth-pass">Senha</FieldLabel>
        <Input
          autoComplete={signup ? "new-password" : "current-password"}
          className="mb-2"
          id="auth-pass"
          onChange={edit(setPassword)}
          placeholder="••••••"
          type="password"
          value={password}
        />
        {signup && (
          <>
            <FieldLabel className="mt-4" htmlFor="auth-pass2">
              Confirmar senha
            </FieldLabel>
            <Input
              autoComplete="new-password"
              className="mb-2"
              id="auth-pass2"
              onChange={edit(setPassword2)}
              placeholder="••••••"
              type="password"
              value={password2}
            />
          </>
        )}
        <div className="mt-6 flex flex-col gap-3">
          <Button className="w-full" disabled={pending} type="submit">
            {submitLabel(signup, pending)}
          </Button>
          <Button
            className="w-full"
            onClick={toggleMode}
            type="button"
            variant="outline"
          >
            {signup ? "Já tenho conta" : "Criar conta"}
          </Button>
        </div>
      </form>
    </div>
  );
}
