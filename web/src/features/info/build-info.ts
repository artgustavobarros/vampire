import { BLOOD_POTENCY, bloodPotencyRow } from "#/data/blood-potency";
import { CLAN_FULL } from "#/data/clan-rules";
import { findClan } from "#/data/clans";
import {
  canonicalDiscipline,
  findPower,
  POWERS,
  type PowerTemplate,
} from "#/data/disciplines";
import {
  findMerit,
  type MeritTemplate,
  meritPointOptions,
  meritRequirementLabel,
} from "#/data/merits";
import {
  ATTR_INFO,
  DISC_INFO,
  MERIT_SCALE_D,
  MERIT_SCALE_V,
  SKILL_INFO,
  type StateKind,
  TRAIT_INFO,
} from "#/data/trait-info";
import { ATTRIBUTE_GROUPS, SKILL_GROUPS, type TraitGroup } from "#/data/traits";
import type { MeritKind } from "#/lib/types";
import { potencyFromGeneration } from "#/rules/generation";

/** O que abrir no painel; cada gatilho passa o valor atual do personagem. */
export type InfoTarget =
  | { kind: "attr" | "skill"; key: string; nivel: number }
  | { kind: "espec"; key: string; skill: string; nivel: number }
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
  const [desc, espec, rows] = SKILL_INFO[target.key] ?? ["", "", []];
  return {
    atual: points(target.nivel, "Sem treino"),
    desc,
    kicker: `Habilidade ${groupOf(SKILL_GROUPS, target.key)}`,
    niveis: dotLevels(rows, target.nivel),
    nivelTit: "O que cada ponto significa",
    nota: espec ? `Especialidades comuns: ${espec}.` : "",
    titulo: target.key,
  };
}

function specialtyInfo(
  target: Extract<InfoTarget, { kind: "espec" }>
): InfoContent {
  const { skill } = target;
  return {
    atual: `${skill} ${target.nivel}`,
    desc: `Um foco dentro de ${skill}. Quando a rolagem de ${skill} se encaixa nesta especialidade, some 1 dado à parada.`,
    kicker: `Especialidade · ${skill}`,
    niveis: [],
    nivelTit: "",
    nota: "",
    titulo: target.key,
  };
}

function discInfo(target: Extract<InfoTarget, { kind: "disc" }>): InfoContent {
  const name = target.key.trim();
  const discName = canonicalDiscipline(name);
  const catalog = POWERS[discName] ?? POWERS[name] ?? [];
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
      DISC_INFO[discName] ??
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
const LEADING_DOT = /^\s*\.\s*/;
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
  const rest = description
    .replace(hit[0], "")
    .replace(LEADING_DOT, "")
    .replace(/\s*\.\s*\./g, ".")
    .replace(/\s+/g, " ")
    .replace(TRAILING_DOT, "")
    .trim();
  if (!rest) {
    return { desc: description, roll: hit[0] };
  }
  return { desc: rest.endsWith(".") ? rest : `${rest}.`, roll: hit[0] };
}

function powerRows(
  hit: PowerTemplate | undefined,
  split: { roll: string } | null
): [string, string][] {
  if (!hit) {
    return [];
  }
  const candidates: [string, string | undefined][] = [
    ["Amálgama", hit.amalgam],
    ["Pré-requisito", hit.prerequisite],
    ["Parada de Dados", hit.dicePool],
    ["Rolagem", hit.dicePool ? undefined : split?.roll],
    ["Custo", hit.cost],
    ["Sistema", hit.system],
    ["Duração", hit.duration],
    ["Ingredientes", hit.ingredients],
    ["Processo", hit.process],
  ];
  return candidates.filter((entry): entry is [string, string] =>
    Boolean(entry[1])
  );
}

function powerInfo(
  target: Extract<InfoTarget, { kind: "poder" }>
): InfoContent {
  const name = target.key.trim();
  const hit = findPower(target.disc, name);
  const split = hit ? splitRoll(hit.description, hit.duration) : null;
  const rows = powerRows(hit, split);
  const niveis = rows.length ? levels(rows, "") : [];
  return {
    atual: "",
    desc:
      (hit?.system ? hit.description : split?.desc) ??
      (target.desc ||
        "Poder fora do catálogo. A descrição é a que você registrou."),
    kicker: `${target.disc || "Poder"} · nível ${hit?.level ?? target.nivel}`,
    niveis,
    nivelTit: niveis.length ? "Rolagem, custo e duração" : "",
    nota: hit?.rouse ? "Este poder exige checagem de sangue." : "",
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

function meritKicker(tipo: MeritKind): string {
  if (tipo === "defeito" || tipo === "defeito-sr") {
    return "Defeito";
  }
  return "Vantagem";
}

function meritNote(tipo: MeritKind): string {
  if (tipo === "qualidade-sr" || tipo === "defeito-sr") {
    return "Característica exclusiva de Sangue-ralo (balanceamento 1:1).";
  }
  if (tipo === "defeito") {
    return "Defeitos devolvem pontos para gastar em vantagens.";
  }
  return "Vantagens custam os pontos marcados.";
}

/** Um nível por valor permitido; sem textos, faixa usa a escala genérica e custo fixo não tem lista. */
function meritLevels(
  canon: MeritTemplate | undefined,
  defeito: boolean,
  pontos: number
): InfoLevel[] {
  const scale = defeito ? MERIT_SCALE_D : MERIT_SCALE_V;
  if (!canon) {
    return dotLevels(scale, pontos);
  }
  const values = meritPointOptions(canon);
  const texts =
    canon.levels ??
    (values.length > 1 ? values.map((v) => scale[v - 1] ?? "") : []);
  return levels(
    texts.map((txt, i) => ["•".repeat(values[i] ?? 0), txt] as const),
    pontos ? "•".repeat(pontos) : ""
  );
}

/** Nota do tipo, nome original e livro, e o pré-requisito. */
function meritNoteLines(
  canon: MeritTemplate | undefined,
  tipo: MeritKind
): string {
  const original = canon?.aliases?.[0];
  return [
    meritNote(tipo),
    canon && original ? `Original: ${original} · ${canon.source}` : "",
    canon ? (meritRequirementLabel(canon) ?? "") : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function meritInfo(
  target: Extract<InfoTarget, { kind: "merit" }>
): InfoContent {
  const canon = findMerit(target.key);
  const tipo = canon?.tipo ?? target.tipo;
  const defeito = tipo === "defeito" || tipo === "defeito-sr";
  const fallbackDesc = defeito
    ? "Defeito fora do catálogo. Combine o efeito com o Narrador."
    : "Vantagem fora do catálogo. Combine o efeito com o Narrador.";
  const fallbackTitle = defeito ? "Defeito sem nome" : "Vantagem sem nome";

  return {
    atual: points(target.pontos, "Sem pontos"),
    desc: canon?.description ?? fallbackDesc,
    kicker: meritKicker(tipo),
    niveis: meritLevels(canon, defeito, target.pontos),
    nivelTit: "O que cada ponto significa",
    nota: meritNoteLines(canon, tipo),
    titulo: target.key.trim() || canon?.name || fallbackTitle,
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
    case "espec":
      return specialtyInfo(target);
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
