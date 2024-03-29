import type { LoaderFunctionArgs } from "@remix-run/node";
import { makeDomainFunction } from 'domain-functions'
import { ActionFunction, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import { formAction } from '~/form-action.server'
import MasterPage from '~/components/master-page/MasterPage'
import { AuthCookie } from "~/data/auth/user-auth-cookie";
import { Customer } from "./customers._index/route";
import { environmentSchema, pageConfig, schema } from "./customers._index/page-config";
import { CrudBaseRepository, RESOURCE_LIST } from "~/infra/http-client/crud-base-repository";
import { Form } from "./customers._index/Form";

const mutation = makeDomainFunction(schema, environmentSchema)(async (values, { accessToken, id }) =>
  await new CrudBaseRepository(
    RESOURCE_LIST.v1.customer, String(accessToken)
  ).update(id, values)
)

export const action: ActionFunction = async ({ request, params }) => {
  const accessToken = await AuthCookie.requireAuthCookie(request);
  const { id } = params;

  return formAction({
    request,
    schema,
    mutation,
    successPath: pageConfig.path,
    environment: {
      accessToken,
      id: Number(id),
    }
  })
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const accessToken = await AuthCookie.requireAuthCookie(request);
  const { id } = params;

  const formData = await new CrudBaseRepository(
    RESOURCE_LIST.v1.customer, String(accessToken)
  ).findById<Customer>(Number(id))

  return json(formData)
};

export default function Index() {
  const data = useLoaderData<typeof loader>()

  return (
    <MasterPage>
      <MasterPage.ContentFull>
        <MasterPage.FormPageHeader
          title={pageConfig.formEditTitleTxt}
          backButtonLink={pageConfig.path}
        />
        <Form isEditing formData={data}/>
      </MasterPage.ContentFull>
    </MasterPage>
  )
}

