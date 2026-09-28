import { Button } from "#/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "#/components/ui/dialog";

interface ConfirmDialogProps {
  /** rótulo do botão que confirma (ex.: "Excluir") */
  confirm: string;
  onCancel: () => void;
  onConfirm: () => void;
  open: boolean;
  text: string;
}

/** Pergunta antes de apagar: "Excluir" em sangue e "Cancelar". */
export function ConfirmDialog({
  confirm,
  onCancel,
  onConfirm,
  open,
  text,
}: ConfirmDialogProps) {
  return (
    <Dialog onOpenChange={(next) => !next && onCancel()} open={open}>
      <DialogContent
        className="max-w-[420px] border-t-4 border-t-blood sm:max-w-[420px]"
        showCloseButton={false}
      >
        <DialogTitle className="font-semibold font-serif text-2xl leading-tight">
          {text}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Esta ação não pode ser desfeita.
        </DialogDescription>
        <DialogFooter>
          <Button onClick={onCancel} variant="outline">
            Cancelar
          </Button>
          <Button onClick={onConfirm} variant="destructive">
            {confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
