import { makeDomainFunction } from 'domain-functions'
import { ActionFunction } from '@remix-run/node'

import { formAction } from '~/form-action.server'
import MasterPage from '~/components/master-page/MasterPage'
import { pageConfig, schema, Form } from './customers._index'

const mutation = makeDomainFunction(schema)(async (values) => (
  console.log(values) /* or anything else, like saveMyValues(values) */
))

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
