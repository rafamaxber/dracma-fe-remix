import { ResultError, makeDomainFunction } from 'domain-functions'
import { ActionFunction, LoaderFunctionArgs } from '@remix-run/node'

import { formAction } from '~/form-action.server'
import MasterPage from '~/components/master-page/MasterPage'
import { AuthCookie } from '~/data/auth/user-auth-cookie'
import { pageConfig, schema, environmentSchemaCreate } from './suppliers._index/page-config'
import { Form } from './suppliers._index/Form'
import { SupplierCreate } from '~/data/supplier/supplier-create'

const mutation = makeDomainFunction(schema, environmentSchemaCreate)(async (values, { accessToken }) => {
  console
  try {
    const result = await new SupplierCreate().create(accessToken, {
      name: values.name,
      cnpj: values.cnpj,
      email: values.email,
      phone: values.phone,
    });

    return result;
  } catch (error) {
    throw new ResultError({
      errors: [{ message: 'Erro ao criar supplier' }],
    })
  }
})

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await AuthCookie.requireAuthCookie(request);

  return null;
};

export const action: ActionFunction = async ({ request }) => {
  const accessToken = await AuthCookie.requireAuthCookie(request);

  return formAction({
    request,
    schema,
    mutation,
    environment: {
      accessToken,
    },
    successPath: pageConfig.path,
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
