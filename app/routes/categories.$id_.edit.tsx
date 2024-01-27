import type { LoaderFunctionArgs } from "@remix-run/node";
import { makeDomainFunction } from 'domain-functions'
import { ActionFunction, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import { formAction } from '~/form-action.server'
import MasterPage from '~/components/master-page/MasterPage'
import { pageConfig, schema, environmentSchema } from "./categories._index/page-config";
import { Form } from "./categories._index/Form";
import { AuthCookie } from "~/data/auth/user-auth-cookie";
import { CategoryUpdateById } from "~/data/category/category-update-by-id";
import { CategoryFindById } from "~/data/category/category-find-by-id";

const mutation = makeDomainFunction(schema, environmentSchema)(async (values, { accessToken, id }) =>
  new CategoryUpdateById().update(accessToken, id, values)
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

  const formData = await new CategoryFindById().find(String(accessToken), Number(id))

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
        <Form isEditing={true} formData={data}/>
      </MasterPage.ContentFull>
    </MasterPage>
  )
}

