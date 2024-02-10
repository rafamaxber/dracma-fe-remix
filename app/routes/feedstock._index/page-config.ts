import { z } from "zod";
import { routes } from "~/components/navigation/navigationItems";
import { FormConfigListType, PageConfigType } from "~/lib/pageConfigTypes";

const entity = 'feedstock';
export const pageConfig: PageConfigType = {
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
      header: 'Preço de compra',
    },
    {
      accessorKey: 'quantidade e peso',
      header: 'Quantidade unitária',
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
  description: z.string().min(3).max(252).optional(),
  unitId: z.number().int().min(0),
  quantity: z.number().int().positive(),
  stockQuantity: z.number().int().positive(),
  supplierId: z.number().int().min(0).optional(),
  price: z.number().gt(0),
  isFeedstock: z.boolean().default(false).optional(),
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
      name: 'supplierId',
      label: 'Fornecedor',
      placeholder: 'jose@silva.com',
      type: 'combobox',
      className: 'w-full'
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
