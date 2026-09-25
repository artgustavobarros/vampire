import { useId, useState } from "react";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { notify } from "#/lib/toast";
import { confirmPredatorSpecialty } from "#/rules/specialties";
import { patchSheet, useCharacterStore } from "#/stores/character-store";

interface SpecialtyRenameProps {
  /** nome atual da especialidade do Predador */
  nome: string;
  onDone: () => void;
}

/** Renomear ou manter, uma única vez, a especialidade que veio do Predador. */
export function SpecialtyRename({ nome, onDone }: SpecialtyRenameProps) {
  const id = useId();
  const [value, setValue] = useState(nome);

  const confirm = (text: string) => {
    const done = confirmPredatorSpecialty(
      useCharacterStore.getState().sheet,
      text
    );
    if (!done) {
      return;
    }
    patchSheet(done.patch);
    onDone();
    notify(`Especialidade ${done.nome} fixada em ${done.skill}.`, {
      titulo: "Especialidade",
      tom: "ok",
    });
  };

  return (
    <form
      className="mt-6 border-line border-t pt-6"
      onSubmit={(e) => {
        e.preventDefault();
        confirm(value);
      }}
    >
      <label
        className="mb-2 block font-label font-semibold text-ink-soft text-xs uppercase leading-none tracking-[.12em]"
        htmlFor={id}
      >
        Nome da especialidade
      </label>
      <Input id={id} onChange={(e) => setValue(e.target.value)} value={value} />
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button disabled={!value.trim()} type="submit">
          Confirmar nome
        </Button>
        <Button onClick={() => confirm(nome)} type="button" variant="outline">
          Manter atual
        </Button>
      </div>
    </form>
  );
}
