import { FormProps, FormSchema, createForm } from 'remix-forms'
// For Remix, import it like this
import { Form as FrameworkForm, useActionData, useSubmit, useNavigation } from '@remix-run/react'
import { Field } from './Field'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Error, Errors } from './Error'

const RemixForm = createForm({ component: FrameworkForm, useNavigation, useSubmit, useActionData })

export function Form<Schema extends FormSchema>(props: FormProps<Schema>) {
  return (
    <RemixForm<Schema>
      className="px-2"
      fieldComponent={Field}
      labelComponent={Label}
      inputComponent={Input}
      buttonComponent={Button}
      errorComponent={Error}
      globalErrorsComponent={Errors}
      // multilineComponent={/* your custom Multiline */}
      // selectComponent={/* your custom Select */}
      // checkboxComponent={/* your custom Checkbox */}
      // checkboxWrapperComponent={/* your custom checkbox wrapper */}
      // fieldErrorsComponent={/* your custom FieldErrors */}
      {...props}
    />
  )
}
