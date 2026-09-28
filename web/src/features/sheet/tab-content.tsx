import type { SheetTab } from "./tabs";
import { AcoesTab } from "./tabs/acoes-tab";
import { CaracteristicasTab } from "./tabs/caracteristicas-tab";
import { CoterieTab } from "./tabs/coterie-tab";
import { DisciplinasTab } from "./tabs/disciplinas-tab";
import { ResumoTab } from "./tabs/resumo-tab";
import { RodadaTab } from "./tabs/rodada-tab";
import { RolagensTab } from "./tabs/rolagens-tab";
import { SessoesTab } from "./tabs/sessoes-tab";

export function SheetTabContent({ tab }: { tab: SheetTab }) {
  switch (tab) {
    case "disciplinas-e-sangue":
      return <DisciplinasTab />;
    case "acoes":
      return <AcoesTab />;
    case "coterie":
      return <CoterieTab />;
    case "rodada":
      return <RodadaTab />;
    case "resumo":
      return <ResumoTab />;
    case "rolagens":
      return <RolagensTab />;
    case "sessoes":
      return <SessoesTab />;
    default:
      return <CaracteristicasTab />;
  }
}
