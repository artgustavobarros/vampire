import { BLOOD_POTENCY, bloodPotencyRow } from "#/data/blood-potency";
import { CLAN_FULL } from "#/data/clan-rules";
import { findClan } from "#/data/clans";
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
import { potencyFromGeneration } from "#/rules/generation";

/** O que abrir no painel; cada gatilho passa o valor atual do personagem. */
export type InfoTarget =
  | { kind: "attr" | "skill"; key: string; nivel: number }
  | { kind: "disc"; key: string; nivel: number }
  | { kind: "poder"; key: string; disc: string; nivel: number; desc?: string }
  | { kind: "merit"; key: string; tipo: MeritKind; pontos: number }
  /** Perdição e Compulsão do clã `key`; `potencia` define a Gravidade */
  | { kind: "bane" | "comp"; key: string; potencia: number }
  /**
   * Geração e Potência de Sangue: `geracao` do formulário ou da ficha (ex.:
   * "12ª", vazio = sem Geração) e `potencia` já resolvida por quem abre
   */
  | { kind: "geracao" | "potencia"; geracao: string; potencia: number }
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

export interface InfoTableRow {
  cells: string[];
  current: boolean;
}

export interface InfoTable {
  colunas: string[];
  /** `grid-template-columns` da tabela */
  grid: string;
  linhas: InfoTableRow[];
  /** largura mínima antes de rolar na horizontal */
  minW: string;
  titulo: string;
}

export interface InfoContent {
  atual: string;
  desc: string;
  kicker: string;
  niveis: InfoLevel[];
  nivelTit: string;
  nota: string;
  tabelas?: InfoTable[];
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

const MEND_SUFFIX = " por Checagem de Sangue";

function bloodPotencyTable(potencia: number): InfoTable {
  return {
    colunas: [
      "Potência",
      "Surto de Sangue",
      "Dano recuperado (por Checagem de Sangue)",
      "Bônus de poder de Disciplina",
      "Rerrolagem de Checagem para Disciplinas",
      "Gravidade da Perdição",
      "Penalidade de alimentação",
    ],
    grid: "64px repeat(5, minmax(88px,1fr)) minmax(180px,2fr)",
    linhas: BLOOD_POTENCY.map((b) => ({
      cells: [
        String(b.level),
        b.bloodSurge,
        b.mendAmount.replace(MEND_SUFFIX, ""),
        b.powerBonus,
        b.rouseReroll,
        String(b.baneSeverity),
        b.feedingList.join("\n"),
      ],
      current: b.level === potencia,
    })),
    minW: "700px",
    titulo: "Potência de Sangue",
  };
}

function bloodInfo(
  target: Extract<InfoTarget, { kind: "geracao" | "potencia" }>
): InfoContent {
  const { geracao, potencia } = target;
  const known = potencyFromGeneration(geracao) !== null;
  const inicial = known
    ? `a ${geracao} começa com Potência ${potencia}.`
    : "escolha a Geração para ver a sua.";
  const desc =
    target.kind === "geracao"
      ? `A distância entre você e Caim. Você é sempre uma Geração acima do seu senhor, e cada Abraço dilui o sangue. A Geração define a Potência de Sangue inicial: ${inicial}`
      : "A força da vitae. Não se escolhe na criação: vem da Geração.";
  const selo = geracao ? `${geracao} Geração · ` : "";
  return {
    atual: `${selo}Potência ${potencia}`,
    desc,
    kicker: "Sangue",
    niveis: [],
    nivelTit: "",
    nota: known
      ? `Linha destacada: Potência ${potencia}, a inicial da ${geracao} Geração.`
      : "Escolha a Geração no passo 1 para destacar a sua Potência inicial.",
    tabelas: [bloodPotencyTable(potencia)],
    titulo: target.kind === "geracao" ? "Geração" : "Potência de Sangue",
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
    case "potencia":
      return bloodInfo(target);
    default:
      return stateInfo(target);
  }
}
