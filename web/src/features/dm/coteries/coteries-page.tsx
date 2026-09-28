import { useState } from "react";
import { Button } from "#/components/ui/button";
import { useApiLoad } from "#/hooks/use-api-load";
import {
  type CoterieResponse,
  createCoterie,
  listCoteries,
  listSheets,
  type PlayerSheetResponse,
} from "#/lib/api";
import { apiError } from "#/lib/toast";
import { summarize } from "../summary";
import { CoteriePanel } from "./coterie-panel";

interface Data {
  coteries: CoterieResponse[];
  players: PlayerSheetResponse[];
}

const load = async (): Promise<Data> => {
  const [coteries, players] = await Promise.all([listCoteries(), listSheets()]);
  return { coteries, players };
};

/** Aba Coteries do Mestre: criar, renomear, excluir e montar os membros. */
export function CoteriesPage() {
  const [data, setData] = useApiLoad(load);
  const [created, setCreated] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const replace = (next: CoterieResponse) =>
    setData(
      (d) =>
        d && {
          ...d,
          coteries: d.coteries.map((c) => (c.id === next.id ? next : c)),
        }
    );

  const taken = new Set(
    data?.coteries.flatMap((c) => c.membros.map((m) => m.user.id))
  );
  // só quem já criou o personagem e não está em nenhuma coterie
  const free =
    data?.players.filter(
      (p) => summarize(p.sheet) !== null && !taken.has(p.user.id)
    ) ?? [];

  return (
    <>
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <p className="m-0 max-w-[60ch] text-ink-soft text-lg">
          Monte as coteries da crônica. Cada jogador vê, na aba Coterie da
          própria ficha, os membros da coterie em que você o colocou.
        </p>
        <Button
          className="self-start"
          disabled={busy || data === null}
          onClick={async () => {
            setBusy(true);
            try {
              const coterie = await createCoterie();
              setCreated(coterie.id);
              setData((d) => d && { ...d, coteries: [...d.coteries, coterie] });
            } catch (err) {
              apiError(err);
            } finally {
              setBusy(false);
            }
          }}
        >
          + Nova coterie
        </Button>
      </div>
      {data === null && (
        <p
          aria-busy="true"
          className="text-ink-soft text-lg italic"
          role="status"
        >
          Carregando coteries…
        </p>
      )}
      {data?.coteries.length === 0 && (
        <p className="text-ink-soft text-lg italic">Nenhuma coterie ainda.</p>
      )}
      {data && data.coteries.length > 0 && (
        <ul className="m-0 flex list-none flex-col gap-5 p-0">
          {data.coteries.map((coterie) => (
            <li key={coterie.id}>
              <CoteriePanel
                autoFocus={coterie.id === created}
                coterie={coterie}
                free={free}
                onChange={replace}
                onDelete={() =>
                  setData(
                    (d) =>
                      d && {
                        ...d,
                        coteries: d.coteries.filter((c) => c.id !== coterie.id),
                      }
                  )
                }
              />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
