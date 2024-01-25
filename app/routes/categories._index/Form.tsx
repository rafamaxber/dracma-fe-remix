import { EntityForm } from "~/components/form/EntityForm"
import { ProductCategoryResponse } from "~/data/category/protocols"
import { pageConfig, schema, formConfig } from "./page-config"

interface Props {
  isEditing?: boolean,
  formData?: ProductCategoryResponse
}

export const Form = ({ isEditing, formData }: Props) => {
  return (
    <EntityForm<ProductCategoryResponse>
      isEditing={isEditing}
      formData={formData}
      pageConfig={pageConfig}
      schema={schema}
      formConfig={formConfig}
    />
  )
}
