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
import { pageConfig } from ".";
import { AuthCookie } from "~/data/auth/user-cookie";

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  document: string;
}

interface ResponseType {
  data: Customer[];
  query: QueryType;
}

export interface QueryType extends PaginationType {
  q?: string;
}

function deleteEntity({ id }: { id: string }) {
  return new Response(JSON.stringify({
    id,
    message: 'Cliente excluído com sucesso!'
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
    return deleteEntity({ id: String(id) })
  }
}

export const action = async ({ request, context, params }: ActionFunctionArgs) =>
  controller({ request, context, params })

function getData(): Customer[] {
  return [{
    id: 1,
    name: 'João',
    email: 'j@gmail.com',
    phone: '999999999',
    document: '38509845590',
  },
  {
    id: 2,
    name: 'Maria',
    email: 'm@gmail.com',
    phone: '888888888',
    document: '81509845590',
  }];
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

const dataTableColumns: ColumnDef<Customer>[] = [
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
            <DataTable columns={dataTableColumns} data={dataProducts} />
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

