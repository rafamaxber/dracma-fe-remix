import { makeDomainFunction } from 'domain-functions'
import { ActionFunction } from '@remix-run/node'

import { formAction } from '~/form-action.server'
import MasterPage from '~/components/master-page/MasterPage'
import { schema } from './categories._index/page-config'
import { Form } from './categories._index/Form'

const mutation = makeDomainFunction(schema)(async (values) => (
  console.log(values) /* or anything else, like saveMyValues(values) */
))

export const action: ActionFunction = async ({ request }) =>
  formAction({
    request,
    schema,
    mutation,
    successPath: '/categories',
  })

export default function Index() {
  return (
    <MasterPage>
      <MasterPage.ContentFull>
        <MasterPage.FormPageHeader
          title="Criar categoria"
          backButtonLink="/categories"
        />
        <Form />
      </MasterPage.ContentFull>
    </MasterPage>
  )
}
