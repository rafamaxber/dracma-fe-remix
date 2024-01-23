import { Separator } from "@radix-ui/react-separator";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { ColumnDef } from "@tanstack/react-table";
import { LuPlusCircle } from "react-icons/lu";

import { DataTable } from "~/components/data-table/DataTable";
import { FilterBar } from "~/components/filter-bar/FilterBar";
import MasterPage from "~/components/master-page/MasterPage";
import { Pagination, PaginationType } from "~/components/pagination/Pagination";
import { Button } from "~/components/ui/button";
import { SearchForm } from "./SearchForm";
import { DataTableMenuProvider } from "~/components/data-table/DataTableContext";
import {  DataTableMenu } from "~/components/data-table/DataTableCells";
import { DataTableMobileMenu } from "~/components/data-table/DataTableMobileMenu";
import { DataTableConfirmDeleteDialog } from "~/components/data-table/DataTableConfirmDeleteDialog";
import { pageConfig } from "./";
import { AuthCookie } from "~/data/auth/user-auth-cookie";

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
  await AuthCookie.requireAuthCookie(request);

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
  ...pageConfig.dataTableColumns,
  {
    id: 'actions',

    cell: (props) => {
      const { id } = props.row.original;

      return (
        <DataTableMenu id={String(id)} />
      )
    }
  }
]

export default function Index() {
  const { data: dataProducts, query } = useLoaderData<ResponseType>();

  return (
    <DataTableMenuProvider editionPathPrefix={pageConfig.path}>
      <MasterPage>
        <MasterPage.ContentDefault>

          <MasterPage.HeaderDefault title={pageConfig.listTitleTxt}>
            <Button asChild variant="outline" className="justify-start">
              <Link to={`${pageConfig.path}/create`}>
                <LuPlusCircle className="mr-4"/> {pageConfig.createBtnTxt}
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
      </MasterPage>

      <DataTableMobileMenu />
      <DataTableConfirmDeleteDialog />
    </DataTableMenuProvider>
  );
}
