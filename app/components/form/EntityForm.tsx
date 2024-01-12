import { z } from "zod"
import { FormCard } from "~/components/form-card/FormCard"
import { Form } from "~/components/form/Form"
import { PageConfigType, FormConfigListType } from "~/lib/pageConfigTypes"

interface Props<T> {
  isEditing?: boolean,
  formData?: Partial<T>,
  pageConfig: PageConfigType,
  schema: z.ZodObject<any, any>,
  formConfig: FormConfigListType
}

export function EntityForm<T>({
  formData,
  isEditing = false,
  pageConfig,
  schema,
  formConfig,
}: Props<T>) {
  const customFormData = {
    submit: isEditing ? pageConfig.updateTxt : pageConfig.createTxt,
    intent: isEditing ? pageConfig.intent.update : pageConfig.intent.create,
  }

  function Layout({ type, children }: { type: string, children: React.ReactNode }) {
    if (type === 'flex-2') {
      return (
        <div className='flex-wrap gap-4 space-y-4 md:space-y-0 md:flex'>
          {children}
        </div>
      )
    }

    return children;
  }

  return (
    <Form schema={schema} values={formData}>
      {({ Field, Button, submit }) => {
        const isLast = (index: number) => index === formConfig.length - 1

        return (
          formConfig.map((row, i) => (
            <FormCard className='space-y-4 ' key={i}>
              {row?.sectionTitle && <FormCard.Title>{row.sectionTitle}</FormCard.Title>}
              <Layout type={row.layout}>
                {row.fields.map((field, i) => {
                  const isMultiline = field.type === 'textarea'

                  return (
                    <Field
                      multiline={isMultiline}
                      className={field.className}
                      name={field.name}
                      label={field.label}
                      type={field?.type || 'text'}
                      placeholder={field.placeholder}
                      key={i}
                      onKeyDown={(event) => {
                        if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
                          isMultiline && submit()
                        }
                      }}
                    />
                  )
                })}
              </Layout>

              {
                isLast(i) && (
                  <div className="flex justify-end">
                    <Button type="submit" className="mt-2" name="intent" value={customFormData.intent}>
                      {customFormData.submit}
                    </Button>
                  </div>
                )
              }
            </FormCard>
          ))
        )
      }}
    </Form>
  )
}
