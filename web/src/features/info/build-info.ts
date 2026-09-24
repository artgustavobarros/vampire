import { POWERS } from "#/data/disciplines";
import {
  ATTR_INFO,
  DISC_INFO,
  MERIT_INFO,
  MERIT_SCALE_D,
  MERIT_SCALE_V,
  SKILL_INFO,
  SKILL_SCALE,
  type StateKind,
  TRAIT_INFO,
} from "#/data/trait-info";
import { ATTRIBUTE_GROUPS, SKILL_GROUPS, type TraitGroup } from "#/data/traits";
import type { MeritKind } from "#/lib/types";

/** O que abrir no painel; cada gatilho passa o valor atual do personagem. */
export type InfoTarget =
  | { kind: "attr" | "skill"; key: string; nivel: number }
  | { kind: "disc"; key: string; nivel: number }
  | { kind: "poder"; key: string; disc: string; nivel: number; desc?: string }
  | { kind: "merit"; key: string; tipo: MeritKind; pontos: number }
  | {
      kind: StateKind;
      /** texto do selo (ex.: "7 / 10") */
      atual?: string;
      /** marcador da linha a destacar (ex.: "3", "Colérico") */
      marca?: string;
    };

export interface InfoLevel {
  current: boolean;
  n: string;
  txt: string;
}

export interface InfoContent {
  atual: string;
  desc: string;
  kicker: string;
  niveis: InfoLevel[];
  nivelTit: string;
  nota: string;
  titulo: string;
}

const levels = (
  rows: readonly (readonly [string, string])[],
  current: string
): InfoLevel[] => rows.map(([n, txt]) => ({ current: n === current, n, txt }));

const dotLevels = (rows: readonly string[], value: number): InfoLevel[] =>
  levels(
    rows.map((txt, i) => ["•".repeat(i + 1), txt] as const),
    value ? "•".repeat(value) : ""
  );

const points = (v: number, zero: string) =>
  v ? `${v} ${v === 1 ? "ponto" : "pontos"}` : zero;

const PLURAL_AIS = /ais$/;
const PLURAL_S = /s$/;

/** "Físicos" → "físico", "Sociais" → "social" */
function groupOf(groups: readonly TraitGroup[], key: string): string {
  const label = groups.find((g) => g.traits.includes(key))?.label ?? "";
  return label.toLowerCase().replace(PLURAL_AIS, "al").replace(PLURAL_S, "");
}

const STATE_LIST_TITLE: Partial<Record<StateKind, string>> = {
  ressonancia: "Humores e Disciplinas",
  vitalidade: "Tipos de dano",
  vontade: "Tipos de dano",
};

function attrInfo(
  target: Extract<InfoTarget, { kind: "attr" | "skill" }>
): InfoContent {
  const [desc, rows] = ATTR_INFO[target.key] ?? ["", []];
  return {
    atual: points(target.nivel, "Sem pontos"),
    desc,
    kicker: `Atributo ${groupOf(ATTRIBUTE_GROUPS, target.key)}`,
    niveis: dotLevels(rows, target.nivel),
    nivelTit: "O que cada ponto significa",
    nota: "",
    titulo: target.key,
  };
}

function skillInfo(
  target: Extract<InfoTarget, { kind: "attr" | "skill" }>
): InfoContent {
  const [desc, espec] = SKILL_INFO[target.key] ?? ["", ""];
  return {
    atual: points(target.nivel, "Sem treino"),
    desc,
    kicker: `Habilidade ${groupOf(SKILL_GROUPS, target.key)}`,
    niveis: dotLevels(SKILL_SCALE, target.nivel),
    nivelTit: "O que cada ponto significa",
    nota: espec ? `Especialidades comuns: ${espec}.` : "",
    titulo: target.key,
  };
}

function discInfo(target: Extract<InfoTarget, { kind: "disc" }>): InfoContent {
  const name = target.key.trim();
  const catalog = POWERS[name] ?? [];
  const rows = [1, 2, 3, 4, 5].map(
    (n) =>
      [
        String(n),
        catalog
          .filter((p) => p.level === n)
          .map((p) => p.name)
          .join(", ") || "Sem poderes catalogados neste nível.",
      ] as const
  );
  return {
    atual: target.nivel ? `Nível ${target.nivel}` : "Sem pontos",
    desc:
      DISC_INFO[name] ??
      "Disciplina fora do catálogo. Registre os poderes à mão.",
    kicker: "Disciplina",
    niveis: levels(rows, String(target.nivel)),
    nivelTit: "Poderes por nível",
    nota: "Você só pode escolher poderes até o seu nível na Disciplina.",
    titulo: name || "Disciplina sem nome",
  };
}

function powerInfo(
  target: Extract<InfoTarget, { kind: "poder" }>
): InfoContent {
  const name = target.key.trim();
  const hit = (POWERS[target.disc.trim()] ?? []).find(
    (p) => p.name.toLowerCase() === name.toLowerCase()
  );
  const niveis = hit
    ? levels(
        [
          ["Custo", hit.cost],
          ["Duração", hit.duration],
        ],
        ""
      )
    : [];
  return {
    atual: "",
    desc:
      hit?.description ??
      (target.desc ||
        "Poder fora do catálogo. A descrição é a que você registrou."),
    kicker: `${target.disc || "Poder"} · nível ${hit?.level ?? target.nivel}`,
    niveis,
    nivelTit: niveis.length ? "Custo e duração" : "",
    nota: hit?.rouse ? "Este poder exige Rouse Check." : "",
    titulo: name || "Poder sem nome",
  };
}

function meritInfo(
  target: Extract<InfoTarget, { kind: "merit" }>
): InfoContent {
  const name = target.key.trim().toLowerCase();
  const hit = MERIT_INFO.find(([prefix]) => name.startsWith(prefix));
  const defeito = (hit?.[1] ?? target.tipo) === "defeito";
  return {
    atual: points(target.pontos, "Sem pontos"),
    desc:
      hit?.[3] ??
      `${defeito ? "Defeito" : "Vantagem"} fora do catálogo. Combine o efeito com o Narrador.`,
    kicker: defeito ? "Defeito" : "Vantagem",
    niveis: dotLevels(defeito ? MERIT_SCALE_D : MERIT_SCALE_V, target.pontos),
    nivelTit: "O que cada ponto significa",
    nota: defeito
      ? "Defeitos devolvem pontos para gastar em vantagens."
      : "Vantagens custam os pontos marcados.",
    titulo:
      target.key.trim() || (defeito ? "Defeito sem nome" : "Vantagem sem nome"),
  };
}

function stateInfo(
  target: Extract<InfoTarget, { kind: StateKind }>
): InfoContent {
  const [kicker, titulo, desc, rows, nota] = TRAIT_INFO[target.kind];
  return {
    atual: target.atual ?? "",
    desc,
    kicker,
    niveis: levels(rows, target.marca ?? ""),
    nivelTit: rows.length
      ? (STATE_LIST_TITLE[target.kind] ?? "O que cada nível significa")
      : "",
    nota,
    titulo,
  };
}

export function buildInfo(target: InfoTarget): InfoContent {
  switch (target.kind) {
    case "attr":
      return attrInfo(target);
    case "skill":
      return skillInfo(target);
    case "disc":
      return discInfo(target);
    case "poder":
      return powerInfo(target);
    case "merit":
      return meritInfo(target);
    default:
      return stateInfo(target);
  }
}
