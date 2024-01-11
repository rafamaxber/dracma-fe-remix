import { z } from 'zod'
import { makeDomainFunction } from 'domain-functions'
import { ActionFunction } from '@remix-run/node'

import { formAction } from '~/form-action.server'
import { Form } from '~/components/form/Form'
import MasterPage from '~/components/master-page/MasterPage'
import { FormCard } from '~/components/form-card/FormCard'
import { Button } from '~/components/ui/button'
import { Link } from '@remix-run/react'

const schema = z.object({
  category: z.string().min(2),
  sub_category: z.string().min(2).nullable(),
})

const mutation = makeDomainFunction(schema)(async (values) => (
  console.log(values) /* or anything else, like saveMyValues(values) */
))

export const action: ActionFunction = async ({ request }) =>
  formAction({
    request,
    schema,
    mutation,
    successPath: '/categories', /* path to redirect on success */
  })


export default function Index() {
  return (
    <MasterPage>
      <MasterPage.ContentFull>
        <div className="px-2 bg-sky-950 mb-[-38px] md:mb-[-45px]">
          <div className="w-full max-w-[610px] m-auto md:py-4 h-20 md:h-48 flex md:flex-col md:pt-10 justify-between bg-sky-950">
            <Button asChild className="text-xs text-green-400" variant="link">
              <Link className="block text-xs md:hidden" to="/categories">
                Voltar
              </Link>
            </Button>
            <h1 className="mt-3 text-sm text-white md:mt-0 md:text-2xl">Cadastro de Categorias</h1>
          </div>
        </div>
          <Form schema={schema}>
            {({ Field, Button }) => (
              <FormCard className='space-y-4'>
                <Field required name="category" placeholder='Bolos'>
                  {({ Label, SmartInput, Error }) => (
                    <>
                      <Label>
                        <LabelC />
                      </Label>
                      <SmartInput />
                      <Error />
                    </>
                  )}
                </Field>
                <Field name="sub_category" label="Sub-Categoria" placeholder='Bolos 300gr'/>
                <div className="flex justify-end">
                  <Button type="submit" className="mt-2">
                    Salvar
                  </Button>
                </div>
              </FormCard>

            )}
          </Form>
      </MasterPage.ContentFull>
    </MasterPage>
  )
}

function LabelC() {
  return (
    <>
      Categoria<sup className='text-red-600'>*</sup>
    </>
  )
}
