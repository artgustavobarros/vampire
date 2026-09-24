import { Button } from "#/components/ui/button";
import { Panel } from "#/components/vtm/text";
import { autoFit } from "#/components/vtm/trait-grid";
import { useRuleDialog } from "#/features/actions/rule-dialog";
import { useSheet } from "#/lib/store";
import { bloodSurgeNote } from "#/rules/actions";
import { CYCLE_HINT, HumanityCompactPanel, TrackPanel } from "../track-panels";

export function AcoesTab() {
  const sheet = useSheet();
  const dialog = useRuleDialog();
  const cards = [
    {
      cta: "Registrar",
      description: "Reduz a Fome conforme o quanto o recipiente rendeu.",
      red: false,
      run: () => dialog.open("feed"),
      title: "Alimentar-se",
    },
    {
      cta: "Testar",
      description:
        "Resiste à Besta com Autocontrole + Determinação contra a dificuldade da provocação.",
      red: true,
      run: () => dialog.open("frenzy"),
      title: "Teste de Frenesi",
    },
    {
      cta: "Rouse + surto",
      description:
        "Adiciona o bônus de Potência de Sangue a um teste físico. Exige Rouse Check.",
      red: true,
      run: () => dialog.open("rouse", bloodSurgeNote(sheet)),
      title: "Surto de Sangue",
    },
  ];
  return (
    <>
      <div className="mb-6 grid gap-4" style={autoFit(260)}>
        <TrackPanel hint={CYCLE_HINT} hintClassName="text-ink/55" track="vit" />
        <TrackPanel hint={CYCLE_HINT} hintClassName="text-ink/55" track="fdv" />
        <HumanityCompactPanel />
      </div>
      <div className="grid gap-4" style={autoFit(280)}>
        {cards.map((c) => (
          <Panel className="flex flex-col gap-3" key={c.title}>
            <h3 className="m-0 font-semibold text-2xl leading-tight">
              {c.title}
            </h3>
            <p className="m-0 flex-1 text-ink-soft text-lg">{c.description}</p>
            <div className="flex flex-wrap gap-2">
              <Button
                className="min-w-33 flex-1 py-3"
                onClick={c.run}
                type="button"
                variant={c.red ? "destructive" : "default"}
              >
                {c.cta}
              </Button>
            </div>
          </Panel>
        ))}
      </div>
    </>
  );
}
