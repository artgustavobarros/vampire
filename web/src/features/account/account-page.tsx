import { type FormEvent, type ReactNode, useState } from "react";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { FieldLabel, Panel } from "#/components/vtm/text";
import {
  type AccountValues,
  accountDiff,
  validateAccountData,
  validateNewPassword,
} from "#/lib/account";
import {
  type AccountUpdate,
  ApiError,
  type ApiUser,
  updateMyAccount,
  updatePlayerAccount,
} from "#/lib/api";
import { apiError, notify } from "#/lib/toast";
import { useCharacterStore } from "#/stores/character-store";
import { usePlayerStore } from "#/stores/player-store";

/**
 * De quem é a conta: a do próprio jogador, a de um jogador aberta pelo Mestre
 * (sem a senha atual) ou a do próprio Mestre (só o nome).
 */
export type AccountMode =
  | { kind: "self" }
  | { kind: "player"; userId: string }
  | { kind: "dm-self" };

const SECTION_TITLE =
  "mt-0 mb-4 font-label font-semibold text-ink text-xs uppercase leading-none tracking-[.12em]";
const HINT = "mt-1 mb-0 text-base text-ink-soft";
const DM_FIELDS =
  "E-mail, usuário e senha do Mestre são definidos no servidor.";

/** Valores atuais da conta, de onde cada modo os guarda. */
function useAccountValues(mode: AccountMode): AccountValues {
  const email = usePlayerStore((s) => s.user) ?? "";
  const name = usePlayerStore((s) => s.name) ?? "";
  const username = usePlayerStore((s) => s.username) ?? "";
  const owner = useCharacterStore((s) => s.owner);
  if (mode.kind === "player") {
    return {
      email: owner?.email ?? "",
      name: owner?.name ?? "",
      username: owner?.username ?? "",
    };
  }
  return { email, name, username };
}

/** Grava na API e atualiza a sessão ou o dono da ficha com o usuário devolvido. */
async function save(mode: AccountMode, body: AccountUpdate): Promise<ApiUser> {
  if (mode.kind === "player") {
    const user = await updatePlayerAccount(mode.userId, body);
    useCharacterStore.getState().setOwnerAccount(user);
    return user;
  }
  const user = await updateMyAccount(body);
  usePlayerStore.getState().setAccount(user);
  if (mode.kind === "self") {
    // a ficha aberta é a do próprio jogador
    useCharacterStore.getState().setOwnerAccount(user);
  }
  return user;
}

/** 4xx é erro do formulário, com a mensagem pronta da API. */
function showError(err: unknown) {
  if (err instanceof ApiError && err.status < 500) {
    notify(err.message);
  } else {
    apiError(err);
  }
}

export function AccountPage({ mode }: { mode: AccountMode }) {
  const values = useAccountValues(mode);
  return (
    <div className="mx-auto flex w-full max-w-[560px] flex-col gap-6">
      <header>
        <h1 className="mt-0 mb-2 font-semibold text-3xl leading-tight">
          Conta
        </h1>
        <p className="m-0 font-label font-semibold text-ink-soft text-sm leading-none tracking-[.04em]">
          @{values.username}
        </p>
      </header>
      <DataForm mode={mode} values={values} />
      {mode.kind !== "dm-self" && <PasswordForm mode={mode} />}
    </div>
  );
}

function Field({
  children,
  htmlFor,
  label,
}: {
  children: ReactNode;
  htmlFor: string;
  label: string;
}) {
  return (
    <div>
      <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>
      {children}
    </div>
  );
}

/** Valor fixo da conta do Mestre, no lugar do campo. */
function ReadOnly({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mb-2 font-label font-semibold text-ink-soft text-xs uppercase leading-none tracking-[.12em]">
        {label}
      </div>
      <div className="break-all text-lg">{value}</div>
    </div>
  );
}

