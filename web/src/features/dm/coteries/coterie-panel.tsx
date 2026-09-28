import { Link } from "@tanstack/react-router";
import { useId, useState } from "react";
import { Button } from "#/components/ui/button";
import { ConfirmDialog } from "#/components/vtm/confirm-dialog";
import { useDebouncedSave } from "#/hooks/use-debounced-save";
import {
  addCoterieMember,
  type CoterieResponse,
  deleteCoterie,
  type PlayerSheetResponse,
  removeCoterieMember,
  renameCoterie,
} from "#/lib/api";
import { apiError } from "#/lib/toast";
import { CharacterStatusCard, STAT_LABEL } from "../status-card";
import { summarize } from "../summary";

const TEXT_BUTTON =
  "cursor-pointer font-label font-semibold text-blood text-xs uppercase leading-none tracking-[.12em] hover:underline focus-visible:outline-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-40";

const membersLabel = (n: number) => `${n} ${n === 1 ? "membro" : "membros"}`;

interface CoteriePanelProps {
  autoFocus: boolean;
  coterie: CoterieResponse;
  /** jogadores com personagem que não estão em nenhuma coterie */
  free: PlayerSheetResponse[];
  onChange: (coterie: CoterieResponse) => void;
  onDelete: () => void;
}

/** Uma coterie: nome, membros, colocar, retirar e excluir. */
export function CoteriePanel({
  autoFocus,
  coterie,
  free,
  onChange,
  onDelete,
}: CoteriePanelProps) {
  const [nome, setNome] = useState(coterie.nome);
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const selectId = useId();
  const label = nome.trim() || "Coterie sem nome";
  const rename = useDebouncedSave((value: string, options) =>
    renameCoterie(coterie.id, value, options)
  );

  const run = async (action: () => Promise<CoterieResponse | undefined>) => {
    setBusy(true);
    try {
      const next = await action();
      if (next) {
        onChange(next);
      }
    } catch (err) {
      apiError(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section
      aria-label={label}
      className="flex flex-col gap-4 border border-line border-t-4 border-t-blood bg-surface p-4"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          aria-label="Nome da coterie"
          autoFocus={autoFocus}
          className="min-h-14 w-full min-w-0 flex-1 border border-line bg-white px-3 font-serif text-2xl text-ink outline-none placeholder:text-ink-ghost focus:border-line-focus"
          maxLength={80}
          onBlur={() => rename.flush()}
          onChange={(e) => {
            setNome(e.target.value);
            rename.schedule(e.target.value);
          }}
          placeholder="Nome da coterie"
          value={nome}
        />
        <div className="flex flex-none items-center gap-5">
          <span className={`${STAT_LABEL} text-ink-soft`}>
            {membersLabel(coterie.membros.length)}
          </span>
          <button
            className={TEXT_BUTTON}
            disabled={busy}
            onClick={() => setConfirming(true)}
            type="button"
          >
            Excluir coterie
          </button>
        </div>
      </div>

      {coterie.membros.length === 0 ? (
        <p className="m-0 text-ink-soft text-lg italic">Sem membros ainda.</p>
      ) : (
        <ul className="m-0 grid list-none gap-3 p-0 md:grid-cols-2">
          {coterie.membros.map(({ sheet, user }) => (
            <li key={user.id}>
              <CharacterStatusCard
                footer={
                  <>
                    <Button asChild size="sm" variant="outline">
                      <Link
                        params={{ aba: "caracteristicas", id: user.id }}
                        to="/personagens/$id/$aba"
                      >
                        Ver ficha
                      </Link>
                    </Button>
                    <button
                      className={TEXT_BUTTON}
                      disabled={busy}
                      onClick={() =>
                        run(() => removeCoterieMember(coterie.id, user.id))
                      }
                      type="button"
                    >
                      Retirar
                    </button>
                  </>
                }
                sheet={sheet}
              />
            </li>
          ))}
        </ul>
      )}

      <label className="sr-only" htmlFor={selectId}>
        Colocar personagem em {label}
      </label>
      <select
        className="min-h-12 w-full max-w-sm cursor-pointer border border-line bg-white px-3 font-serif text-ink text-lg disabled:cursor-not-allowed disabled:opacity-45"
        disabled={busy || free.length === 0}
        id={selectId}
        onChange={(e) => {
          const userId = e.target.value;
          if (userId) {
            run(() => addCoterieMember(coterie.id, userId));
          }
        }}
        value=""
      >
        <option value="">+ Colocar personagem…</option>
        {free.map((p) => (
          <option key={p.user.id} value={p.user.id}>
            {summarize(p.sheet)?.nome ?? p.user.name}
          </option>
        ))}
      </select>

      <ConfirmDialog
        confirm="Excluir"
        onCancel={() => setConfirming(false)}
        onConfirm={async () => {
          setConfirming(false);
          setBusy(true);
          try {
            await deleteCoterie(coterie.id);
            onDelete();
          } catch (err) {
            apiError(err);
            setBusy(false);
          }
        }}
        open={confirming}
        text={`Excluir a coterie ${nome.trim() || "sem nome"}? Os membros ficam sem coterie.`}
      />
    </section>
  );
}
