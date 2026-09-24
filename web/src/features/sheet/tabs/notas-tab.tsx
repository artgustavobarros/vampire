import { SheetTextArea } from "#/components/vtm/fields";
import { Panel } from "#/components/vtm/text";

export function NotasTab() {
  return (
    <Panel>
      <SheetTextArea
        field={{
          key: "notas",
          label: "Anotações",
          placeholder: "Contatos, pistas, dívidas, objetivos…",
        }}
        rows={18}
      />
    </Panel>
  );
}
