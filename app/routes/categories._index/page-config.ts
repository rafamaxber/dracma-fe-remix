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
  color: z.string().min(2).optional(),
  images: z.array(z.string()).optional(),
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
      type: 'image-upload',
      name: 'images',
      label: 'Imagens',
      placeholder: 'Seelcione as imagens',
      className: 'md:w-full'
    },{
      type: 'color',
      name: 'color',
      label: 'Cor',
      placeholder: 'Seelcione uma cor',
      className: 'md:w-full'
    }]
  },
]
