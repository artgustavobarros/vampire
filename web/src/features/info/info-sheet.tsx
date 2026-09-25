import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "#/components/ui/sheet";
import { cn } from "#/lib/utils";
import { buildInfo, type InfoTable, type InfoTarget } from "./build-info";
import { RichParagraphs, RichText } from "./rich-text";

interface InfoApi {
  open: (target: InfoTarget) => void;
}

const InfoContext = createContext<InfoApi | null>(null);

export function useInfo(): InfoApi {
  const ctx = useContext(InfoContext);
  if (!ctx) {
    throw new Error("useInfo fora do InfoProvider");
  }
  return ctx;
}

const LABEL =
  "font-label font-semibold text-xs uppercase leading-none tracking-[.12em]";

/** Painel lateral único que explica atributos, habilidades, disciplinas, poderes, méritos e estados. */
export function InfoProvider({ children }: { children: ReactNode }) {
  const [target, setTarget] = useState<InfoTarget | null>(null);
  const [open, setOpen] = useState(false);
  const api = useMemo<InfoApi>(
    () => ({
      open: (next) => {
        setTarget(next);
        setOpen(true);
      },
    }),
    []
  );
  // o alvo fica guardado após fechar para o conteúdo não sumir durante a saída
  const info = target ? buildInfo(target) : null;

  return (
    <InfoContext.Provider value={api}>
      {children}
      <Sheet onOpenChange={setOpen} open={open}>
        <SheetContent
          className={cn(
            "data-[state=open]:slide-in-from-right-6! max-w-[92vw] gap-0 overflow-y-auto border-line p-6 data-[state=closed]:duration-200 data-[state=open]:duration-200",
            // tabelas largas pedem o painel mais largo
            info?.tabelas?.length
              ? "w-[760px] sm:max-w-[760px]"
              : "w-[400px] sm:max-w-[400px]"
          )}
          showCloseButton={false}
          side="right"
        >
          {info ? (
            <>
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <div className={cn(LABEL, "text-ink-soft")}>
                    {info.kicker}
                  </div>
                  <SheetTitle className="mt-2 font-semibold font-serif text-[32px] leading-[1.2]">
                    {info.titulo}
                  </SheetTitle>
                </div>
                <SheetClose
                  aria-label="Fechar"
                  className="-mt-3 -mr-3 grid size-12 flex-none cursor-pointer place-items-center font-serif text-2xl text-ink-soft leading-none"
                >
                  ×
                </SheetClose>
              </div>
              {info.atual ? (
                <div
                  className={cn(
                    LABEL,
                    "mt-3 self-start bg-ink px-2 py-1 text-white tracking-widest"
                  )}
                >
                  {info.atual}
                </div>
              ) : null}
              <SheetDescription
                asChild
                className="mt-4 font-serif text-ink text-lg"
              >
                <div>
                  <RichParagraphs text={info.desc} />
                </div>
              </SheetDescription>
              {info.niveis.length ? (
                <>
                  <div
                    className={cn(
                      LABEL,
                      "mt-8 mb-2 border-line border-b pb-2 text-ink-soft"
                    )}
                  >
                    {info.nivelTit}
                  </div>
                  <ul className="m-0 flex list-none flex-col gap-1 p-0">
                    {info.niveis.map((l) => (
                      <li
                        aria-current={l.current ? "true" : undefined}
                        className={cn(
                          "flex items-baseline gap-3 border px-3 py-2",
                          l.current
                            ? "border-ink bg-field"
                            : "border-line-soft bg-transparent"
                        )}
                        key={l.n}
                      >
                        <span className="min-w-16 flex-none font-bold font-label text-base text-ink">
                          {l.n}
                        </span>
                        <span className="min-w-0 flex-1 font-serif text-base">
                          <RichText text={l.txt} />
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
              {info.tabelas?.map((tb) => (
                <InfoTableView key={tb.titulo} table={tb} />
              ))}
              {info.nota ? (
                <div className="mt-6 font-serif text-base text-ink-soft">
                  <RichParagraphs text={info.nota} />
                </div>
              ) : null}
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </InfoContext.Provider>
  );
}

function InfoTableView({ table }: { table: InfoTable }) {
  return (
    <>
      <div className={cn(LABEL, "mt-8 mb-2 text-ink-soft")}>{table.titulo}</div>
      <div className="overflow-x-auto border-line border-t">
        <table
          className="grid border-collapse"
          style={{ gridTemplateColumns: table.grid, minWidth: table.minW }}
        >
          <thead className="contents">
            <tr className="contents">
              {table.colunas.map((c) => (
                <th
                  className="border-line border-b p-2 text-left font-bold font-label text-[11px] text-ink uppercase leading-[1.3] tracking-[.08em]"
                  key={c}
                  scope="col"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="contents">
            {table.linhas.map((row) => (
              <tr
                aria-current={row.current ? "true" : undefined}
                className="contents"
                key={row.cells[0]}
              >
                {row.cells.map((cell, k) => (
                  <td
                    className={cn(
                      "border-b p-2 font-serif text-[15px] text-ink leading-[1.4]",
                      row.current
                        ? "border-ink bg-field"
                        : "border-line-soft bg-transparent",
                      (row.current || k === 0) && "font-bold"
                    )}
                    key={table.colunas[k]}
                  >
                    <RichText text={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
