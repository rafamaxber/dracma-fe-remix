import { z } from "zod";
import { routes } from "~/components/navigation/navigationItems";
import { ProductCategoryResponse } from "~/data/category/protocols";
import { FormConfigListType, PageConfigType } from "~/lib/pageConfigTypes";

const entity = 'category';
export const pageConfig: PageConfigType<ProductCategoryResponse> = {
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
  formViewTitleTxt: 'Categoria',
  formEditTitleTxt: 'Editar categoria',
  formCreateTitleTxt: 'Cadastro de categoria',
  formSubtitleTxt: 'Preencha os campos abaixo para cadastrar uma nova categoria',
  listTitleTxt: 'Categorias',
  dataTableColumns: [
    {
      accessorKey: 'name',
      header: 'Categoria',
    },
  ]
}

export const schema = z.object({
  name: z.string().min(2),
  color: z.string().optional(),
  // images: z.instanceof(FileList).optional(),
  images: z.unknown().optional(),
})

export const environmentSchema = z.object({
  accessToken: z.string(),
  id: z.number(),
})

export const environmentSchemaCreate = z.object({
  accessToken: z.string(),
})

export const formConfig: FormConfigListType = [
  {
    sectionTitle: '',
    layout: 'flex-2',
    fields: [{
      name: 'name',
      label: 'Categoria',
      placeholder: 'Bolo',
      className: 'md:w-full'
    }, {
      name: 'color',
      label: 'Cor',
      placeholder: '#000000',
      className: 'md:w-full'
    }, {
      name: 'images',
      label: 'Imagens',
      type: 'file',
      accept: 'image/*',
      className: 'md:w-full'
    }]
  },
]
