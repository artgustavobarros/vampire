import { settings } from "#/lib/settings";
import type { Sheet } from "#/lib/types";
import { healAggravated, rouseCheck, sleep } from "#/rules/actions";
import { FEEDING_SOURCES, feed, feedingYield } from "#/rules/feeding";
import { bloodPotency } from "#/rules/generation";
import { willpowerMax } from "#/rules/tracks";
import { patchSheet } from "#/stores/character-store";

export type FlowKind = "rouse" | "sleep" | "agg" | "feed" | "frenzy";

export interface Flow {
  difficulty?: number;
  kind: FlowKind;
  note: string;
  stage: string;
}

export interface FlowAction {
  label: string;
  primary?: boolean;
  run: () => void;
}

export interface FlowView {
  actions: FlowAction[];
  body: string;
  kicker: string;
  title: string;
}

type SetFlow = (flow: Flow | null) => void;

/** Monta o diálogo de regra do estado atual, igual aos estágios do standalone. */
export function flowView(flow: Flow, sheet: Sheet, setFlow: SetFlow): FlowView {
  const close = () => setFlow(null);
  const to = (kind: FlowKind, stage: string, note = "", difficulty?: number) =>
    setFlow({ difficulty, kind, note, stage });
  const hunger = sheet.fome || 0;
  const aggAction: FlowAction = {
    label: "Curar dano agravado (3 Rouse Checks)",
    run: () => to("agg", "ask"),
  };

  switch (flow.kind) {
    case "rouse":
      if (flow.stage === "ask") {
        const apply = (passed: boolean) => {
          const r = rouseCheck(sheet, passed, settings.avisoFrenesi);
          patchSheet(r.patch);
          to("rouse", "done", r.note);
        };
        return {
          actions: [
            { label: "Passei", primary: true, run: () => apply(true) },
            { label: "Falhei", run: () => apply(false) },
            { label: "Cancelar", run: close },
          ],
          body: `Um dado. Resultado 6 ou mais é sucesso. Fome atual: ${hunger}.`,
          kicker: "Teste",
          title: "Rouse Check",
        };
      }
      return {
        actions: [
          { label: "Fechar", primary: true, run: close },
          { label: "Outro Rouse Check", run: () => to("rouse", "ask") },
        ],
        body: "Anotado na ficha.",
        kicker: "Resultado",
        title: `Fome ${hunger}`,
      };

    case "sleep":
      if (flow.stage === "ask") {
        return {
          actions: [
            {
              label: "Dormir",
              primary: true,
              run: () => {
                const r = sleep(sheet, settings.curaAoDormir);
                patchSheet(r.patch);
                to("sleep", "wake", r.note);
              },
            },
            aggAction,
            { label: "Cancelar", run: close },
          ],
          body: "A ficha será atualizada: cura de vitalidade superficial e Força de Vontade.",
          kicker: "Fim da noite",
          title: "Dormir até o anoitecer?",
        };
      }
      return {
        actions: [
          {
            label: "Fazer Rouse Check",
            primary: true,
            run: () => to("rouse", "ask"),
          },
          aggAction,
          { label: "Depois", run: close },
        ],
        body: "Faça um Rouse Check para sair do torpor.",
        kicker: "Anoiteceu",
        title: "Hora de acordar",
      };

    case "agg": {
      if (flow.stage === "ask") {
        const heal = (failures: number) => {
          const r = healAggravated(sheet, failures);
          patchSheet(r.patch);
          to("agg", "done", r.note);
        };
        return {
          actions: [
            { label: "Nenhum falhou", primary: true, run: () => heal(0) },
            { label: "1 falhou", run: () => heal(1) },
            { label: "2 falharam", run: () => heal(2) },
            { label: "3 falharam", run: () => heal(3) },
            { label: "Cancelar", run: close },
          ],
          body: `Cura 1 de dano agravado e exige três Rouse Checks. Quantos falharam? Fome atual: ${hunger}.`,
          kicker: "Cura profunda",
          title: "Curar dano agravado",
        };
      }
      return {
        actions: [{ label: "Fechar", primary: true, run: close }],
        body: "Anotado na ficha.",
        kicker: "Resultado",
        title: `Fome ${hunger}`,
      };
    }

    case "feed":
      return feedView(flow, sheet, to, close);

    case "frenzy": {
      const pool = willpowerMax(sheet);
      if (flow.stage === "ask") {
        const go = (difficulty: number, cause: string) =>
          to(
            "frenzy",
            "roll",
            `${cause} · dificuldade ${difficulty}`,
            difficulty
          );
        return {
          actions: [
            {
              label: "Fome / sangue à vista (dif. 2)",
              primary: true,
              run: () => go(2, "Frenesi de Fome"),
            },
            {
              label: "Provocação ou fúria (dif. 3)",
              run: () => go(3, "Frenesi de raiva"),
            },
            {
              label: "Terror: fogo, sol, Fúria (dif. 4)",
              run: () => go(4, "Frenesi de terror"),
            },
            { label: "Cancelar", run: close },
          ],
          body: `Reserva: Autocontrole + Determinação = ${pool} dados. Fome ${hunger}.`,
          kicker: "Teste de Frenesi",
          title: "Contra o que resiste?",
        };
      }
      if (flow.stage === "roll") {
        return {
          actions: [
            {
              label: "Resisti",
              primary: true,
              run: () =>
                to(
                  "frenzy",
                  "done",
                  "A Besta recua. Nenhuma alteração na ficha."
                ),
            },
            {
              label: "Sucumbi ao frenesi",
              run: () =>
                to(
                  "frenzy",
                  "done",
                  "Frenesi por uma cena: a Besta age. Sem gastar Força de Vontade e sem usar Disciplinas que exijam calma; ao fim, teste de Humanidade se houver transgressão."
                ),
            },
            { label: "Cancelar", run: close },
          ],
          body: "Role Autocontrole + Determinação. Você pode gastar Força de Vontade para rerrolar até três dados.",
          kicker: "Rolagem",
          title: `${pool} dados vs. dificuldade ${flow.difficulty ?? 0}`,
        };
      }
      return {
        actions: [
          { label: "Fechar", primary: true, run: close },
          { label: "Novo teste", run: () => to("frenzy", "ask") },
        ],
        body: "Anotado para a cena.",
        kicker: "Resultado",
        title: "Frenesi resolvido",
      };
    }
    default:
      return { actions: [], body: "", kicker: "", title: "" };
  }
}

