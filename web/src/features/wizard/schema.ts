import { z } from "zod";
import { clanBaneText, findClan, isAutoBaneText } from "#/data/clans";
import { findPower, sameDiscipline } from "#/data/disciplines";
import {
  DEFAULT_DISTRIBUTION,
  SKILL_DISTRIBUTIONS,
} from "#/data/distributions";
import { GENERATIONS } from "#/data/generations";
import { findMerit, meritPointOptions, meritRangeLabel } from "#/data/merits";
import { findPredator } from "#/data/predators";
import { ATTRIBUTES, REQUIRED_SPECIALTY_SKILLS } from "#/data/traits";
import type { Discipline, Merit, Sheet } from "#/lib/types";
import { potencyFromGeneration } from "#/rules/generation";
import {
  disciplineBlock,
  predatorBlock,
  predatorChoiceStatus,
  predatorDiscipline,
  predatorPower,
} from "#/rules/predator";
import { splitPredatorSpecialty } from "#/rules/specialties";
import {
  attributeQuotas,
  clanDisciplineOptions,
  disciplineDistribution,
  isThinBlood,
  meritStatus,
  skillDistributionCheck,
  unmetAmalgams,
} from "#/rules/wizard";

/** Campos de identidade do passo 8 (clã, senhor, geração e predador têm passo próprio). */
export const FINAL_KEYS = [
  "nome",
  "conceito",
  "cronica",
  "ambicao",
  "desejo",
] as const;

/** Recorte da `Sheet` editado pelo assistente, com as mesmas chaves. */
export interface WizardValues {
  ambicao: string;
  attrs: Record<string, number>;
  cla: string;
  conceito: string;
  cronica: string;
  desejo: string;
  /** sempre duas posições */
  disc: Discipline[];
  dist: string;
  espec: Record<string, string[]>;
  especLivre: string;
  geracao: string;
  meritos: Merit[];
  nome: string;
  predador: string;
  predDisc: string;
  /** id do ajuste com escolha → pontos por opção */
  predEscolhas: Record<string, Record<string, number>>;
  predEspec: string;
  /** nome da especialidade do Predador; começa com o sugerido pela lista */
  predEspecNome: string;
  /** nome do poder que o ponto de Disciplina do Predador dá */
  predPoder: string;
  senhor: string;
  skills: Record<string, number>;
}

export type WizardKey = keyof WizardValues;

const emptyDiscipline = (): Discipline => ({ nivel: 0, nome: "", powers: [] });

/** Valores do assistente, lidos da ficha em criação. */
export function sheetToWizard(sheet: Sheet): WizardValues {
  const disc = sheet.disc.slice(0, 2).map((d) => ({
    ...d,
    powers: d.powers.slice(),
  }));
  while (disc.length < 2) {
    disc.push(emptyDiscipline());
  }
  return {
    ambicao: sheet.ambicao ?? "",
    attrs: { ...sheet.attrs },
    cla: sheet.cla ?? "",
    conceito: sheet.conceito ?? "",
    cronica: sheet.cronica ?? "",
    desejo: sheet.desejo ?? "",
    disc,
    dist: sheet.dist || DEFAULT_DISTRIBUTION.name,
    espec: { ...sheet.espec },
    especLivre: sheet.especLivre ?? "",
    geracao: sheet.geracao ?? "",
    meritos: (sheet.meritos ?? []).map((m) => ({ ...m })),
    nome: sheet.nome ?? "",
    predador: sheet.predador ?? "",
    predDisc: sheet.predDisc ?? "",
    predEscolhas: structuredClone(sheet.predEscolhas ?? {}),
    predEspec: sheet.predEspec ?? "",
    predEspecNome:
      sheet.predEspecNome ??
      splitPredatorSpecialty(sheet.predEspec)?.nome ??
      "",
    predPoder: sheet.predPoder ?? "",
    senhor: sheet.senhor ?? "",
    skills: { ...sheet.skills },
  };
}

/**
 * Converte os `fields` do formulário num patch da ficha. Disciplinas além das
 * duas do assistente (criadas na aba Disciplinas) são preservadas.
 */
