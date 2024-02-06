import { ActionFunction, LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import MasterPage from "~/components/master-page/MasterPage";
import { AuthCookie } from "~/data/auth/user-auth-cookie";
import { pageConfig, schema, environmentSchema } from "./suppliers._index/page-config";
import { SupplierFindById } from "~/data/supplier/supplier-find-by-id";
import { Form } from "./suppliers._index/Form";
import { SupplierUpdateById } from "~/data/supplier/supplier-update-by-id";
import { makeDomainFunction } from "domain-functions";
import { formAction } from "~/form-action.server";

const mutation = makeDomainFunction(schema, environmentSchema)(async (values, { accessToken, id }) =>
  new SupplierUpdateById().update(accessToken, id, values)
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

  const formData = await new SupplierFindById().find(String(accessToken), Number(id))

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


