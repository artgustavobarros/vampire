import { useState } from "react";
import { Button } from "#/components/ui/button";
import { INTENSITIES, MOODS } from "#/data/resonance";
import {
  type Die,
  RANDOM,
  type ResonanceChoice,
  type ResonanceRoll,
  rollDie,
  rollResonance,
} from "#/rules/resonance";
import { CompulsionRoll } from "./compulsion-roll";
import { NpcGenerator } from "./npc-generator";
import { ChipGroup, ResonanceResult } from "./resonance-parts";

const LABEL =
  "font-label font-semibold text-xs uppercase leading-none tracking-[.12em]";

/**
 * Aba Ações do Mestre: Rolagem de Ressonância, Rolagem de Compulsão e Gerador
 * de NPC. `d` só é trocado nos testes.
 */
export function ResonanceRollTab({ d = rollDie }: { d?: Die }) {
  const [escolha, setEscolha] = useState<ResonanceChoice>({
    intensidade: RANDOM,
    sangueFraco: false,
    tipo: RANDOM,
  });
  const [roll, setRoll] = useState<ResonanceRoll | null>(null);
  const soDiscrasia =
    escolha.tipo !== RANDOM && escolha.intensidade === "Aguçada";

  return (
    <>
      <div className="grid items-start gap-4 md:grid-cols-2">
        <section
          aria-labelledby="rolagem-ressonancia"
          className="flex flex-col gap-4 border border-line bg-surface p-4"
        >
          <div>
            <h2 className={`${LABEL} m-0 text-blood`} id="rolagem-ressonancia">
              Rolagem de Ressonância
            </h2>
            <p className="mt-2 mb-0 text-ink-soft text-lg">
              Deixe em Aleatória o que quer sortear. Fixe a ressonância ou a
              intensidade para rolar só o resto.
            </p>
          </div>
          <ChipGroup
            label="Ressonância"
            onChange={(tipo) => setEscolha((e) => ({ ...e, tipo }))}
            options={[RANDOM, ...MOODS]}
            value={escolha.tipo}
          />
          <ChipGroup
            label="Intensidade"
            onChange={(intensidade) =>
              setEscolha((e) => ({ ...e, intensidade }))
            }
            options={[RANDOM, ...INTENSITIES]}
            value={escolha.intensidade}
          />
          <ChipGroup
            label="Sangue-fraco"
            onChange={(v) =>
              setEscolha((e) => ({ ...e, sangueFraco: v === "Sim" }))
            }
            options={["Não", "Sim"]}
            value={escolha.sangueFraco ? "Sim" : "Não"}
          />
          <Button
            className="w-full"
            onClick={() => setRoll(rollResonance(escolha, d))}
            variant="destructive"
          >
            {soDiscrasia ? "Rolar discrasia" : "Rolar ressonância"}
          </Button>
          <p className="m-0 text-ink-faint">
            Intensidade em d10: 1–5 negligenciável, 6–8 difusa, 9–10 rola de
            novo (9–10 aguçada, senão intensa). Ressonância em d10: 1–3
            fleumática, 4–6 melancólica, 7–8 colérica, 9–10 sanguínea.
          </p>
        </section>

        <div className="flex flex-col gap-2">
          {roll ? (
            <button
              className={`${LABEL} cursor-pointer self-end py-1 text-blood hover:text-blood-hover focus-visible:outline-2 focus-visible:outline-ink`}
              onClick={() => setRoll(null)}
              type="button"
            >
              Limpar
            </button>
          ) : null}
          <ResonanceResult roll={roll} />
        </div>
      </div>
      <CompulsionRoll d={d} />
      <NpcGenerator d={d} />
    </>
  );
}
