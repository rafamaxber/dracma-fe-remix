import { Separator } from "@radix-ui/react-separator";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useLoaderData, useSearchParams } from "@remix-run/react";
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
import { AuthCookie } from "~/data/auth/user-auth-cookie";
import { CategoryListAll } from "~/data/category/category-list-all";
import { ProductCategoryResponse } from "~/data/category/protocols";
import { CategoryDeleteById } from "~/data/category/category-delete-by-id";
import { pageConfig } from "./page-config";

export interface Category {
  category: string;
  sub_category: string;
  id: number;
}

export interface QueryType extends PaginationType {
  q?: string;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const accessToken = await AuthCookie.requireAuthCookie(request);

  if (String(request.method).toLocaleLowerCase() === "delete") {
    const formData = await request.formData();
    const id = formData.get("id");

    if (id) {
      return new CategoryDeleteById().delete(String(accessToken), +id)
    }
  }

  return null;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const accessToken = await AuthCookie.requireAuthCookie(request);

  const url = request.url;
  const searchParams = new URL(url).searchParams;

  const result = await new CategoryListAll().listAll(String(accessToken), {
    name: String(searchParams.get('q') || ''),
    page: Number(searchParams.get('page') || 1),
    perPage: Number(searchParams.get('perPage') || 10),
  });

  return json(result);
};

const productsColumnsDefinition: ColumnDef<ProductCategoryResponse>[] = [
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
  const { results, pagination } = useLoaderData<typeof loader>();
  const [query] = useSearchParams();

  return (
    <DataTableMenuProvider editionPathPrefix={pageConfig.path}>
      <MasterPage>
        <MasterPage.ContentDefault>

          <MasterPage.HeaderDefault title={pageConfig.listTitleTxt}>
            <Button asChild variant="outline" className="justify-start">
              <Link to={`${pageConfig.path}/create`} prefetch="intent">
                <LuPlusCircle className="mr-4"/> {pageConfig.createBtnTxt}
              </Link>
            </Button>
          </MasterPage.HeaderDefault>

          <Separator className="my-4" />

          <FilterBar filterForm={
            <SearchForm query={{
              q: query.get('q') || '',
            }} />
          }/>

          <div className="border rounded-md">
            <DataTable columns={productsColumnsDefinition} data={results} />
          </div>

          <Pagination
            page={pagination.page}
            total={pagination.total}
            perPage={pagination.perPage}
          />

        </MasterPage.ContentDefault>
      </MasterPage>

      <DataTableMobileMenu />
      <DataTableConfirmDeleteDialog />
    </DataTableMenuProvider>
  );
}
