import { CharacterStatusCard } from "#/features/dm/status-card";
import { useApiLoad } from "#/hooks/use-api-load";
import { getMyCoterie } from "#/lib/api";

/** Aba Coterie do jogador: os membros da coterie em que o Mestre o colocou. */
export function CoterieTab() {
  const [data] = useApiLoad(getMyCoterie);

  if (data === null) {
    return (
      <p
        aria-busy="true"
        className="text-ink-soft text-lg italic"
        role="status"
      >
        Carregando coterie…
      </p>
    );
  }
  if (!data.coterie) {
    return (
      <p className="text-ink-soft text-lg italic">
        Você ainda não está em uma coterie. Quem monta as coteries é o Mestre.
      </p>
    );
  }
  return (
    <section className="flex flex-col gap-4">
      <h2 className="m-0 font-semibold text-3xl leading-tight">
        {data.coterie.nome || "Coterie sem nome"}
      </h2>
      <ul className="m-0 grid list-none gap-3 p-0 md:grid-cols-2">
        {data.coterie.membros.map(({ sheet, userId }) => (
          <li key={userId}>
            <CharacterStatusCard sheet={sheet} />
          </li>
        ))}
      </ul>
    </section>
  );
}
