import { useId } from "react";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { FieldLabel, Panel } from "#/components/vtm/text";
import { autoFit } from "#/components/vtm/trait-grid";
import type { SessionLog } from "#/lib/types";
import { patchSheet, useSheet } from "#/stores/character-store";

const STAT =
  "mb-2 font-label font-semibold text-xs uppercase leading-none tracking-[.12em]";
const BIG = "font-semibold text-[32px] leading-[1.2]";
const ROW_LABEL = "mb-1 tracking-widest text-ink-faint";

export function SessoesTab() {
  const sheet = useSheet();
  const id = useId();
  const free = Math.max(
    0,
    (Number.parseInt(sheet.xpTotal, 10) || 0) -
      (Number.parseInt(sheet.xpGasto, 10) || 0)
  );
  const setSession = (i: number, change: Partial<SessionLog>) =>
    patchSheet({
      sessoes: sheet.sessoes.map((s, j) => (j === i ? { ...s, ...change } : s)),
    });

  return (
    <>
      <div className="mb-6 grid gap-4" style={autoFit(152)}>
        <Panel>
          <FieldLabel
            className={`${STAT} text-ink-soft`}
            htmlFor={`${id}-total`}
          >
            Experiência total
          </FieldLabel>
          <Input
            className={BIG}
            id={`${id}-total`}
            inputMode="numeric"
            onChange={(e) => patchSheet({ xpTotal: e.target.value })}
            value={sheet.xpTotal}
          />
        </Panel>
        <Panel>
          <FieldLabel
            className={`${STAT} text-ink-soft`}
            htmlFor={`${id}-gasto`}
          >
            Gasta
          </FieldLabel>
          <Input
            className={BIG}
            id={`${id}-gasto`}
            inputMode="numeric"
            onChange={(e) => patchSheet({ xpGasto: e.target.value })}
            value={sheet.xpGasto}
          />
        </Panel>
        <section className="bg-ink p-4 text-white">
          <div className={`${STAT} text-white/60`}>Disponível</div>
          <div className={BIG}>{free}</div>
        </section>
        <Panel>
          <div className={`${STAT} text-ink-soft`}>Noites vividas</div>
          <div className={BIG}>{sheet.noites || 0}</div>
        </Panel>
      </div>
      <Panel>
        <h3 className={`${STAT} mt-0 mb-3 text-ink`}>Registro de sessões</h3>
        {sheet.sessoes.map((s, i) => (
          <div
            className="grid items-end gap-3 border-line-soft border-b py-3"
            key={i}
            style={autoFit(140)}
          >
            <div>
              <FieldLabel className={ROW_LABEL} htmlFor={`${id}-d${i}`}>
                Data
              </FieldLabel>
              <Input
                id={`${id}-d${i}`}
                onChange={(e) => setSession(i, { data: e.target.value })}
                value={s.data}
              />
            </div>
            <div>
              <FieldLabel className={ROW_LABEL} htmlFor={`${id}-x${i}`}>
                XP
              </FieldLabel>
              <Input
                id={`${id}-x${i}`}
                onChange={(e) => setSession(i, { xp: e.target.value })}
                value={s.xp}
              />
            </div>
            <div className="sm:col-span-2">
              <FieldLabel className={ROW_LABEL} htmlFor={`${id}-r${i}`}>
                Resumo
              </FieldLabel>
              <Input
                id={`${id}-r${i}`}
                onChange={(e) => setSession(i, { resumo: e.target.value })}
                value={s.resumo}
              />
            </div>
          </div>
        ))}
        <Button
          className="mt-4 py-3"
          onClick={() =>
            patchSheet({
              sessoes: [...sheet.sessoes, { data: "", resumo: "", xp: "" }],
            })
          }
          type="button"
          variant="outline"
        >
          + Sessão
        </Button>
      </Panel>
    </>
  );
}
