import { Link } from "@remix-run/react";
import { DrawerContent, Drawer } from "../ui/drawer";
import { Button } from "../ui/button";
import { useDataTableCtx } from "./DataTableContext";


export function DataTableMobileMenu() {
  const { openMenu, setOpenMenu, setOpenDeleteDialog, getEditionPath } = useDataTableCtx();

  return (
    <Drawer open={openMenu} onOpenChange={setOpenMenu}>
      <DrawerContent>
        <div className="flex justify-around gap-4 p-4 mt-4 border-t">
          <Button variant="destructive" onClick={() => setOpenDeleteDialog(true)}>
            Excluir
          </Button>
          <Button asChild>
            <Link to={getEditionPath()}>
              Editar
            </Link>
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
