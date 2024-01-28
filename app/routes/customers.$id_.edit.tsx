import type { LoaderFunctionArgs } from "@remix-run/node";
import { makeDomainFunction } from 'domain-functions'
import { ActionFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import { formAction } from '~/form-action.server'
import MasterPage from '~/components/master-page/MasterPage'
import { AuthCookie } from "~/data/auth/user-auth-cookie";
import { Customer } from "./customers._index/route";
import { pageConfig, schema } from "./customers._index/page-config";

interface ResponseType {
  data: Omit<Customer, 'id'>[];
}

const mutation = makeDomainFunction(schema)(async (values) => (
  console.log(values)
))

export const action: ActionFunction = async ({ request }) =>
  formAction({
    request,
    schema,
    mutation,
    successPath: pageConfig.path,
  })

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  await AuthCookie.requireAuthCookie(request);

  const { id } = params;

  const formData = {
    name: 'John Doe',
    email: ''
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
        <Form isEditing={true} formData={data}/>
      </MasterPage.ContentFull>
    </MasterPage>
  )
}
