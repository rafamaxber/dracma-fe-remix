import { ResultError, makeDomainFunction } from 'domain-functions'
import { ActionFunction, LoaderFunctionArgs, json } from '@remix-run/node'

import { formAction } from '~/form-action.server'
import MasterPage from '~/components/master-page/MasterPage'
import { AuthCookie } from '~/data/auth/user-auth-cookie'
import { pageConfig, schema, environmentSchemaCreate } from './feedstock._index/page-config'
import { Form } from './feedstock._index/Form'
import { CrudBaseRepository, RESOURCE_LIST } from '~/infra/http-client/crud-base-repository'
import { MeasurementUnitsListAll } from '~/data/measurement-units/measurement-units-list-all'
import { SupplierListAll } from '~/data/supplier/supplier-list-all'
import { useLoaderData } from '@remix-run/react'

const mutation = makeDomainFunction(schema, environmentSchemaCreate)(async (values, { accessToken }) => {
  try {
    const result = await new CrudBaseRepository(
      RESOURCE_LIST.v1.feedstock, String(accessToken)
    ).create(values);

    return result;
  } catch (error) {
    throw new ResultError({
      errors: [{ message: 'Erro ao criar insumo' }],
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
  const accessToken = await AuthCookie.requireAuthCookie(request);
  const unitsFetcher = new MeasurementUnitsListAll().listAll(String(accessToken), {
    page: 1,
    perPage: 20
  }).then((data) => data.results.map((unit) => ({
    label: unit.name,
    value: String(unit.id)
  })));
  const supplierFetcher = new SupplierListAll().listAll(String(accessToken), {
    page: 1,
    perPage: 20
  }).then((data) => data.results.map((supplier) => ({
    label: supplier.name,
    value: String(supplier.id)
  })));

  const [units, suppliers] = await Promise.all([unitsFetcher, supplierFetcher] as const);

  return json({ units, suppliers });
};

export default function Index() {
  const { units, suppliers } = useLoaderData<typeof loader>();

  return (
    <MasterPage>
      <MasterPage.ContentFull>
        <MasterPage.FormPageHeader
          title={pageConfig.createBtnTxt}
          backButtonLink={pageConfig.path}
        />
        <Form formBuilderData={{ unitId: units, supplierId: suppliers }} />
      </MasterPage.ContentFull>
    </MasterPage>
  )
}
