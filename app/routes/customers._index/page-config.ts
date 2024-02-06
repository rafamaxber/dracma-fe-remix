import { z } from "zod";
import { routes } from "~/components/navigation/navigationItems";
import { FormConfigListType, PageConfigType } from "~/lib/pageConfigTypes";

const entity = 'customer';
export const pageConfig: PageConfigType = {
  entity: entity,
  path: routes.customers,
  createBtnTxt: 'Novo cliente',
  updateTxt: 'Atualizar',
  createTxt: 'Criar nova cliente',
  intent: {
    create: `create-${entity}`,
    update: `update-${entity}`,
    delete: `delete-${entity}`,
    search: `search-${entity}`,
  },
  formEditTitleTxt: 'Editar cliente',
  formCreateTitleTxt: 'Cadastro de cliente',
  formSubtitleTxt: 'Preencha os campos abaixo para cadastrar um novo cliente',
  listTitleTxt: 'Clientes',
  dataTableColumns: [
    {
      accessorKey: 'name',
      header: 'Nome',
    },
    {
      accessorKey: 'email',
      header: 'E-mail',
    },
    {
      accessorKey: 'phone',
      header: 'Telefone',
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
  email: z.string().email().nullable(),
  phone: z.string().nullable(),
  document: z.string().nullable(),
  description: z.string().nullable(),
})

export const formConfig: FormConfigListType = [
  {
    sectionTitle: 'Identificação',
    layout: 'flex-2',
    fields: [{
      name: 'name',
      label: 'Nome',
      placeholder: 'José da Silva',
      className: 'md:w-full'
    },
    {
      name: 'email',
      label: 'E-mail',
      placeholder: 'jose@silva.com',
      type: 'email',
      className: 'md:w-full'
    },
    {
      name: 'phone',
      label: 'Telefone',
      placeholder: '+55 11 99999-9999',
      type: 'phone',
      className: 'flex-[2]'
    },
    {
      name: 'document',
      label: 'CPF/CNPJ',
      placeholder: '999.999.999-99',
      type: 'number',
      className: 'flex-[2]'
    },
    {
      name: 'description',
      label: 'Observações',
      placeholder: '',
      type: 'textarea',
    }]
  },
]
