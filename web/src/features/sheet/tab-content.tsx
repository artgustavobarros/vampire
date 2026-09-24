import type { SheetTab } from "./tabs";
import { AcoesTab } from "./tabs/acoes-tab";
import { DisciplinasTab } from "./tabs/disciplinas-tab";
import { FichaTab } from "./tabs/ficha-tab";
import { NotasTab } from "./tabs/notas-tab";
import { RegistrosTab } from "./tabs/registros-tab";
import { SessoesTab } from "./tabs/sessoes-tab";

export function SheetTabContent({ tab }: { tab: SheetTab }) {
  switch (tab) {
    case "disciplinas":
      return <DisciplinasTab />;
    case "acoes":
      return <AcoesTab />;
    case "registros":
      return <RegistrosTab />;
    case "notas":
      return <NotasTab />;
    case "sessoes":
      return <SessoesTab />;
    default:
      return <FichaTab />;
  }
}