function feedView(
  flow: Flow,
  sheet: Sheet,
  to: (kind: FlowKind, stage: string, note?: string) => void,
  close: () => void
): FlowView {
  const hunger = sheet.fome || 0;
  const potency = bloodPotency(sheet);
  const apply = (amount: number, source: string) => {
    const r = feed(sheet, amount, source);
    patchSheet(r.patch);
    to("feed", "done", r.note);
  };

  if (flow.stage === "pessoa") {
    return {
      actions: [
        ...[1, 2, 3, 4].map((n) => ({
          label: `−${n} de Fome`,
          primary: n === 1,
          run: () => apply(n, "Pessoa"),
        })),
        { label: "Voltar", run: () => to("feed", "ask") },
      ],
      body: `Beber de uma pessoa sacia de 1 a 4 de Fome, conforme o quanto você tomou. Fome atual: ${hunger}.`,
      kicker: "Alimentação",
      title: "Quanto você bebeu?",
    };
  }
  if (flow.stage === "done") {
    return {
      actions: [{ label: "Fechar", primary: true, run: close }],
      body: "Anotado na ficha.",
      kicker: "Alimentação",
      title: `Fome ${hunger}`,
    };
  }
  return {
    actions: [
      ...FEEDING_SOURCES.map((source): FlowAction => {
        const y = feedingYield(source, potency);
        if (!y.amount) {
          return {
            label: `${source.name} — não sacia`,
            run: () => to("feed", "ask", y.warning),
          };
        }
        const label = source.choose
          ? `${source.name} — até −${y.amount} de Fome`
          : `${source.name} — −${y.amount} de Fome`;
        return {
          label: label + (y.warning ? " *" : ""),
          run: source.choose
            ? () => to("feed", "pessoa")
            : () => apply(y.amount, source.name),
        };
      }),
      { label: "Cancelar", run: close },
    ],
    body: hunger
      ? `Fome atual: ${hunger}. Potência de Sangue ${potency} define o quanto cada fonte sacia.`
      : "Você está saciado. Nada a reduzir.",
    kicker: "Alimentação",
    title: hunger ? "De onde veio o sangue?" : "Fome 0",
  };
}
