import { SheetTextField } from "#/components/vtm/fields";
import { autoFit } from "#/components/vtm/trait-grid";
import { IDENTITY_FIELDS } from "#/data/fields";

const FINAL_FIELDS = IDENTITY_FIELDS.filter(
  (f) => !["cla", "senhor", "predador"].includes(f.key)
);

export function Step8Final() {
  return (
    <div className="grid gap-x-5 gap-y-4" style={autoFit(220)}>
      {FINAL_FIELDS.map((f) => (
        <SheetTextField field={f} key={f.key} labelClassName="mb-2" />
      ))}
    </div>
  );
}
