import { ResultError, makeDomainFunction } from 'domain-functions'
import { ActionFunction, LoaderFunctionArgs } from '@remix-run/node'

import { formAction } from '~/form-action.server'
import MasterPage from '~/components/master-page/MasterPage'
import { pageConfig, schema, environmentSchemaCreate } from './categories._index/page-config'
import { Form } from './categories._index/Form'
import { AuthCookie } from '~/data/auth/user-auth-cookie'
import { CategoryCreate } from '~/data/category/category-create'

const mutation = makeDomainFunction(schema, environmentSchemaCreate)(async (values, { accessToken }) => {
  try {
    const result = await new CategoryCreate().create(accessToken, values);

    return result;
  } catch (error) {
    throw new ResultError({
      errors: [{ message: 'Erro ao criar categoria' }],
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

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await AuthCookie.requireAuthCookie(request);

  return null;
};

export default function Index() {
  return (
    <MasterPage>
      <MasterPage.ContentFull>
        <MasterPage.FormPageHeader
          title={pageConfig.listTitleTxt}
          backButtonLink={pageConfig.path}
        />
        <Form />
      </MasterPage.ContentFull>
    </MasterPage>
  )
}
