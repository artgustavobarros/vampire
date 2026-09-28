import { useState } from "react";
import { Button } from "#/components/ui/button";
import { notify } from "#/lib/toast";
import { cn } from "#/lib/utils";
import {
  EXPOSURES,
  generateNpc,
  moodOf,
  type Npc,
  type NpcFilters,
  npcSummary,
  PRESENTATIONS,
  type Presentation,
  RANDOM_NPC,
  STRATA,
} from "#/rules/npc";
import {
  type Die,
  RANDOM,
  type ResonanceRoll,
  rollResonance,
} from "#/rules/resonance";
import { ChipGroup, ResonanceResult } from "./resonance-parts";

const LABEL =
  "font-label font-semibold text-xs uppercase leading-none tracking-[.12em]";

const CREDITS =
  "Listas do Gerador de NPC Sertão Alagoano 1936. Vocabulário, malassombros, locais e estrutura de ganchos e objetos do Cangaço Trevoso RPG (Leandro Abrahão, Rodrigo Semente; Leandro Games / Craftando Games, 2021), CC BY 4.0.";

const RANDOM_M = "Aleatório";

const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);

type Row = [label: string, value: string];

function cards(n: Npc): { rows: Row[]; title: string }[] {
  return [
    {
      rows: [
        ["Origem", n.origem],
        ["Comunidade", n.comunidade],
        ["Condição social", n.condicao],
        ["Alfabetização", n.alfabetizacao],
        ["Cor e traços", n.corTracos],
        ["Porte", n.porte],
        ["Aparência", n.aparencia],
        ["Saúde e corpo", n.saudeCorpo],
        ["Como está hoje", n.estadoHoje],
        ["Marca visível", n.marcaVisivel],
        ["Vestimenta", n.vestimenta],
        ["Ao anoitecer", n.anoitecer],
        ["De madrugada", n.madrugada],
      ],
      title: "Identidade",
    },
    {
      rows: [
        ["Virtudes", n.virtudes.join(" · ")],
        ["Temperamento", n.temperamento],
        ["Ressonância", capitalize(n.ressonancia)],
        ["Falhas", n.falhas.join(" · ")],
        ["Com estranhos", n.estranhos],
        ["Com os PJs", n.comPjs],
        ["Com autoridade", n.autoridade],
        ["Fé e devoção", n.fe],
        ["Santo", n.santo],
        ["Modo de falar", n.modoFalar],
        ["Palavra que usa", n.palavra],
        ["Maneirismo", n.maneirismo],
        ["Passatempo", n.passatempo],
        ["O que evita", n.evita],
        ["Diante de violência", n.violencia],
      ],
      title: "Personalidade",
    },
    {
      rows: [
        ["Motivação", n.motivacao],
        ["Medo", n.medo],
        ["Segredo", n.segredo],
        ["Reputação", n.reputacao],
        ["Vínculo", n.vinculo],
        ["Problema atual", n.problema],
        ["O que carrega", n.carrega],
        ["Se sumir, dá por falta", n.seSumir],
        ["Gancho de cena", n.gancho],
      ],
      title: "Dramaturgia",
    },
    {
      rows: [
        ["Exposição", n.exposicaoTexto],
        ["O que viu ou sabe", n.oculto],
        ["Como reage ao assunto", n.reacaoOculto],
        ["Se for alimentado, culpa", n.comoExplica],
        ["Frase de entrada", `“${n.frase}”`],
        ["Detalhe de 1936", n.detalhe1936],
      ],
      title: "O Oculto",
    },
  ];
}