/** Tira especialidades vazias e as habilidades que ficaram sem nenhuma. */
function cleanSpecialties(
  espec: WizardValues["espec"]
): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const [skill, list] of Object.entries(espec)) {
    const filled = (list ?? []).filter((v) => v.trim());
    if (filled.length) {
      out[skill] = filled;
    }
  }
  return out;
}

export function wizardToPatch(
  values: WizardValues,
  fields: readonly WizardKey[],
  sheet: Pick<Sheet, "disc" | "perdicao">
): Partial<Sheet> {
  const patch: Partial<Sheet> = {};
  const target = patch as Record<string, unknown>;
  for (const key of fields) {
    target[key] = values[key];
  }
  if (fields.includes("espec")) {
    patch.espec = cleanSpecialties(values.espec);
  }
  const clan = findClan(values.cla);
  if (fields.includes("cla") && clan && isAutoBaneText(sheet.perdicao)) {
    patch.perdicao = clanBaneText(clan);
  }
  if (fields.includes("geracao")) {
    patch.potencia = potencyFromGeneration(values.geracao) || 0;
  }
  const thin = isThinBlood(values.cla);
  if (fields.includes("disc")) {
    // sangue-ralo não tem Disciplinas intrínsecas: as duas do assistente ficam vazias
    const own = thin ? [emptyDiscipline(), emptyDiscipline()] : values.disc;
    patch.disc = [...own, ...sheet.disc.slice(2)];
  }
  if (fields.includes("predador") && thin) {
    patch.predador = "";
    patch.predEspec = "";
    patch.predEspecNome = "";
    patch.predDisc = "";
    patch.predEscolhas = {};
    patch.predPoder = "";
  }
  if (typeof patch.predEspecNome === "string") {
    patch.predEspecNome = patch.predEspecNome.trim();
  }
  return patch;
}

const oneOf = (options: readonly string[], message: string) =>
  z.string().refine((v) => options.includes(v), { message });

const traitRecord = z.record(z.string(), z.number());

const step1 = z.object({
  cla: z
    .string()
    .refine((v) => Boolean(findClan(v)), { message: "Escolha um clã" }),
  geracao: oneOf(
    GENERATIONS.map((g) => g.label),
    "Escolha a geração"
  ),
  senhor: z.string(),
});

const step2 = z.object({ attrs: traitRecord }).superRefine(({ attrs }, ctx) => {
  if (ATTRIBUTES.some((n) => ![1, 2, 3, 4].includes(attrs[n] || 0))) {
    ctx.addIssue({
      code: "custom",
      message: "Os atributos ficam entre 1 e 4; os que sobram ficam em 2.",
      path: ["attrs"],
    });
    return;
  }
  const { quotas, summary } = attributeQuotas(attrs);
  if (quotas.some((q) => q.state !== "done")) {
    ctx.addIssue({ code: "custom", message: summary, path: ["attrs"] });
  }
});

const step3 = z
  .object({
    dist: oneOf(
      SKILL_DISTRIBUTIONS.map((d) => d.name),
      "Escolha uma distribuição"
    ),
    skills: traitRecord,
  })
  .superRefine((values, ctx) => {
    const { message } = skillDistributionCheck(values);
    if (message) {
      ctx.addIssue({ code: "custom", message, path: ["skills"] });
    }
  });

const step4 = z
  .object({
    espec: z.record(z.string(), z.array(z.string())),
    especLivre: z.string(),
    /** contexto: só decide quais especialidades são obrigatórias */
    skills: traitRecord,
  })
  .superRefine(({ espec, especLivre, skills }, ctx) => {
    const filled = (skill: string) => Boolean(espec[skill]?.[0]?.trim());
    const required = REQUIRED_SPECIALTY_SKILLS.filter(
      (k) => (skills[k] || 0) > 0
    );
    for (const skill of required) {
      if (!filled(skill)) {
        ctx.addIssue({
          code: "custom",
          message: "Informe uma especialidade",
          path: ["espec", skill],
        });
      }
    }
    if (required.length) {
      return;
    }
    if (!(skills[especLivre] || 0)) {
      ctx.addIssue({
        code: "custom",
        message: "Escolha uma habilidade com pontos",
        path: ["especLivre"],
      });
    } else if (!filled(especLivre)) {
      ctx.addIssue({
        code: "custom",
        message: "Informe uma especialidade",
        path: ["espec", especLivre],
      });
    }
  });

