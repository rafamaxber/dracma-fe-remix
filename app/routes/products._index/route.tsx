import { useState } from "react";
import type { ActionFunctionArgs , LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData, useSearchParams } from "@remix-run/react";
import { LuPlusCircle } from "react-icons/lu";
import { MetaFunction, json } from "@remix-run/node";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "~/components/data-table/DataTable";
import MasterPage from "~/components/master-page/MasterPage";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { FilterBar } from "~/components/filter-bar/FilterBar";
import { SearchForm } from "./SearchForm";
import { formatCurrency } from "~/lib/formatCurrency";
import { Pagination, PaginationType } from "~/components/pagination/Pagination";
import { DataTableMenuProvider } from "~/components/data-table/DataTableContext";
import { DataTableMenu } from "~/components/data-table/DataTableCells";
import { DataTableConfirmDeleteDialog } from "~/components/data-table/DataTableConfirmDeleteDialog";
import { DataTableMobileMenu } from "~/components/data-table/DataTableMobileMenu";
import { AuthCookie } from "~/data/auth/user-auth-cookie";
import { ProductDataTable } from "~/data/product/protocols";
import { ProductListAll } from "~/data/product/product-list-all";
import { Badge } from "~/components/ui/badge";
import { CategoryListAll } from "~/data/category/category-list-all";

export interface QueryType extends PaginationType {
  name?: string;
  category?: string;
  code?: string;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  return null;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const accessToken = await AuthCookie.requireAuthCookie(request);

  const url = request.url;
  const searchParams = new URL(url).searchParams;
  const name = searchParams.get("name") || "";
  const category = searchParams.get("category") || "";
  const code = searchParams.get("code") || "";

  const [data, categoryDataList] = await Promise.all([
    new ProductListAll().listAll(String(accessToken), {
      name,
      category,
      code,
      page: Number(searchParams.get("page")) || 1,
      perPage: Number(searchParams.get("perPage")) || 10,
    }),
    new CategoryListAll().listAll(String(accessToken), {
      page: 1,
      perPage: 200,
    }).then((data) => data.results.map((category) => ({
      label: category.name,
      value: String(category.id),
    })))
  ]);

  return json({...data, categoryDataList });
};

const productsColumnsDefinition: ColumnDef<ProductDataTable>[] = [
  {
    id: "data-view",
    header: "Produto",
    cell: (props) => {
      const { categories, name, image, code, supplier } = props.row.original;

      return (
        <div className="flex items-center justify-between mb-4 space-x-4">
          <span className="relative flex overflow-hidden border rounded-full shadow-sm size-20 shrink-0">
            <img className="" alt={name} src={image}/>
          </span>
          <div className="space-y-2 grow">
            <div className="block font-semibold">{name}</div>
            <div className="block text-sm text-gray-500">{supplier}</div>
            <div className="block text-sm text-gray-500">{code}</div>
            <div className="block text-sm text-gray-500">
              {
                categories.map((category, index) => {
                  return (
                    <Badge variant="outline" key={index} className="mr-2">
                      {category}
                    </Badge>
                  )
                })
              }
            </div>
          </div>
        </div>
      )
    }
  },
  {
    accessorKey: "price_sell",
    header: "Preço de venda",
    cell: (props) => {
      const value = props.row.getValue("price_sell");
      const formatted = value ? formatCurrency({
        value: String(value)
      }) : '-'

      return <span className="block font-semibold text-emerald-600">{formatted}</span>
    }
  },
  {
    accessorKey: "price_cost",
    header: "Preço de custo",
    cell: (props) => {
      const value = props.row.getValue("price_cost");
      const formatted = value ? formatCurrency({
        value: String(value)
      }) : '-'

      return <span className="block font-semibold text-emerald-600">{formatted}</span>
    }
  },
  {
    accessorKey: "stock_quantity",
    header: "Quantidade",
    cell: (props) => {
      const { stock_max, stock_min, stock_quantity } = props.row.original;
      const formatted = stock_quantity || '-'

      if (stock_quantity >= stock_max) {
        return <span className="block font-semibold text-emerald-600">{stock_quantity}</span>
      }

      if (stock_quantity <= stock_min) {
        return <span className="block font-semibold text-red-700">{stock_quantity}</span>
      }

      if (stock_quantity >= (stock_min + 10 ) && stock_quantity <= (stock_max - 10)) {
        return <span className="block font-semibold text-yellow-700">{stock_quantity}</span>
      }

      return <span className="block font-semibold text-red-700">{stock_quantity}</span>

    }
  },
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

export const meta: MetaFunction = () => {
  return [
    { title: "Meus Produtos" },
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1, user-scalable=no",
    },
  ];
};

export default function Index() {
  const [openSheet, setOpenSheet] = useState(false);
  const { pagination, results, categoryDataList } = useLoaderData<typeof loader>();
  const query = useSearchParams();

  function handleToggleSheet() {
    setOpenSheet(!openSheet);
  }

  return (
    <DataTableMenuProvider editionPathPrefix="/products">
      <MasterPage>
        <MasterPage.ContentDefault>
          <MasterPage.HeaderDefault title="Meus Produtos">
            <Button asChild variant="outline" className="justify-start">
              <Link to="/products/create">
                <LuPlusCircle className="mr-4"/> Novo Produto
              </Link>
            </Button>
          </MasterPage.HeaderDefault>

          <Separator className="my-4" />

          <FilterBar filterForm={
            <SearchForm categoryDataList={categoryDataList} query={query} onOpenFullForm={handleToggleSheet} />
          }>
            <FilterBar.Sheet openSheet={openSheet} handleToggleSheet={handleToggleSheet}>
              <SearchForm categoryDataList={categoryDataList} query={query} />
            </FilterBar.Sheet>
          </FilterBar>

          <div className="border rounded-md">
            <DataTable columns={productsColumnsDefinition} data={results} />
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
