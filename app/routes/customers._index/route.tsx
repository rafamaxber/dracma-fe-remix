import { Separator } from "@radix-ui/react-separator";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
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
import { pageConfig } from "./page-config";
import { AuthCookie } from "~/data/auth/user-auth-cookie";
import { CrudBaseRepository, RESOURCE_LIST } from "~/infra/http-client/crud-base-repository";

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  cnpj: string;
}

export interface CustomerFilters extends PaginationType {
  name?: string;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const accessToken = await AuthCookie.requireAuthCookie(request);
  const formData = await request.formData();
  const id = formData.get("id");

  if (String(request.method).toLocaleLowerCase() === "delete") {
    await new CrudBaseRepository(
      RESOURCE_LIST.v1.customer, String(accessToken)
    ).delete(Number(id));
  }

  return null;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const accessToken = await AuthCookie.requireAuthCookie(request);

  const url = request.url;
  const searchParams = new URL(url).searchParams;
  const query = {
    q: String(searchParams.get('q') || ''),
  }
  const result = await new CrudBaseRepository(
    RESOURCE_LIST.v1.customer, String(accessToken)
  ).listAll<Customer, CustomerFilters>({
    name: String(searchParams.get('q') || ''),
    page: Number(searchParams.get('page') || 1),
    perPage: Number(searchParams.get('perPage') || 10),
  })

  return json({...result, query });
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
  const { results, pagination, query } = useLoaderData<typeof loader>();

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

          <div className="border rounded-md bg-card">
            <DataTable columns={dataTableColumns} data={results} />
          </div>

          <Pagination
            perPage={pagination.perPage}
            page={pagination.page}
            total={pagination.total}
          />


        </MasterPage.ContentDefault>
      </MasterPage>

      <DataTableMobileMenu />
      <DataTableConfirmDeleteDialog />
    </DataTableMenuProvider>
  );
}