const power = z.object({ nivel: z.number(), nome: z.string() });

const discipline = z.object({
  nivel: z.number().int(),
  nome: z.string(),
  powers: z.array(power),
});

const step5 = z
  .object({ cla: z.string(), disc: z.array(discipline).length(2) })
  .superRefine(({ cla, disc }, ctx) => {
    if (disc.length !== 2 || isThinBlood(cla)) {
      return;
    }
    const { kind, options } = clanDisciplineOptions(cla);
    disc.forEach((d, i) => {
      if (!d.nome) {
        ctx.addIssue({
          code: "custom",
          message: "Escolha uma disciplina",
          path: ["disc", i, "nome"],
        });
      } else if (
        kind === "clan" &&
        !options.some((o) => sameDiscipline(o, d.nome))
      ) {
        ctx.addIssue({
          code: "custom",
          message: "Escolha Disciplinas do clã",
          path: ["disc", i, "nome"],
        });
      }
    });
    if (disc[0].nome && sameDiscipline(disc[0].nome, disc[1].nome)) {
      ctx.addIssue({
        code: "custom",
        message: "Escolha duas disciplinas diferentes",
        path: ["disc", 1, "nome"],
      });
    }
    if (!disciplineDistribution(disc, cla).levelsOk) {
      ctx.addIssue({
        code: "custom",
        message: "Marque 2 pontos em uma Disciplina e 1 na outra",
        path: ["disc", 0, "nivel"],
      });
    }
    disc.forEach((d, i) => {
      if (d.powers.some((p) => (p.nivel || 1) > d.nivel)) {
        ctx.addIssue({
          code: "custom",
          message: "Há poderes acima do nível da disciplina",
          path: ["disc", i, "powers"],
        });
      } else if (d.nivel >= 1 && d.powers.length > d.nivel) {
        // cada ponto dá direito a um poder
        ctx.addIssue({
          code: "custom",
          message: `Escolha no máximo ${d.nivel} ${d.nivel === 1 ? "poder" : "poderes"} em ${d.nome}`,
          path: ["disc", i, "powers"],
        });
      }
      const [unmet] = unmetAmalgams(d.nome, d.powers, disc);
      if (unmet) {
        ctx.addIssue({
          code: "custom",
          message: `${unmet.nome} é amálgama: exige ${findPower(d.nome, unmet.nome)?.amalgam}`,
          path: ["disc", i, "powers"],
        });
      }
    });
  });

const step6 = z
  .object({
    cla: z.string(),
    /** contexto: pontos e poderes do passo 5 decidem o poder do Predador */
    disc: z.array(discipline),
    /** contexto: a Potência da Geração pode vetar o Predador */
    geracao: z.string(),
    predador: z.string(),
    predDisc: z.string(),
    predEscolhas: z.record(z.string(), z.record(z.string(), z.number())),
    predEspec: z.string(),
    predEspecNome: z.string(),
    predPoder: z.string(),
  })
  .superRefine((values, ctx) => {
    const { cla, disc, geracao, predador, predEspec, predDisc, predEscolhas } =
      values;
    if (isThinBlood(cla)) {
      return;
    }
    const p = findPredator(predador);
    if (!p) {
      ctx.addIssue({
        code: "custom",
        message: "Escolha um tipo de predador",
        path: ["predador"],
      });
      return;
    }
    const block = predatorBlock(p, { cla, geracao });
    if (block) {
      ctx.addIssue({ code: "custom", message: block, path: ["predador"] });
    }
    if (!p.specialties.includes(predEspec)) {
      ctx.addIssue({
        code: "custom",
        message: "Escolha uma especialidade",
        path: ["predEspec"],
      });
    } else if (!values.predEspecNome.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "Informe o nome da especialidade do Predador",
        path: ["predEspecNome"],
      });
    }
    const option = p.disciplines.find((d) => d.nome === predDisc);
    const optionBlock = option && disciplineBlock(option, cla);
    if (optionBlock) {
      ctx.addIssue({
        code: "custom",
        message: `${predDisc}: ${optionBlock}`,
        path: ["predDisc"],
      });
    } else if (option) {
      const disciplina = predatorDiscipline(cla, disc, predDisc);
      if (!predatorPower(disciplina, values.predPoder)) {
        ctx.addIssue({
          code: "custom",
          message: `Escolha um poder de ${predDisc}`,
          path: ["predPoder"],
        });
      }
    } else {
      ctx.addIssue({
        code: "custom",
        message: "Escolha uma disciplina",
        path: ["predDisc"],
      });
    }
    for (const { id, message } of predatorChoiceStatus(p, predEscolhas)) {
      ctx.addIssue({ code: "custom", message, path: ["predEscolhas", id] });
    }
  });

