import { ResultError, makeDomainFunction } from 'domain-functions'
import { ActionFunction, LoaderFunctionArgs } from '@remix-run/node'

import { formAction } from '~/form-action.server'
import MasterPage from '~/components/master-page/MasterPage'
import { AuthCookie } from '~/data/auth/user-auth-cookie'
import { pageConfig, schema, environmentSchemaCreate } from './customers._index/page-config'
import { Form } from './customers._index/Form'
import { CrudBaseRepository, RESOURCE_LIST } from '~/infra/http-client/crud-base-repository'

const mutation = makeDomainFunction(schema, environmentSchemaCreate)(async (values, { accessToken }) => {
  try {
    const result = await new CrudBaseRepository(
      RESOURCE_LIST.v1.customer, String(accessToken)
    ).create(values);

    return result;
  } catch (error) {
    throw new ResultError({
      errors: [{ message: 'Erro ao criar cliente' }],
    })
  }
})

export const action: ActionFunction = async ({ request }) => {
  const accessToken = await AuthCookie.requireAuthCookie(request);

  return formAction({
    request,
    schema,
    mutation: mutation,
    successPath: pageConfig.path,
    environment: {
      accessToken,
    }
  })
}

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
