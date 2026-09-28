import { useState } from "react";
import { Button } from "#/components/ui/button";
import { Chip } from "#/components/vtm/selectable";
import {
  INTENSITIES,
  INTENSITY_EFFECTS,
  MOODS,
  RESONANCE_MOODS,
} from "#/data/resonance";
import {
  type Die,
  diceLine,
  RANDOM,
  type ResonanceChoice,
  type ResonanceRoll,
  rollDie,
  rollResonance,
  type ThinBloodPower,
} from "#/rules/resonance";

const LABEL =
  "font-label font-semibold text-xs uppercase leading-none tracking-[.12em]";

/** Aba Ações do Mestre: Rolagem de Ressonância. `d` só é trocado nos testes. */
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
          onChange={(intensidade) => setEscolha((e) => ({ ...e, intensidade }))}
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
          Intensidade em d10: 1–5 negligenciável, 6–8 difusa, 9–10 rola de novo
          (9–10 aguçada, senão intensa). Ressonância em d10: 1–3 fleumática, 4–6
          melancólica, 7–8 colérica, 9–10 sanguínea.
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
  );
}

function ChipGroup<T extends string>({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: T) => void;
  options: readonly T[];
  value: T;
}) {
  return (
    <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
      <legend className={`${LABEL} mb-2 p-0 text-ink-soft`}>{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Chip
            // papel branco só quando não marcado; marcado inverte para tinta
            className={value === option ? undefined : "bg-field"}
            key={option}
            onClick={() => onChange(option)}
            selected={value === option}
          >
            {option}
          </Chip>
        ))}
      </div>
    </fieldset>
  );
}

function ResonanceResult({ roll }: { roll: ResonanceRoll | null }) {
  return (
    <section
      aria-label="Resultado da rolagem"
      aria-live="polite"
      className="border-blood border-t-4 bg-ink p-5 text-white"
    >
      {roll ? (
        <RollDetails roll={roll} />
      ) : (
        <p className="m-0 text-lg text-white/70 italic">
          O resultado da rolagem aparece aqui.
        </p>
      )}
    </section>
  );
}

function RollDetails({ roll }: { roll: ResonanceRoll }) {
  const humor = RESONANCE_MOODS[roll.tipo];
  return (
    <>
      <div className={`${LABEL} text-ember`}>{roll.intensidade}</div>
      <div className="mt-2 font-semibold text-5xl leading-tight">
        {roll.tipo}
      </div>
      <p className="mt-2 mb-0 text-lg text-white/80 italic">{humor.emocoes}</p>
      <ul className="m-0 mt-3 flex list-none flex-wrap gap-2 p-0">
        {humor.disciplinas.map((disciplina) => (
          <li
            className={`${LABEL} border border-white/50 px-3 py-2`}
            key={disciplina}
          >
            {disciplina}
          </li>
        ))}
      </ul>
      <p className="mt-4 mb-0 text-lg">{INTENSITY_EFFECTS[roll.intensidade]}</p>
      {roll.poder ? <ThinBloodPowerSection poder={roll.poder} /> : null}
      {roll.discrasia ? (
        <div className="mt-4 border-white/25 border-t pt-4">
          <div className={`${LABEL} text-ember`}>Discrasia</div>
          <div className="mt-2 font-semibold text-3xl leading-tight">
            {roll.discrasia.nome}
          </div>
          <p className="mt-1 mb-0 text-lg">{roll.discrasia.descricao}</p>
        </div>
      ) : null}
      <p className="mt-4 mb-0 font-label font-semibold text-white/60 text-xs">
        {diceLine(roll)}
      </p>
    </>
  );
}

const SENTENCE_END = /[.!?](\s|$)/;

/** Primeira frase: a descrição do livro é longa demais para o cartão. */
function firstSentence(text: string): string {
  const end = text.search(SENTENCE_END);
  return end === -1 ? text : text.slice(0, end + 1);
}

function ThinBloodPowerSection({ poder }: { poder: ThinBloodPower }) {
  return (
    <div className="mt-4 border-white/25 border-t pt-4">
      <div className={`${LABEL} text-ember`}>
        {poder.disciplina} · Nível {poder.nivel}
      </div>
      <div className="mt-2 font-semibold text-3xl leading-tight">
        {poder.poder.name}
      </div>
      <p className="mt-1 mb-0 text-lg">
        {firstSentence(poder.poder.description)}
      </p>
      <p className="mt-1 mb-0 font-label font-semibold text-white/60 text-xs">
        {poder.poder.cost} · {poder.poder.duration}
      </p>
    </div>
  );
}