function NpcCard({ rows, title }: { rows: Row[]; title: string }) {
  return (
    <section aria-label={title} className="border border-line bg-surface p-4">
      <h3 className={cn(LABEL, "m-0 mb-2 text-blood")}>{title}</h3>
      <dl className="m-0">
        {rows.map(([label, value]) => (
          <div
            className="grid grid-cols-[minmax(0,8rem)_minmax(0,1fr)] gap-3 border-line border-t py-2"
            key={label}
          >
            <dt
              className={cn(
                LABEL,
                "pt-1 text-[0.65rem] text-ink-soft leading-snug"
              )}
            >
              {label}
            </dt>
            <dd className="m-0 text-lg leading-snug">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

async function copy(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    notify("Resumo copiado.", { tom: "ok" });
  } catch {
    notify("Não foi possível copiar. Selecione o texto e copie.");
  }
}

function NpcResult({ d, npc }: { d: Die; npc: Npc }) {
  const [roll, setRoll] = useState<ResonanceRoll | null>(null);
  const mood = moodOf(npc.ressonancia);
  const resumo = npcSummary(npc);
  return (
    <div className="mt-5 flex flex-col gap-4">
      <header className="flex flex-col gap-4 bg-ink p-5 text-white sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className={cn(LABEL, "text-ember leading-snug")}>
            {npc.apresentacao} · {npc.idade} · {npc.ocupacao}
          </div>
          <h3 className="m-0 mt-2 font-semibold text-5xl leading-tight">
            {npc.nome}
          </h3>
          {npc.alcunha ? (
            <p className="m-0 mt-1 text-white/80 text-xl italic">
              “{npc.alcunha}”
            </p>
          ) : null}
        </div>
        <button
          className={cn(
            LABEL,
            "min-h-12 flex-none cursor-pointer self-start border border-white/70 px-4 text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 sm:self-center"
          )}
          onClick={() =>
            setRoll(
              rollResonance(
                { intensidade: RANDOM, sangueFraco: false, tipo: mood },
                d
              )
            )
          }
          type="button"
        >
          Rolar intensidade · {mood}
        </button>
      </header>

      {roll ? (
        <div className="flex flex-col gap-2">
          <button
            className={cn(
              LABEL,
              "cursor-pointer self-end py-1 text-blood hover:text-blood-hover focus-visible:outline-2 focus-visible:outline-ink"
            )}
            onClick={() => setRoll(null)}
            type="button"
          >
            Limpar
          </button>
          <ResonanceResult label={`Intensidade de ${npc.nome}`} roll={roll} />
        </div>
      ) : null}

      <div className="grid items-start gap-4 md:grid-cols-3">
        {cards(npc).map((card) => (
          <NpcCard key={card.title} {...card} />
        ))}
      </div>

      <section
        aria-label="Resumo para ler na mesa"
        className="border border-line bg-surface p-5"
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className={cn(LABEL, "m-0 text-ink")}>Resumo para ler na mesa</h3>
          <Button onClick={() => copy(resumo)} size="sm" variant="outline">
            Copiar
          </Button>
        </div>
        <p className="m-0 text-lg leading-relaxed">{resumo}</p>
      </section>
    </div>
  );
}

/**
 * Gerador de NPC do Sertão alagoano, 1936 (aba Ações). O NPC vive só na
 * tela: gerar outro substitui o anterior.
 */
export function NpcGenerator({ d }: { d: Die }) {
  const [filtros, setFiltros] = useState<NpcFilters>(RANDOM_NPC);
  const [npc, setNpc] = useState<Npc | null>(null);
  /** conta os NPCs gerados: um novo começa sem a intensidade do anterior */
  const [seq, setSeq] = useState(0);
  const strataLabel =
    STRATA.find((s) => s.value === filtros.estrato)?.label ?? RANDOM_M;

  return (
    <section aria-labelledby="gerador-npc" className="mt-10">
      <div className="mb-5 flex items-center gap-4">
        <span aria-hidden="true" className="h-px flex-1 bg-ink" />
        <h2
          className="m-0 text-center font-semibold text-2xl leading-tight sm:text-3xl"
          id="gerador-npc"
        >
          Gerador de NPC · Sertão alagoano, 1936
        </h2>
        <span aria-hidden="true" className="h-px flex-1 bg-ink" />
      </div>

      <div className="grid items-end gap-5 border border-line bg-surface p-4 md:grid-cols-3">
        <ChipGroup<string>
          label="Apresentação"
          onChange={(v) =>
            setFiltros((f) => ({
              ...f,
              apresentacao: v === RANDOM ? null : (v as Presentation),
            }))
          }
          options={[RANDOM, ...PRESENTATIONS]}
          value={filtros.apresentacao ?? RANDOM}
        />
        <ChipGroup<string>
          label="Estrato social"
          onChange={(v) =>
            setFiltros((f) => ({
              ...f,
              estrato: STRATA.find((s) => s.label === v)?.value ?? null,
            }))
          }
          options={[RANDOM_M, ...STRATA.map((s) => s.label)]}
          value={strataLabel}
        />
        <ChipGroup<string>
          label="Exposição ao oculto"
          onChange={(v) =>
            setFiltros((f) => ({
              ...f,
              exposicao: EXPOSURES.find((e) => String(e) === v) ?? null,
            }))
          }
          options={[RANDOM, ...EXPOSURES.map(String)]}
          value={
            filtros.exposicao === null ? RANDOM : String(filtros.exposicao)
          }
        />
        <Button
          className="w-full md:col-start-1"
          onClick={() => {
            setNpc(generateNpc(filtros, d));
            setSeq((n) => n + 1);
          }}
          variant="destructive"
        >
          Gerar NPC
        </Button>
      </div>

      <p aria-live="polite" className="sr-only">
        {npc ? `NPC gerado: ${npc.nome}` : ""}
      </p>

      {npc ? <NpcResult d={d} key={seq} npc={npc} /> : null}

      <p className="mt-4 mb-0 text-ink-faint text-sm">{CREDITS}</p>
    </section>
  );
}
