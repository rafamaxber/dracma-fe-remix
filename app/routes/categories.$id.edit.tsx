import type { LoaderFunctionArgs } from "@remix-run/node";
import { makeDomainFunction } from 'domain-functions'
import { ActionFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import { formAction } from '~/form-action.server'
import MasterPage from '~/components/master-page/MasterPage'
import { Category } from "./categories._index/route";
import { pageConfig, schema } from "./categories._index/page-config";
import { Form } from "./categories._index/Form";
import { AuthCookie } from "~/data/auth/user-cookie";

interface ResponseType {
  data: Omit<Category, 'id'>[];
}

const mutation = makeDomainFunction(schema)(async (values) => (
  console.log(values) /* or anything else, like saveMyValues(values) */
))

export const action: ActionFunction = async ({ request }) =>
  formAction({
    request,
    schema,
    mutation,
    successPath: pageConfig.path
  })

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await AuthCookie.requireAuthCookie(request);

  const { id } = params;

  console.log({id})

  const formData = {
    category: 'Bolos',
    sub_category: 'Bolos 300gr',
  }

  return new Response(JSON.stringify({
    data: formData,
  }), {
    headers: {
      "content-type": "application/json",
    },
  })
};



export default function Index() {
  const { data } = useLoaderData<ResponseType>()

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

