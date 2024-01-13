import { useState } from "react";
import type { ActionFunctionArgs , LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { LuPlusCircle } from "react-icons/lu";
import { MetaFunction } from "@remix-run/node";
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
import { AuthCookie } from "~/data/auth/user-cookie";

interface Product {
  name: string;
  category: string;
  price: number;
  code: string;
  stock: number;
  id: number;
  image: string;
}

interface ResponseType {
  data: Product[];
  query: QueryType;
}

export interface QueryType extends PaginationType {
  name?: string;
  category?: string;
  code?: string;
}

function getProductsData(): Product[] {
  return [
    {
      name: "Produto 1",
      category: "Categoria 1",
      price: 10.0,
      code: "123456",
      stock: 10,
      id: 1,
      image: "https://via.placeholder.com/80",
    },
    {
      name: "Produto 2",
      category: "Categoria 2",
      price: 10.0,
      code: "123456",
      stock: 10,
      id: 2,
      image: "https://via.placeholder.com/80",
    },
    {
      name: "Produto 3",
      category: "Categoria 3",
      price: 10.0,
      code: "123456",
      stock: 10,
      id: 3,
      image: "https://via.placeholder.com/80",
    },
    {
      name: "Produto 4",
      category: "Categoria 4",
      price: 10.0,
      code: "123456",
      stock: 10,
      id: 4,
      image: "https://via.placeholder.com/80",
    },
    {
      name: "Produto 5",
      category: "Categoria 5",
      price: 10.0,
      code: "123456",
      stock: 10,
      id: 5,
      image: "https://via.placeholder.com/80",
    },
    {
      name: "Produto 6",
      category: "Categoria 6",
      price: 10.0,
      code: "123456",
      stock: 10,
      id: 6,
      image: "https://via.placeholder.com/80",
    },
    {
      name: "Produto 7",
      category: "Categoria 7",
      price: 10.0,
      code: "123456",
      stock: 10,
      id: 7,
      image: "https://via.placeholder.com/80",
    },
    {
      name: "Produto 8",
      category: "Categoria 8",
      price: 10.0,
      code: "123456",
      stock: 10,
      id: 8,
      image: "https://via.placeholder.com/80",
    },
    {
      name: "Produto 9",
      category: "Categoria 9",
      price: 10.0,
      code: "123456",
      stock: 10,
      id: 9,
      image: "https://via.placeholder.com/80",
    }
  ]
}

export const action = async ({ request }: ActionFunctionArgs) => {
  return null;
};

export const loader = async ({ request, params, context }: LoaderFunctionArgs) => {
  await AuthCookie.requireAuthCookie(request);

  const url = request.url;
  const searchParams = new URL(url).searchParams;
  const name = searchParams.get("name") || "";

  return new Promise((resolve) => {
    setTimeout(() => {
      const data = name ? getProductsData().filter((product) => product.name.toLowerCase().includes(name.toLowerCase())) : getProductsData();
      const categories = data.map((product) => product.category).filter((category, index, self) => self.indexOf(category) === index);

      resolve(
        new Response(JSON.stringify({
          data,
          categories,
          total: 1000,
          offset: 0,
          limit: 50,
          query: {
            name,
            category: searchParams.get("category") || null,
            code: searchParams.get("code") || null,
            page: searchParams.get("page") || null,
            limit: searchParams.get("limit") || null,
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

const productsColumnsDefinition: ColumnDef<Product>[] = [
  {
    id: "data-view",
    header: "Produto",
    cell: (props) => {
      const { category, name, image, code } = props.row.original;

      return (
        <div className="flex items-center justify-between mb-4 space-x-4">
          <span className="relative flex overflow-hidden rounded-full size-20 shrink-0">
            <img className="w-full h-full aspect-square" alt={name} src={image}/>
          </span>
          <div className="grow">
            <span className="block font-semibold">{name}</span>
            <span className="block text-sm text-gray-500">{category}</span>
            <span className="block text-sm text-gray-500">{code}</span>
          </div>
        </div>
      )
    }
  },
  {
    accessorKey: "price",
    header: "Preço",
    cell: (props) => {
      const formatted = formatCurrency({
        value: props.row.getValue("price")
      })

      return <span className="block font-semibold text-emerald-600">{formatted}</span>
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
  const { data: dataProducts, query } = useLoaderData<ResponseType>();

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
            <SearchForm showPartial query={query} onOpenFullForm={handleToggleSheet} />
          }>
            <FilterBar.Sheet openSheet={openSheet} handleToggleSheet={handleToggleSheet}>
              <SearchForm query={query} />
            </FilterBar.Sheet>
          </FilterBar>

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
