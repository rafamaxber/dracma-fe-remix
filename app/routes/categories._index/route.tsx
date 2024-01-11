import { Separator } from "@radix-ui/react-separator";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { ColumnDef } from "@tanstack/react-table";
import { LuMoreVertical, LuPlusCircle, LuTrash2, LuPenSquare } from "react-icons/lu";

import { DataTable } from "~/components/data-table/DataTable";
import { FilterBar } from "~/components/filter-bar/FilterBar";
import MasterPage from "~/components/master-page/MasterPage";
import { Pagination, PaginationType } from "~/components/pagination/Pagination";
import { Button } from "~/components/ui/button";
import { SearchForm } from "./SearchForm";
import { Drawer, DrawerContent } from "~/components/ui/drawer";
import { createContext, useContext, useState } from "react";
import { AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "~/components/ui/alert-dialog";
import { AlertDialogHeader, AlertDialogFooter } from "~/components/ui/alert-dialog";
import { useMediaQuery } from "~/components/hooks/useMediaQuery";
import { DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenu } from "~/components/ui/dropdown-menu";

export interface Category {
  category: string;
  sub_category: string;
  id: number;
}

interface ResponseType {
  data: Category[];
  query: QueryType;
}

export interface QueryType extends PaginationType {
  q?: string;
}

function deleteCategory({ id }: { id: string }) {
  return new Response(JSON.stringify({
    id,
    message: 'Categoria excluída com sucesso!'
  }), {
    headers: {
      "content-type": "application/json",
    },
    status: 201
  })
}

export async function controller({ request }: LoaderFunctionArgs) {
  const formData = await request.formData();
  const id = formData.get("id");

  if (String(request.method).toLocaleLowerCase() === "delete") {
    return deleteCategory({ id: String(id) })
  }
}

export const action = async ({ request, context, params }: ActionFunctionArgs) =>
  controller({ request, context, params })

function getData(): Category[] {
  return [
    {
      category: "Categoria 1",
      sub_category: "Sub-Categoria 1",
      id: 1,
    },
    {
      category: "Categoria 2",
      sub_category: "Sub-Categoria 2",
      id: 2,
    },
    {
      category: "Categoria 3",
      sub_category: "Sub-Categoria 3",
      id: 3,
    },
    {
      category: "Categoria 4",
      sub_category: "Sub-Categoria 4",
      id: 4,
    },
    {
      category: "Categoria 5",
      sub_category: "Sub-Categoria 5",
      id: 5,
    },
    {
      category: "Categoria 6",
      sub_category: "Sub-Categoria 6",
      id: 6,
    },
    {
      category: "Categoria 7",
      sub_category: "Sub-Categoria 7",
      id: 7,
    },
    {
      category: "Categoria 8",
      sub_category: "Sub-Categoria 8",
      id: 8,
    },
    {
      category: "Categoria 9",
      sub_category: "Sub-Categoria 9",
      id: 9,
    },
  ];
}

export const loader = async ({ request, params, context }: LoaderFunctionArgs) => {
  const url = request.url;
  const searchParams = new URL(url).searchParams;

  return new Promise((resolve) => {
    setTimeout(() => {
      const data = getData()

      resolve(
        new Response(JSON.stringify({
          data,
          total: 1000,
          offset: 0,
          limit: 50,
          query: {
            q: searchParams.get("q") || null,
          },
        }), {
          headers: {
            "content-type": "application/json",
          },
        })
      );
    }, 1000);
  });
};

const productsColumnsDefinition: ColumnDef<Category>[] = [
  {
    accessorKey: 'category',
    header: 'Categoria',
  },
  {
    accessorKey: 'sub_category',
    header: 'Sub-Categoria',
  },
  {
    id: 'actions',

    cell: (props) => {
      const isDesktop = useMediaQuery("(min-width: 768px)")
      const { setSelectedItem, setOpenMenu, setOpenDeleteDialog } = useContext(DataTableContext);
      const { id } = props.row.original;

      function handleOpenMenu() {
        setSelectedItem(id);
        setOpenMenu(true)
      }

      function handleDeleteDialog() {
        setSelectedItem(id);
        setOpenDeleteDialog(true)
      }

      // if (!isDesktop) {
      //   return (
      //     <div className="flex justify-end">
      //       <Button variant="ghost" className="p-0 rounded-full w-7 h-7" onClick={handleOpenMenu}>
      //         <LuMoreVertical size="20" />
      //       </Button>
      //     </div>
      //   )
      // }

      // return (
      //   <div className="flex justify-end gap-6">
      //     <Button variant="destructive" onClick={handleDeleteDialog} className="p-0 rounded-full w-7 h-7">
      //       <LuTrash2 />
      //     </Button>
      //     <Button asChild className="p-0 rounded-full w-7 h-7">
      //       <Link to={`/categories/${id}/edit`}>
      //         <LuPenSquare />
      //       </Link>
      //     </Button>
      //   </div>
      // )

      return (
        <DataTableDropdownMenu id={id} onDeleteDialog={handleDeleteDialog}/>
      )
    }
  }
]

export default function Index() {
  const { data: dataProducts, query } = useLoaderData<ResponseType>();

  return (
    <DataTableMenuProvider>
      <MasterPage>
        <MasterPage.ContentDefault>

          <MasterPage.HeaderDefault title="Categorias">
            <Button asChild variant="outline" className="justify-start">
              <Link to="/categories/create">
                <LuPlusCircle className="mr-4"/> Nova Categoria
              </Link>
            </Button>
          </MasterPage.HeaderDefault>

          <Separator className="my-4" />

          <FilterBar filterForm={
            <SearchForm query={query} />
          }/>

          <div className="border rounded-md">
            <DataTable columns={productsColumnsDefinition} data={dataProducts} />
          </div>

          <Pagination
            limit={query.limit}
            offset={query.offset}
            page={query.page}
            total={query.total}
          />

        </MasterPage.ContentDefault>
        <MobileMenu />
        <ConfirmDeleteDialog />
      </MasterPage>
    </DataTableMenuProvider>
  );
}

const DataTableContext = createContext({} as any);
function DataTableMenuProvider({ children }: { children: React.ReactNode }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [openDropdownMenu, setOpenDropdownMenu] = useState(false);

  function onDeleteAction() {
    setOpenDeleteDialog(false)
    setOpenMenu(false)
    console.log('onDeleteAction:: ', selectedItem)
  }

  function onCancelDeleteAction() {
    setOpenDeleteDialog(false)
    setOpenMenu(false)
    console.log('onCancelDeleteAction:: ', selectedItem)
  }

  return (
    <DataTableContext.Provider value={{
      selectedItem,
      setSelectedItem,
      openMenu,
      setOpenMenu,
      openDeleteDialog,
      setOpenDeleteDialog,
      onDeleteAction,
      onCancelDeleteAction,
      openDropdownMenu,
      setOpenDropdownMenu
    }}>
      {children}
    </DataTableContext.Provider>
  )
}

function MobileMenu() {
  const { selectedItem, openMenu, setOpenMenu, setOpenDeleteDialog } = useContext(DataTableContext);

  return (
    <Drawer open={openMenu} onOpenChange={setOpenMenu}>
      <DrawerContent>
        <div className="flex justify-around gap-4 p-4 mt-4 border-t">
          <Button variant="destructive" onClick={() => setOpenDeleteDialog(true)}>
            Excluir
          </Button>
          <Button asChild>
            <Link to={`/categories/${selectedItem}/edit`}>
              Editar
            </Link>
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function ConfirmDeleteDialog({
  title = "Tem certeza que deseja prosseguir?",
  description = "Essa ação não pode ser desfeita.",
}: {
  title?: string,
  description?: string,
}) {
  const fetcher = useFetcher();

  const { selectedItem, openDeleteDialog, setOpenDeleteDialog, onDeleteAction, onCancelDeleteAction } = useContext(DataTableContext);

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

          <AlertDialogCancel onClick={onCancelDeleteAction} >Cancelar</AlertDialogCancel>

          <fetcher.Form method="delete" className="w-full">
            <AlertDialogAction className="w-full" type="submit" name="id" value={selectedItem} onClick={onDeleteAction}>
              Continuar
            </AlertDialogAction>
          </fetcher.Form>

        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function DataTableDropdownMenu({ id, onDeleteDialog }: { id: number, onDeleteDialog: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" className="p-0 rounded-full w-7 h-7">
          <LuMoreVertical size="20" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link to={`/categories/${id}/edit`}>
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
