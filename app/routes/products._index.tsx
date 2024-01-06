import { Label } from "@radix-ui/react-label";
import { MetaFunction } from "@remix-run/node";
import { ColumnDef } from "@tanstack/react-table";
import { ComboBox, ComboBoxListType } from "~/components/combo-box/comboBox";
import { DataTable } from "~/components/data-table/DataTable";
import MasterPage from "~/components/master-page/MasterPage";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

interface Product {
  name: string;
  category: string;
  price: number;
  code: string;
  stock: number;
  id: number;
  image: string;
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

const productsColumnsDefinition: ColumnDef<Product>[] = [
  {
    accessorKey: "image",
    header: "",
    cell: (props) => {
      return (
        <div className="relative overflow-hidden rounded-full size-20">
          <img className="absolute object-cover w-full h-full" src={props.row.getValue('image')} alt={props.row.getValue('name')} loading="lazy" />
        </div>
      )
    }
  },
  {
    accessorKey: "name",
    header: "Nome",
    cell: (props) => {
      return (
        <div className="flex flex-col">
          <span>{props.row.getValue('name')}</span>
          <span className="text-sm text-gray-500">{props.row.original.category}</span>
        </div>
      )
    }
  },
  {
    accessorKey: "price",
    header: "Preço",
    cell: (props) => {
      const amount = parseFloat(props.row.getValue("price"))
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(amount)

      return <span>{formatted}</span>
    }
  },
  {
    accessorKey: "code",
    header: "Código",
  },
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

const statuses: ComboBoxListType[] = [
  {
    value: "backlog",
    label: "Backlog",
  },
  {
    value: "todo",
    label: "Todo",
  },
  {
    value: "in progress",
    label: "In Progress",
  },
  {
    value: "done",
    label: "Done",
  },
  {
    value: "canceled",
    label: "Canceled",
  },
]

export default function Products() {
  const dataProducts = getProductsData();

  return (
    <MasterPage>
      <MasterPage.ContentDefault>
        <h1 className="text-2xl font-semibold text-">Produtos</h1>
        {/* TODO: filtrar principalmente por nome do produto e categoria */}
        <div className="flex gap-2 my-4 filter-bar">
          <div className="w-80">
            <Label className="mb-2 text-sm font-semibold ">Pesquisar:</Label>
            <Input className="w-full" placeholder="Nome do produto..." />
          </div>
          <div className="">
            <Label className="mb-2 text-sm font-semibold">Categoria:</Label>
            <ComboBox options={statuses} />
          </div>
          <Button type="submit" className="h-10">Filtrar</Button>
        </div>

        <div className="border rounded-md">
          <DataTable columns={productsColumnsDefinition} data={dataProducts} />
        </div>
      </MasterPage.ContentDefault>
    </MasterPage>
  );
}
