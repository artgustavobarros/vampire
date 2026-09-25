import { DotRating } from "#/components/vtm/dot-rating";
import { InfoTrigger } from "#/components/vtm/info-trigger";
import { Panel } from "#/components/vtm/text";
import { autoFit } from "#/components/vtm/trait-grid";
import type { Merit } from "#/lib/types";
import { patchSheet, useSheet } from "#/stores/character-store";

const COLUMNS = [
  {
    empty: "Nenhuma vantagem.",
    label: "Vantagens",
    tipos: ["vantagem", "qualidade-sr"],
  },
  {
    empty: "Nenhum defeito.",
    label: "Defeitos",
    tipos: ["defeito", "defeito-sr"],
  },
] as const;

/** Vantagens e defeitos da ficha em duas colunas, com pontos editáveis. */
export function MeritsPanel() {
  const meritos = useSheet().meritos ?? [];
  const setPontos = (index: number, pontos: number) =>
    patchSheet({
      meritos: meritos.map((m, j) => (j === index ? { ...m, pontos } : m)),
    });

  return (
    <Panel className="mb-6">
      <h3 className="mt-0 mb-3 font-label font-semibold text-ink text-xs uppercase leading-none tracking-[.12em]">
        Vantagens &amp; Defeitos
      </h3>
      <div className="grid gap-6" style={autoFit(260)}>
        {COLUMNS.map((col) => {
          // guarda o índice original para gravar na linha certa
          const rows = meritos
            .map((m, index) => ({ index, m }))
            .filter(
              ({ m }) =>
                m.nome.trim() &&
                (col.tipos as readonly string[]).includes(m.tipo)
            );
          return (
            <div key={col.label}>
              <div className="mb-1 border-line border-b pb-2 font-label font-semibold text-ink-soft text-xs uppercase leading-none tracking-[.12em]">
                {col.label}
              </div>
              {rows.length ? (
                rows.map(({ m, index }) => (
                  <MeritRow
                    key={index}
                    merit={m}
                    onChange={(v) => setPontos(index, v)}
                  />
                ))
              ) : (
                <p className="m-0 py-2 text-ink-soft text-lg">{col.empty}</p>
              )}
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function MeritRow({
  merit,
  onChange,
}: {
  merit: Merit;
  onChange: (value: number) => void;
}) {
  const nome = merit.nome.trim();
  return (
    <div className="flex justify-between gap-1 border-line-soft border-b py-2">
      <span className="text-lg">
        <InfoTrigger
          target={{
            key: nome,
            kind: "merit",
            pontos: merit.pontos || 0,
            tipo: merit.tipo,
          }}
        >
          {nome}
        </InfoTrigger>
      </span>
      <DotRating label={nome} onChange={onChange} value={merit.pontos || 0} />
    </div>
  );
}
