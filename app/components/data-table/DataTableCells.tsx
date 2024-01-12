import { LuMoreVertical, LuPenSquare, LuTrash2 } from "react-icons/lu";
import { Link } from "@remix-run/react";
import { useMediaQuery } from "../hooks/useMediaQuery";

import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";

import { useDataTableCtx } from "./DataTableContext";

export function DataTableMenu({ id }: { id: string }) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const { setSelectedItem, setOpenMenu, setOpenDeleteDialog } = useDataTableCtx();


  function handleOpenMenu() {
    setSelectedItem(String(id));
    setOpenMenu(true)
  }

  function handleDeleteDialog() {
    setSelectedItem(String(id));
    setOpenDeleteDialog(true)
  }

  if (!isDesktop) {
    return (
      <div className="flex justify-end">
        <Button variant="ghost" className="p-0 rounded-full w-7 h-7" onClick={handleOpenMenu}>
          <LuMoreVertical size="20" />
        </Button>
      </div>
    )
  }

  return (
    <DataTableDropdownMenu id={id} onDeleteDialog={handleDeleteDialog}/>
  )
}

export function DataTableDropdownMenu({ id, onDeleteDialog }: { id: string, onDeleteDialog: () => void }) {
  const { getEditionPath } = useDataTableCtx();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" className="p-0 rounded-full w-7 h-7">
          <LuMoreVertical size="20" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link to={getEditionPath(id)}>
            <LuPenSquare className="w-4 h-4 mr-2" /> Editar
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onDeleteDialog}>
          <LuTrash2 className="w-4 h-4 mr-2" /> Deletar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
