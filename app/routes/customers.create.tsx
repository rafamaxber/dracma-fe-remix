import { makeDomainFunction } from 'domain-functions'
import { ActionFunction, LoaderFunctionArgs } from '@remix-run/node'

import { formAction } from '~/form-action.server'
import MasterPage from '~/components/master-page/MasterPage'
import { AuthCookie } from '~/data/auth/user-auth-cookie'
import { pageConfig, schema } from './customers._index/page-config'
import { Form } from './customers._index/Form'

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
    successPath: pageConfig.path,
  })

export default function Index() {
  return (
    <MasterPage>
      <MasterPage.ContentFull>
        <MasterPage.FormPageHeader
          title={pageConfig.createBtnTxt}
          backButtonLink={pageConfig.path}
        />
        <Form />
      </MasterPage.ContentFull>
    </MasterPage>
  )
}
