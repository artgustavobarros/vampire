import { useId } from "react";
import { NativeSelect, SheetTextField } from "#/components/vtm/fields";
import { SelectableCard } from "#/components/vtm/selectable";
import { FieldLabel } from "#/components/vtm/text";
import { autoFit } from "#/components/vtm/trait-grid";
import { CLANS, findClan } from "#/data/clans";
import { GENERATIONS } from "#/data/generations";
import { patchSheet, useSheet } from "#/lib/store";
import { potencyFromGeneration, potencyNote } from "#/rules/generation";

export function Step1Clan() {
  const sheet = useSheet();
  const clan = findClan(sheet.cla);
  const genId = useId();
  return (
    <>
      <div className="grid gap-2" style={autoFit(152)}>
        {CLANS.map((c) => (
          <SelectableCard
            filled
            key={c.name}
            onClick={() => patchSheet({ cla: c.name })}
            selected={sheet.cla === c.name}
          >
            <span className="block font-label font-semibold text-xs leading-none tracking-[.02em]">
              {c.name}
            </span>
            <span className="mt-1 block text-base opacity-70">
              {c.disciplines.join(" · ")}
            </span>
          </SelectableCard>
        ))}
      </div>
      {clan && (
        <div className="mt-4 grid gap-3" style={autoFit(248)}>
          <ClanTrait
            label="Perdição do clã"
            text={clan.baneText}
            title={clan.bane}
          />
          <ClanTrait
            label="Compulsão do clã"
            text={clan.compulsionText}
            title={clan.compulsion}
          />
        </div>
      )}
      <div className="mt-6 border-line border-t pt-5">
        <div className="grid gap-x-5 gap-y-4" style={autoFit(220)}>
          <SheetTextField
            field={{ key: "senhor", label: "Senhor" }}
            labelClassName="mb-2"
          />
          <div>
            <FieldLabel htmlFor={genId}>Geração</FieldLabel>
            <NativeSelect
              id={genId}
              onChange={(e) =>
                patchSheet({
                  geracao: e.target.value,
                  potencia: potencyFromGeneration(e.target.value) || 0,
                })
              }
              value={sheet.geracao ?? ""}
            >
              <option value="">— escolher geração —</option>
              {GENERATIONS.map((g) => (
                <option key={g.label} value={g.label}>
                  {g.label}
                </option>
              ))}
            </NativeSelect>
            <div className="mt-2 text-sm opacity-70">{potencyNote(sheet)}</div>
          </div>
        </div>
      </div>
    </>
  );
}

function ClanTrait({
  label,
  title,
  text,
}: {
  label: string;
  title: string;
  text: string;
}) {
  return (
    <div className="border border-line border-l-2 border-l-blood p-3">
      <div className="font-label font-semibold text-ink-soft text-xs uppercase leading-none tracking-[.12em]">
        {label}
      </div>
      <div className="mt-2 font-semibold text-2xl leading-tight">{title}</div>
      <div className="mt-1 text-base opacity-70">{text}</div>
    </div>
  );
}
