import { useState } from "react";
import { Button } from "#/components/ui/button";
import { CLANS } from "#/data/clans";
import { COMPULSION_DURATION, COMPULSIONS } from "#/data/compulsions";
import {
  compulsionDiceLine,
  type CompulsionRoll as Roll,
  rollCompulsion,
} from "#/rules/compulsion";
import type { Die } from "#/rules/resonance";
import { ChipGroup } from "./resonance-parts";

const LABEL =
  "font-label font-semibold text-xs uppercase leading-none tracking-[.12em]";

const NAO_INFORMADO = "Não informado";

/** Rolagem de Compulsão da aba Ações: d10 da falha bestial. */
export function CompulsionRoll({ d }: { d: Die }) {
  const [clan, setClan] = useState(NAO_INFORMADO);
  const [roll, setRoll] = useState<Roll | null>(null);

  return (
    <div className="mt-4 grid items-start gap-4 md:grid-cols-2">
      <section
        aria-labelledby="rolagem-compulsao"
        className="flex flex-col gap-4 border border-line bg-surface p-4"
      >
        <div>
          <h2 className={`${LABEL} m-0 text-blood`} id="rolagem-compulsao">
            Rolagem de Compulsão
          </h2>
          <p className="mt-2 mb-0 text-ink-soft text-lg">
            Numa falha bestial, marque o clã do vampiro e role a compulsão.
          </p>
        </div>
        <ChipGroup
          label="Clã"
          onChange={setClan}
          options={[NAO_INFORMADO, ...CLANS.map((c) => c.name)]}
          value={clan}
        />
        <Button
          className="w-full"
          onClick={() =>
            setRoll(rollCompulsion(clan === NAO_INFORMADO ? null : clan, d))
          }
          variant="destructive"
        >
          Rolar compulsão
        </Button>
        <p className="m-0 text-ink-faint">
          Compulsão em d10: 1–3 fome, 4–5 dominância, 6–7 dano, 8–9 paranoia, 10
          compulsão do clã (Caitiff e Sangue-ralo rolam de novo).
        </p>
      </section>

      <div className="flex flex-col gap-2">
        {roll ? (
          <button
            aria-label="Limpar compulsão"
            className={`${LABEL} cursor-pointer self-end py-1 text-blood hover:text-blood-hover focus-visible:outline-2 focus-visible:outline-ink`}
            onClick={() => setRoll(null)}
            type="button"
          >
            Limpar
          </button>
        ) : null}
        <section
          aria-label="Resultado da compulsão"
          aria-live="polite"
          className="border-blood border-t-4 bg-ink p-5 text-white"
        >
          {roll ? (
            <CompulsionDetails roll={roll} />
          ) : (
            <p className="m-0 text-lg text-white/70 italic">
              O resultado da compulsão aparece aqui.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

function describe(roll: Roll): { nome: string; rotulo: string; texto: string } {
  if (roll.tipo !== "Clã") {
    return {
      nome: roll.tipo,
      rotulo: "Compulsão",
      texto: COMPULSIONS[roll.tipo],
    };
  }
  if (roll.clan) {
    return {
      nome: roll.clan.compulsion,
      rotulo: `Compulsão de Clã · ${roll.clan.name}`,
      texto: roll.clan.compulsionText,
    };
  }
  return {
    nome: "Compulsão de Clã",
    rotulo: "Compulsão de Clã",
    texto: "Use a compulsão do clã do personagem.",
  };
}

function CompulsionDetails({ roll }: { roll: Roll }) {
  const { nome, rotulo, texto } = describe(roll);
  return (
    <>
      <div className={`${LABEL} text-ember`}>{rotulo}</div>
      <div className="mt-2 font-semibold text-5xl leading-tight">{nome}</div>
      <p className="mt-3 mb-0 text-lg">{texto}</p>
      <p className="mt-2 mb-0 text-lg text-white/80 italic">
        {COMPULSION_DURATION}
      </p>
      <p className="mt-4 mb-0 font-label font-semibold text-white/60 text-xs">
        {compulsionDiceLine(roll)}
      </p>
    </>
  );
}
