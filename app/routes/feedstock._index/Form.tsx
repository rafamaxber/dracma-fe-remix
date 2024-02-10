import { z } from "zod"
import { EntityForm } from "~/components/form/EntityForm"
import { formConfig, pageConfig, schema } from "./page-config"

interface Props {
  isEditing?: boolean,
  formData?: Partial<z.infer<typeof schema>>
  formBuilderData?: {
    [keyName: string]: { label: string, value: string }[],
  }
}

export const Form = ({ isEditing, formData, formBuilderData }: Props) => {
  return (
    <EntityForm
      isEditing={isEditing}
      formData={formData}
      formBuilderData={formBuilderData}
      pageConfig={pageConfig}
      schema={schema}
      formConfig={formConfig}
    />
  )
}
