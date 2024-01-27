import { z } from "zod"
import { pageConfig, schema, formConfig } from "./page-config"
import { EntityForm } from "~/components/form/EntityForm"

interface Props {
  isEditing?: boolean,
  formData?: Partial<z.infer<typeof schema>>
}

export const Form = ({ isEditing, formData }: Props) => {
  return (
    <EntityForm
      isEditing={isEditing}
      formData={formData}
      pageConfig={pageConfig}
      schema={schema}
      formConfig={formConfig}
    />
  )
}
