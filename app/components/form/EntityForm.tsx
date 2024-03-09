import { z } from "zod"
import { FormCard } from "~/components/form-card/FormCard"
import { Form } from "~/components/form/Form"
import { PageConfigType, FormConfigListType } from "~/lib/pageConfigTypes"
import { ComboBoxListType, SingleComboBox } from "../combo-box/comboBox"
import { Switch } from "../ui/switch"
import { Layout } from "./Layout"

interface Props<T> {
  isEditing?: boolean,
  formData?: any,
  pageConfig: PageConfigType<T>,
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
  const comboboxDefaultValue = { label: 'Selecione', value: '' }

  return (
    <Form schema={schema} values={formData}>
      {({ Field, Errors: GErrors, Button, submit, register, setValue }) => {
        const isLast = (index: number) => index === formConfig.length - 1

        const formFields = formConfig.map((row, i) => (
          <FormCard className='space-y-4 ' key={i}>
            {row?.sectionTitle && <FormCard.Title>{row.sectionTitle}</FormCard.Title>}
            <Layout type={String(row.layout)}>
              {row.fields.map((field, i) => {
                const isMultiline = field.type === 'textarea'

                if (field.type === 'switch') {
                  return (
                    <Field name={field.name} key={i}>
                      {
                        ({ Label, Errors, value }) => (
                          <>
                            <div className="flex items-center space-x-2">
                              <Switch {...register(field.name)} defaultChecked={value} onCheckedChange={(value) => {
                                setValue(field.name, value)
                              }} />
                              <Label>{field.label}</Label>
                            </div>
                            <Errors />
                          </>
                        )
                      }
                    </Field>
                  )
                }

                if (field.type === 'combobox') {
                  const defaultSelectedOption = formBuilderData && formBuilderData[field.name]
                    ?.find((option) => option.value === String(formData?.[field.name])) || comboboxDefaultValue
                  return (
                    <Field name={field.name} label={field.label} key={i} className={field.className}>
                      {
                        ({ Label, Errors }) => (
                          <>
                            <Label>{field.label}</Label>
                            <SingleComboBox
                              name={field.name}
                              options={formBuilderData ? formBuilderData[field.name] : [] as ComboBoxListType[]}
                              defaultSelectedOption={defaultSelectedOption}
                              onSelectedOption={(option: ComboBoxListType) => {
                                setValue(field.name, Number(option.value))
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
            <GErrors />
            {formFields}
          </>
        )
      }}
    </Form>
  )
}
