import { z } from "zod";
import { routes } from "~/components/navigation/navigationItems";
import { FormConfigListType, PageConfigType } from "~/lib/pageConfigTypes";

const entity = 'category';
export const pageConfig: PageConfigType = {
  entity: entity,
  path: routes.categories,
  createBtnTxt: 'Nova categoria',
  updateTxt: 'Atualizar',
  createTxt: 'Criar',
  intent: {
    create: `create-${entity}`,
    update: `update-${entity}`,
    delete: `delete-${entity}`,
    search: `search-${entity}`,
  },
  formEditTitleTxt: 'Editar categoria',
  formCreateTitleTxt: 'Cadastro de categoria',
  formSubtitleTxt: 'Preencha os campos abaixo para cadastrar uma nova categoria',
  listTitleTxt: 'Categorias',
  dataTableColumns: [
    {
      accessorKey: 'category',
      header: 'Categoria',
    },
    {
      accessorKey: 'sub_category',
      header: 'Sub-Categoria',
    }
  ]
}

export const schema = z.object({
  category: z.string().min(2),
  sub_category: z.string().min(2).nullable(),
})

export const formConfig: FormConfigListType = [
  {
    sectionTitle: '',
    layout: 'flex-2',
    fields: [{
      name: 'category',
      label: 'Categoria',
      placeholder: 'Bolo',
      className: 'md:w-full'
    },
    {
      name: 'sub_category',
      label: 'Sub-Categoria',
      placeholder: 'Bolo 300gr',
      className: 'md:w-full'
    }]
  },
]