function DataForm({
  mode,
  values,
}: {
  mode: AccountMode;
  values: AccountValues;
}) {
  const [form, setForm] = useState(values);
  const [currentPassword, setCurrentPassword] = useState("");
  const [pending, setPending] = useState(false);
  const serverFields = mode.kind === "dm-self";
  const diff = accountDiff(values, form);
  const askCurrent = mode.kind === "self" && diff.email !== undefined;

  const edit =
    (key: keyof AccountValues) => (e: { target: { value: string } }) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (pending) {
      return;
    }
    const body: AccountUpdate = serverFields ? { name: diff.name } : diff;
    if (Object.values(body).every((v) => v === undefined)) {
      notify("Nada para salvar.", { tom: "info" });
      return;
    }
    const invalid = validateAccountData(
      body,
      askCurrent ? currentPassword : undefined
    );
    if (invalid) {
      notify(invalid);
      return;
    }
    setPending(true);
    try {
      const user = await save(
        mode,
        askCurrent ? { ...body, currentPassword } : body
      );
      setForm({ email: user.email, name: user.name, username: user.username });
      setCurrentPassword("");
      notify("Conta atualizada.", { tom: "ok" });
    } catch (err) {
      showError(err);
    } finally {
      setPending(false);
    }
  };

  return (
    <Panel>
      <form className="flex flex-col gap-4" noValidate onSubmit={submit}>
        <h2 className={SECTION_TITLE}>Dados</h2>
        <Field htmlFor="account-name" label="Nome">
          <Input
            autoComplete="name"
            id="account-name"
            onChange={edit("name")}
            value={form.name}
          />
        </Field>
        {serverFields ? (
          <>
            <ReadOnly label="Nome de usuário" value={`@${values.username}`} />
            <ReadOnly label="E-mail" value={values.email} />
            <p className={HINT}>{DM_FIELDS}</p>
          </>
        ) : (
          <>
            <Field htmlFor="account-username" label="Nome de usuário">
              <div className="flex">
                <span
                  aria-hidden="true"
                  className="flex items-center border border-line border-r-0 bg-surface px-3 text-ink-soft text-lg"
                >
                  @
                </span>
                <Input
                  autoCapitalize="none"
                  autoComplete="username"
                  autoCorrect="off"
                  id="account-username"
                  onChange={edit("username")}
                  spellCheck={false}
                  value={form.username}
                />
              </div>
            </Field>
            <Field htmlFor="account-email" label="E-mail">
              <Input
                autoComplete="email"
                id="account-email"
                onChange={edit("email")}
                type="email"
                value={form.email}
              />
            </Field>
            {askCurrent ? (
              <Field htmlFor="account-email-password" label="Senha atual">
                <Input
                  autoComplete="current-password"
                  id="account-email-password"
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  type="password"
                  value={currentPassword}
                />
                <p className={HINT}>Para mudar o e-mail, confirme sua senha.</p>
              </Field>
            ) : null}
          </>
        )}
        <Button className="self-start" disabled={pending} type="submit">
          {pending ? "Salvando…" : "Salvar dados"}
        </Button>
      </form>
    </Panel>
  );
}

function PasswordForm({ mode }: { mode: AccountMode }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [pending, setPending] = useState(false);
  const self = mode.kind === "self";

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (pending) {
      return;
    }
    const invalid = validateNewPassword({
      currentPassword: self ? currentPassword : undefined,
      password,
      password2,
    });
    if (invalid) {
      notify(invalid);
      return;
    }
    setPending(true);
    try {
      await save(mode, self ? { currentPassword, password } : { password });
      setCurrentPassword("");
      setPassword("");
      setPassword2("");
      notify("Senha alterada.", { tom: "ok" });
    } catch (err) {
      showError(err);
    } finally {
      setPending(false);
    }
  };

  return (
    <Panel>
      <form className="flex flex-col gap-4" noValidate onSubmit={submit}>
        <h2 className={SECTION_TITLE}>Senha</h2>
        {self ? (
          <Field htmlFor="account-current-password" label="Senha atual">
            <Input
              autoComplete="current-password"
              id="account-current-password"
              onChange={(e) => setCurrentPassword(e.target.value)}
              type="password"
              value={currentPassword}
            />
          </Field>
        ) : (
          <p className="m-0 text-base text-ink-soft">
            Como Mestre, você define a nova senha sem precisar da atual.
          </p>
        )}
        <Field htmlFor="account-password" label="Nova senha">
          <Input
            autoComplete="new-password"
            id="account-password"
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            value={password}
          />
        </Field>
        <Field htmlFor="account-password2" label="Confirmar nova senha">
          <Input
            autoComplete="new-password"
            id="account-password2"
            onChange={(e) => setPassword2(e.target.value)}
            type="password"
            value={password2}
          />
        </Field>
        <Button className="self-start" disabled={pending} type="submit">
          {pending ? "Salvando…" : "Trocar senha"}
        </Button>
      </form>
    </Panel>
  );
}
