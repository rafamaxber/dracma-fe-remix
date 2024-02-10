import { z } from "zod"
import { FormCard } from "~/components/form-card/FormCard"
import { Form } from "~/components/form/Form"
import { PageConfigType, FormConfigListType } from "~/lib/pageConfigTypes"
import { ComboBox, ComboBoxListType } from "../combo-box/comboBox"
import { useState } from "react"
import { Switch } from "../ui/switch"

interface Props<T> {
  isEditing?: boolean,
  formData?: Partial<T>,
  pageConfig: PageConfigType,
  schema: z.ZodObject<any, any>,
  formConfig: FormConfigListType,
  formBuilderData?: {
    [keyName: string]: { label: string, value: string }[],
  }
}

export function EntityForm<T>({
  formData,
  formBuilderData,
  isEditing = false,
  pageConfig,
  schema,
  formConfig,
}: Props<T>) {
  const customFormData = {
    submit: isEditing ? pageConfig.updateTxt : pageConfig.createTxt,
    intent: isEditing ? pageConfig.intent.update : pageConfig.intent.create,
  }
  const [selectedComboboxOptions, setSelectedComboboxOptions] = useState({})
  const comboboxDefaultValue = { label: 'Selecione', value: '' }

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
      {({ Field, Errors, Button, submit, register, setValue }) => {
        const isLast = (index: number) => index === formConfig.length - 1

        const formFields = formConfig.map((row, i) => (
          <FormCard className='space-y-4 ' key={i}>
            {row?.sectionTitle && <FormCard.Title>{row.sectionTitle}</FormCard.Title>}
            <Layout type={String(row.layout)}>
              {row.fields.map((field, i) => {
                const isMultiline = field.type === 'textarea'

                if (field.type === 'combobox') {
                  return (
                    <Field name={field.name} label={field.label} key={i} className={field.className}>
                      {
                        ({ Label, Errors }) => (
                          <>
                            <Label>{field.label}</Label>
                            <ComboBox
                              options={formBuilderData && formBuilderData[field.name]}
                              selectedOption={selectedComboboxOptions?.[field.name] || comboboxDefaultValue}
                              setSelectedOption={(value) => {
                                setSelectedComboboxOptions((prev) => ({ ...prev, [field.name]: value }))
                                setValue(field.name, Number(value.value))
                              }}
                            />
                            <Errors />
                            <input type="hidden" {...register(field.name)} />
                          </>
                        )
                      }
                    </Field>
                  )
                }

                if (field.type === 'switch') {
                  return (
                    <Field name={field.name} key={i}>
                      {
                        ({ Label, Errors }) => (
                          <>
                            <div className="flex items-center space-x-2">
                              <Switch {...register(field.name)} />
                              <Label>{field.label}</Label>
                            </div>
                            <Errors />
                          </>
                        )
                      }
                    </Field>
                  )
                }

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

        return (
          <>
            <Errors />
            {formFields}
          </>
        )
      }}
    </Form>
  )
}
