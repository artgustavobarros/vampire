import { bloodPotencyRow } from "#/data/blood-potency";
import { CLAN_FULL } from "#/data/clan-rules";
import { findClan } from "#/data/clans";
import { POWERS } from "#/data/disciplines";
import { GENERATIONS } from "#/data/generations";
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
import { generationCategory, potencyFromGeneration } from "#/rules/generation";

/** O que abrir no painel; cada gatilho passa o valor atual do personagem. */
export type InfoTarget =
  | { kind: "attr" | "skill"; key: string; nivel: number }
  | { kind: "disc"; key: string; nivel: number }
  | { kind: "poder"; key: string; disc: string; nivel: number; desc?: string }
  | { kind: "merit"; key: string; tipo: MeritKind; pontos: number }
  /** Perdição e Compulsão do clã `key`; `potencia` define a Gravidade */
  | { kind: "bane" | "comp"; key: string; potencia: number }
  /** `geracao` do formulário ou da ficha (ex.: "12ª"); vazio = sem Geração */
  | { kind: "geracao"; geracao: string }
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

// "Manipulação + Animalismo", "Inteligência + Feitiçaria de Sangue", com "vs."/"contra" opcional
const ROLL =
  /[A-ZÁ-Ú][a-zà-ú]+ \+ [A-ZÁ-Ú][a-zà-ú]+(?: de [A-ZÁ-Ú][a-zà-ú]+)?(?: (?:vs\.|contra) [^.;]+)?/;
const TRAILING_DOT = /\s*\.\s*$/;

/** Separa a rolagem citada na descrição do catálogo do resto do texto. */
export function splitRoll(
  description: string,
  duration: string
): { desc: string; roll: string } {
  const hit = description.match(ROLL);
  if (!hit) {
    return {
      desc: description,
      roll:
        duration === "Passiva"
          ? "Sem teste: efeito passivo, sempre ativo."
          : "Sem teste: o efeito acontece ao ativar.",
    };
  }
  const rest = description.replace(hit[0], "").replace(TRAILING_DOT, "").trim();
  if (!rest) {
    return { desc: description, roll: hit[0] };
  }
  return { desc: rest.endsWith(".") ? rest : `${rest}.`, roll: hit[0] };
}

function powerInfo(
  target: Extract<InfoTarget, { kind: "poder" }>
): InfoContent {
  const name = target.key.trim();
  const hit = (POWERS[target.disc.trim()] ?? []).find(
    (p) => p.name.toLowerCase() === name.toLowerCase()
  );
  const split = hit ? splitRoll(hit.description, hit.duration) : null;
  const niveis =
    hit && split
      ? levels(
          [
            ["Rolagem", split.roll],
            ["Custo", hit.cost],
            ["Duração", hit.duration],
          ],
          ""
        )
      : [];
  return {
    atual: "",
    desc:
      split?.desc ??
      (target.desc ||
        "Poder fora do catálogo. A descrição é a que você registrou."),
    kicker: `${target.disc || "Poder"} · nível ${hit?.level ?? target.nivel}`,
    niveis,
    nivelTit: niveis.length ? "Rolagem, custo e duração" : "",
    nota: hit?.rouse ? "Este poder exige Rouse Check." : "",
    titulo: name || "Poder sem nome",
  };
}

function generationInfo(
  target: Extract<InfoTarget, { kind: "geracao" }>
): InfoContent {
  const potencia = potencyFromGeneration(target.geracao);
  const rows = GENERATIONS.map(
    (g) =>
      [
        g.label,
        `Potência de Sangue ${g.bloodPotency} · ${generationCategory(Number.parseInt(g.label, 10))}`,
      ] as const
  );
  return {
    atual:
      target.geracao && potencia !== null
        ? `${target.geracao} · Potência ${potencia}`
        : "Sem Geração",
    desc: "A distância entre você e Caim. Cada Abraço dilui o sangue: quanto maior o número da Geração, mais fraco o sangue. A Geração define a Potência de Sangue inicial, que por sua vez define o Surto de Sangue, a cura, o bônus de Disciplinas e a Gravidade da Perdição.",
    kicker: "Sangue",
    niveis: levels(rows, target.geracao),
    nivelTit: "Geração e Potência de Sangue",
    nota: "Personagens iniciantes normalmente são da 12ª ou 13ª Geração. Gerações mais baixas só com permissão do Narrador.",
    titulo: "Geração",
  };
}

function meritInfo(
  target: Extract<InfoTarget, { kind: "merit" }>
): InfoContent {
  const name = target.key.trim().toLowerCase();
  const hit = MERIT_INFO.find(([prefix]) => name.startsWith(prefix));
  const tipo = hit?.[1] ?? target.tipo;
  const defeito = tipo === "defeito" || tipo === "defeito-sr";
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

function clanRuleInfo(
  target: Extract<InfoTarget, { kind: "bane" | "comp" }>
): InfoContent {
  const bane = target.kind === "bane";
  const clan = findClan(target.key);
  const full = CLAN_FULL[target.key]?.[target.kind];
  const titulo =
    (bane ? clan?.bane : clan?.compulsion) || (bane ? "Perdição" : "Compulsão");
  const kicker = `${bane ? "Perdição" : "Compulsão"} · ${target.key}`;
  if (!full) {
    return {
      atual: "",
      desc: (bane ? clan?.baneText : clan?.compulsionText) ?? "",
      kicker,
      niveis: [],
      nivelTit: "",
      nota: "",
      titulo,
    };
  }
  const gravidade = String(bloodPotencyRow(target.potencia).baneSeverity);
  const rows = full[1].map(
    ([label, txt]) => [label, txt.replaceAll("{G}", gravidade)] as const
  );
  return {
    atual: bane ? `Gravidade ${gravidade}` : "",
    desc: full[0],
    kicker,
    niveis: levels(rows, ""),
    nivelTit: "Regra e rolagem",
    nota: bane
      ? `A Gravidade da Perdição vem da Potência de Sangue (atual: ${target.potencia}).`
      : "Compulsões surgem numa falha bestial (1 em dado de Fome numa falha). Você pode escolher a Compulsão do clã ou rolar na tabela geral.",
    titulo,
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
    case "bane":
    case "comp":
      return clanRuleInfo(target);
    case "geracao":
      return generationInfo(target);
    default:
      return stateInfo(target);
  }
}
