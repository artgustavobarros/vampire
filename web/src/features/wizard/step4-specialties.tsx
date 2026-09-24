import { useId } from "react";
import { Input } from "#/components/ui/input";
import { NativeSelect } from "#/components/vtm/fields";
import { FieldLabel } from "#/components/vtm/text";
import { autoFit } from "#/components/vtm/trait-grid";
import { REQUIRED_SPECIALTY_SKILLS, SKILLS } from "#/data/traits";
import { patchSheet, useSheet } from "#/lib/store";
import type { Sheet } from "#/lib/types";

/** Grava a especialidade principal (posição 0) da habilidade. */
function setPrimary(sheet: Sheet, skill: string | undefined, text: string) {
  if (!skill) {
    return;
  }
  const espec = sheet.espec ?? {};
  const cur = (espec[skill] ?? []).slice();
  cur[0] = text;
  patchSheet({
    espec: { ...espec, [skill]: cur.filter((v, i) => i === 0 || v) },
  });
}

export function Step4Specialties() {
  const sheet = useSheet();
  const skillId = useId();
  const specId = useId();
  const required = REQUIRED_SPECIALTY_SKILLS.filter(
    (k) => (sheet.skills[k] || 0) > 0
  );
  const withDots = SKILLS.filter((k) => (sheet.skills[k] || 0) > 0);

  if (required.length) {
    return (
      <>
        {required.map((name) => (
          <div className="border-line-soft border-b py-3" key={name}>
            <FieldLabel className="mb-0" htmlFor={`${specId}-${name}`}>
              {name} · nível {sheet.skills[name]}
            </FieldLabel>
            <Input
              className="mt-2"
              id={`${specId}-${name}`}
              onChange={(e) => setPrimary(sheet, name, e.target.value)}
              placeholder="Qual especialidade?"
              value={sheet.espec?.[name]?.[0] ?? ""}
            />
          </div>
        ))}
      </>
    );
  }

  return (
    <div className="grid gap-x-5 gap-y-4" style={autoFit(220)}>
      <div>
        <FieldLabel htmlFor={skillId}>Perícia</FieldLabel>
        <NativeSelect
          id={skillId}
          onChange={(e) => patchSheet({ especLivre: e.target.value })}
          value={sheet.especLivre ?? ""}
        >
          <option value="">— escolher perícia —</option>
          {withDots.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </NativeSelect>
      </div>
      <div>
        <FieldLabel htmlFor={specId}>Especialidade</FieldLabel>
        <Input
          id={specId}
          onChange={(e) => setPrimary(sheet, sheet.especLivre, e.target.value)}
          placeholder="ex. Interrogatório"
          value={
            (sheet.especLivre && sheet.espec?.[sheet.especLivre]?.[0]) || ""
          }
        />
      </div>
    </div>
  );
}