const FREE_MERIT_POINTS = [1, 2, 3, 4, 5] as const;

const step7 = z
  .object({
    cla: z.string(),
    /** contexto: Falhas de Disciplina Enraizada exigem a Disciplina do passo 5 */
    disc: z.array(discipline),
    meritos: z.array(
      z.object({
        nome: z.string().trim().min(1, "Informe o nome"),
        pontos: z.number().int(),
        tipo: z.enum(["vantagem", "defeito", "qualidade-sr", "defeito-sr"]),
      })
    ),
  })
  .superRefine(({ cla, disc, meritos }, ctx) => {
    meritos.forEach((m, i) => {
      const canon = findMerit(m.nome);
      const allowed = canon ? meritPointOptions(canon) : FREE_MERIT_POINTS;
      if (!allowed.includes(m.pontos)) {
        ctx.addIssue({
          code: "custom",
          message: canon
            ? `Marque ${meritRangeLabel(allowed)} em ${canon.name}`
            : "Marque de 1 a 5 pontos",
          path: ["meritos", i, "pontos"],
        });
      }
    });
    const disciplinas = disc.map((d) => d.nome).filter(Boolean);
    const status = meritStatus(meritos, cla, disciplinas);
    if (!status.ok) {
      ctx.addIssue({
        code: "custom",
        message: status.message,
        path: ["meritos"],
      });
    }
  });

const step8 = z.object({
  ambicao: z.string(),
  conceito: z.string(),
  cronica: z.string(),
  desejo: z.string(),
  nome: z.string().trim().min(1, "Informe o nome do personagem"),
});

/** Um schema por passo, na ordem do assistente. */
export const STEP_SCHEMAS = [
  step1,
  step2,
  step3,
  step4,
  step5,
  step6,
  step7,
  step8,
] as const;

/** Campos que um passo só lê para validar; não são gravados por ele. */
const CONTEXT_FIELDS: Partial<Record<number, readonly WizardKey[]>> = {
  4: ["skills"],
  5: ["cla"],
  6: ["cla", "disc", "geracao"],
  7: ["cla", "disc"],
};

/** Campos gravados por passo (1-based), tirados dos shapes dos schemas. */
export const STEP_FIELDS: readonly (readonly WizardKey[])[] = STEP_SCHEMAS.map(
  (schema, i) =>
    (Object.keys(schema.shape) as WizardKey[]).filter(
      (k) => !CONTEXT_FIELDS[i + 1]?.includes(k)
    )
);

export const ALL_FIELDS: readonly WizardKey[] = [
  ...new Set(STEP_FIELDS.flat()),
];

export function stepFields(step: number): readonly WizardKey[] {
  return STEP_FIELDS[step - 1] ?? [];
}

export function isStepValid(step: number, values: WizardValues): boolean {
  return STEP_SCHEMAS[step - 1].safeParse(values).success;
}

/** Primeiro passo cujos dados gravados não passam no schema (8 se todos passam). */
export function firstIncompleteStep(sheet: Sheet): number {
  const values = sheetToWizard(sheet);
  for (let step = 1; step < STEP_SCHEMAS.length; step += 1) {
    if (!isStepValid(step, values)) {
      return step;
    }
  }
  return STEP_SCHEMAS.length;
}
