import { useFetcher } from "@remix-run/react";
import { buttonVariants } from "~/components/ui/button";
import { AlertDialogHeader, AlertDialogFooter, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialog, AlertDialogAction } from "../ui/alert-dialog";
import { useDataTableCtx } from "./DataTableContext";


export function DataTableConfirmDeleteDialog({
  title = "Tem certeza que deseja prosseguir?", description = "Essa ação não pode ser desfeita.",
}: {
  title?: string;
  description?: string;
}) {
  const fetcher = useFetcher();

  const { selectedItem, openDeleteDialog, setOpenDeleteDialog, onDeleteAction, onCancelDeleteAction } = useDataTableCtx();

  return (
    <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancelDeleteAction}>Cancelar</AlertDialogCancel>
          <fetcher.Form method="delete" className="w-full" onSubmit={onDeleteAction}>
            <AlertDialogAction className={buttonVariants({ variant: "destructive" })} type="submit" name="id" value={selectedItem}>
              Continuar
            </AlertDialogAction>
          </fetcher.Form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
