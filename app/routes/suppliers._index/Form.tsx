import { z } from "zod"
import { EntityForm } from "~/components/form/EntityForm"
import { formConfig, pageConfig, schema } from "./page-config"

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
