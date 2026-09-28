import type { SheetTab } from "./tabs";
import { AcoesTab } from "./tabs/acoes-tab";
import { CaracteristicasTab } from "./tabs/caracteristicas-tab";
import { DisciplinasTab } from "./tabs/disciplinas-tab";
import { NotasTab } from "./tabs/notas-tab";
import { ResumoTab } from "./tabs/resumo-tab";
import { SessoesTab } from "./tabs/sessoes-tab";

export function SheetTabContent({ tab }: { tab: SheetTab }) {
  switch (tab) {
    case "disciplinas-e-sangue":
      return <DisciplinasTab />;
    case "acoes":
      return <AcoesTab />;
    case "resumo":
      return <ResumoTab />;
    case "notas":
      return <NotasTab />;
    case "sessoes":
      return <SessoesTab />;
    default:
      return <CaracteristicasTab />;
  }
}
