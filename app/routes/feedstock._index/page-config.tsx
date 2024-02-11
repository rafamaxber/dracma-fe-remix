import { z } from "zod";
import { routes } from "~/components/navigation/navigationItems";
import { FormConfigListType, PageConfigType } from "~/lib/pageConfigTypes";

export interface FeedstockType {
  id: number;
  name: string;
  description: string;
  unitId: number;
  quantity: number;
  stockQuantity: number;
  supplierId: number;
  price: number;
  isFeedstock: boolean;
}

export interface FeedstockTypeList extends FeedstockType {
  supplier: {
    id: number;
    name: string;
  },
  unit: {
    id: number;
    name: string;
  }
}

export interface QueryType {
  name: string;
}

const entity = 'feedstock';
export const pageConfig: PageConfigType<FeedstockTypeList> = {
  entity: entity,
  path: routes.feedstock,
  createBtnTxt: 'Novo insumo',
  updateTxt: 'Atualizar',
  createTxt: 'Criar insumo',
  intent: {
    create: `create-${entity}`,
    update: `update-${entity}`,
    delete: `delete-${entity}`,
    search: `search-${entity}`,
  },
  formViewTitleTxt: 'Visualizar insumo',
  formEditTitleTxt: 'Editar insumo',
  formCreateTitleTxt: 'Cadastro de insumo',
  formSubtitleTxt: 'Preencha os campos abaixo para cadastrar uma nova insumo',
  listTitleTxt: 'Insumos',
  dataTableColumns: [
    {
      accessorKey: 'name',
      header: 'Nome',
      cell: (props) => {
        const { name, supplier: { name: supplierName } } = props.row.original;

        return (
          <>
            <div className="mb-1 font-medium">{name}</div>
            <div className="text-xs">{supplierName}</div>

          </>
        )
      }
    },
    {
      accessorKey: 'stockQuantity',
      header: 'Quantidade',
    },
    {
      accessorKey: 'price',
      header: 'Preço de compra',
    },
    {
      accessorKey: 'isFeedstock',
      header: 'É materia prima?',
      cell: (props) => {
        const { isFeedstock } = props.row.original;
        return isFeedstock ? 'Sim' : 'Não'
      }
    },
    {
      accessorKey: 'quantidade e peso',
      header: 'Quantidade unitária',
      cell: (props) => {
        const { quantity, unit: { name: unitName } } = props.row.original;

        return `${quantity}${unitName}`
      }
    },
  ]
}

export const environmentSchemaCreate = z.object({
  accessToken: z.string(),
})

export const environmentSchema = z.object({
  accessToken: z.string(),
  id: z.number(),
})

export const schema = z.object({
  name: z.string().min(3),
  supplierId: z.number().int().min(0).optional(),
  description: z.string().min(3).max(252).optional(),
  isFeedstock: z.boolean().optional(),
  stockQuantity: z.number().int().positive(),
  quantity: z.number().int().positive(),
  unitId: z.number().int().min(0),
  price: z.number().gt(0),
})

export const formConfig: FormConfigListType = [
  {
    sectionTitle: 'Identificação',
    layout: 'flex-2',
    fields: [{
      name: 'name',
      label: 'Nome',
      placeholder: 'Pré-mistura de borracha',
      className: 'md:w-full'
    },
    {
      name: 'price',
      label: 'Preço de compra',
      type: 'number',
      className: 'flex-[2]'
    },
    {
      name: 'supplierId',
      label: 'Fornecedor',
      placeholder: 'jose@silva.com',
      type: 'combobox',
      className: 'flex-[2]'
    },
    {
      name: 'description',
      label: 'Descrição',
      placeholder: '',
      type: 'textarea',
    },
    {
      name: 'isFeedstock',
      label: 'É materia prima?',
      type: 'switch',
      className: 'w-full'
    },
  ]
  },
  {
    sectionTitle: 'Estoque',
    layout: 'flex-2',
    fields: [
    {
      name: 'stockQuantity',
      label: 'Quantidade',
      placeholder: '230',
      type: 'number',
      className: 'w-full'
    },
    {
      name: 'quantity',
      label: 'Peso/Quantidade',
      placeholder: '+55 11 99999-9999',
      type: 'number',
      className: 'flex-[2]'
    },
    {
      name: 'unitId',
      label: 'Unidade de medida',
      placeholder: 'jose@silva.com',
      type: 'combobox',
      className: 'flex-[2]'
    },
  ]
  },
]
