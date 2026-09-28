import { Link } from "@tanstack/react-router";
import { Button } from "#/components/ui/button";
import type { ApiUser } from "#/lib/api";
import { cn } from "#/lib/utils";
import type { CharacterSummary, TrackSummary } from "./summary";

const LABEL =
  "font-label font-semibold text-xs uppercase leading-none tracking-[.12em]";
const VALUE = "mt-1 font-bold font-label text-2xl leading-tight";

const fraction = ({ atual, max }: TrackSummary) => `${atual}/${max}`;

/** Um jogador na Lista de personagens do Mestre. */
export function CharacterCard({
  summary,
  user,
}: {
  summary: CharacterSummary | null;
  user: ApiUser;
}) {
  return (
    <article className="flex flex-col gap-4 border border-line border-t-4 border-t-blood bg-surface p-4">
      <div>
        <h2 className="m-0 font-semibold text-2xl leading-tight">
          {summary ? summary.nome : user.name}
        </h2>
        {summary?.cla ? (
          <div className="mt-1 text-ink-soft text-lg">{summary.cla}</div>
        ) : null}
        <div className="mt-1 break-all font-label font-semibold text-ink text-xs">
          {user.email}
        </div>
      </div>
      {summary ? (
        <>
          <dl className="m-0 grid grid-cols-3 gap-3">
            <Stat label="Fome" tone="blood" value={String(summary.fome)} />
            <Stat label="Vitalidade" value={fraction(summary.vit)} />
            <Stat label="Vontade" value={fraction(summary.fdv)} />
          </dl>
          <Button asChild className="w-full" variant="destructive">
            <Link
              params={{ aba: "caracteristicas", id: user.id }}
              to="/personagens/$id/$aba"
            >
              Ver ficha
            </Link>
          </Button>
        </>
      ) : (
        <p className="m-0 text-ink-soft text-lg italic">Ainda sem personagem</p>
      )}
    </article>
  );
}

function Stat({
  label,
  tone = "ink",
  value,
}: {
  label: string;
  tone?: "blood" | "ink";
  value: string;
}) {
  return (
    <div>
      <dt
        className={cn(LABEL, tone === "blood" ? "text-blood" : "text-ink-soft")}
      >
        {label}
      </dt>
      <dd
        className={cn(
          VALUE,
          "m-0",
          tone === "blood" ? "text-blood" : "text-ink"
        )}
      >
        {value}
      </dd>
    </div>
  );
}
