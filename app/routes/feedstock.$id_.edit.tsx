import { ActionFunction, LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import MasterPage from "~/components/master-page/MasterPage";
import { AuthCookie } from "~/data/auth/user-auth-cookie";
import { pageConfig, schema, environmentSchema, FeedstockType } from "./feedstock._index/page-config";
import { Form } from "./feedstock._index/Form";
import { makeDomainFunction,  } from "domain-functions";
import { formAction } from "~/form-action.server";
import { CrudBaseRepository, RESOURCE_LIST } from "~/infra/http-client/crud-base-repository";
import { MeasurementUnitsListAll } from "~/data/measurement-units/measurement-units-list-all";
import { SupplierListAll } from "~/data/supplier/supplier-list-all";
import z from "zod";

const mutation = makeDomainFunction(schema, environmentSchema)(async (values, { accessToken, id }) => {
  return new CrudBaseRepository(
    RESOURCE_LIST.v1.feedstock, String(accessToken)
  ).update<z.infer<typeof schema>>(id, {
    name: String(values?.name || ''),
    description: String(values?.description || ''),
    unitId: Number(values.unitId),
    supplierId: Number(values.supplierId),
    price: Number(values.price),
    isFeedstock: Boolean(values.isFeedstock),
    quantity: Number(values.quantity),
    stockQuantity: Number(values.stockQuantity || 0),
  }).catch((error) => {
    const dataMessage = error.response.data?.message;
    console.log('error.response.data:: ', dataMessage);
    throw dataMessage;
  });
})

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
  });
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const accessToken = await AuthCookie.requireAuthCookie(request);
  const { id } = params;

  const feedStockFetcher = new CrudBaseRepository(
    RESOURCE_LIST.v1.feedstock, String(accessToken)
  ).findById<FeedstockType>(Number(id))

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

  const [formData, units, suppliers] = await Promise.all([feedStockFetcher, unitsFetcher, supplierFetcher] as const);

  return json({ data: formData, units, suppliers });
};

export default function Index() {
  const { units, suppliers, data } = useLoaderData<typeof loader>();

  return (
    <MasterPage>
      <MasterPage.ContentFull>
        <MasterPage.FormPageHeader
          title={pageConfig.formEditTitleTxt}
          backButtonLink={pageConfig.path}
        />
        <Form
          isEditing={true}
          formData={data}
          formBuilderData={{ unitId: units, supplierId: suppliers }}
        />
      </MasterPage.ContentFull>
    </MasterPage>
  )
}


