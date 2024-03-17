import { z } from "zod"
import { FormCard } from "~/components/form-card/FormCard"
import { Form } from "~/components/form/Form"
import { PageConfigType, FormConfigListType } from "~/lib/pageConfigTypes"
import { ComboBoxListType, SingleComboBox } from "../combo-box/comboBox"
import { Switch } from "../ui/switch"
import { UploadWidget } from "../uploadWidget/UploadWidget"
import { memo, useState } from "react"
import { LuImagePlus, LuUpload } from "react-icons/lu"

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

function ImageUploadWidget({ field, formSetValue }) {
  const [uploadError, setUploadError] = useState(null);
  const [uploadResult, setUploadResult] = useState<Array<{ url?: string}>>([]);

  function handleUpload(error, result) {
    if (error) {
      setUploadError(error);
    } else {
      setUploadResult(prev => [...prev, {
        url: result.info.secure_url,
      }]);
      formSetValue(field.name, [
        ...uploadResult.map(image => image.url),
        result.info.secure_url,
      ])
    }
  }

  return (
    <>
      <UploadWidget onUpload={handleUpload}>
        {({ open }) => (
          <div className="space-x-2">
            <a href="#" onClick={open} className="flex justify-between p-3 px-4 transition rounded-sm shadow-sm cursor-pointer bg-none outline-1 outline-dashed bg-blend-overlay outline-primary hover:outline-2">
              <LuImagePlus size="30" />
              <LuUpload  size="30" />
            </a>
            {uploadError ? <span className="text-red-500">{uploadError}</span> : null}
          </div>
        )}
      </UploadWidget>
      {
        uploadResult.length > 0 ? (
          <div className="flex flex-wrap items-start gap-1 mt-4">
          {
            uploadResult.map((image, index) => {
              if (image?.url) {
                return (
                  <div className="p-4 border-2 rounded-sm shadow-sm w-36 border-primary" key={image.url}>
                    <input
                      type="hidden"
                      name={`${field.name}[${index}]`}
                      value={image.url}
                    />
                    <img src={image.url} alt="Imagem da categoria" />
                  </div>
                )
              }

              return null;
            })
          }
          </div>
        ) : null
      }
    </>
  )
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

                if (field.type === 'image-upload') {
                  return (
                    <Field name={field.name} label={field.label} key={i} className={field.className}>
                      {
                        ({ Label, Errors }) => (
                          <>
                            <Errors />
                            <Label>{field.label}</Label>
                            <ImageUploadWidget field={field} formSetValue={setValue} />
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
