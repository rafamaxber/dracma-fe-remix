import { makeDomainFunction } from 'domain-functions'
import { ActionFunction, LoaderFunctionArgs } from '@remix-run/node'

import { formAction } from '~/form-action.server'
import MasterPage from '~/components/master-page/MasterPage'
import { schema } from './categories._index/page-config'
import { Form } from './categories._index/Form'
import { AuthCookie } from '~/data/auth/user-cookie'

const mutation = makeDomainFunction(schema)(async (values) => (
  console.log(values) /* or anything else, like saveMyValues(values) */
))

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await AuthCookie.requireAuthCookie(request);

  return null;
};

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
