import type { ActionFunction, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, json, useActionData, useLoaderData } from "@remix-run/react";

import { Form } from '~/components/form/Form'

import { useState } from "react";
import { z } from "zod";
import { LuXCircle } from "react-icons/lu";

import MasterPage from "~/components/master-page/MasterPage";
import { ComboBox, ComboBoxListType } from "~/components/combo-box/comboBox";
import { FormCard } from "~/components/form-card/FormCard";
import { Badge } from "~/components/ui/badge";
import { Switch } from "~/components/ui/switch";
import { AuthCookie } from "~/data/auth/user-auth-cookie";
import { CategoryListAll } from "~/data/category/category-list-all";
import { MeasurementUnitsListAll } from "~/data/measurement-units/measurement-units-list-all";
import { ProductCreate } from "~/data/product/product-create";
import { makeDomainFunction } from "domain-functions";
import { formAction } from "~/form-action.server";
import { SupplierListAll } from "~/data/supplier/supplier-list-all";

export const meta: MetaFunction = () => {
  return [
    { title: "Cadastro de Produtos" },
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1, user-scalable=no",
    },
  ];
};

export const environmentSchemaCreate = z.object({
  accessToken: z.string(),
})

const schema = z.object({
  name: z.string(),
  categories: z.array(z.string()).min(1).default([]),
  description: z.string().nullable(),
  barcode: z.string().min(10),
  code: z.string().min(4),
  weight: stringToNumberSchema(),
  unitId: stringToNumberSchema(),
  price_sell: stringToNumberSchema(),
  price_cost: stringToNumberSchema(),
  stock: z.boolean().default(false),
  removeFeedstockFromStock: z.boolean().default(false),
  quantity: stringToNumberSchema(),
  stock_min: stringToNumberSchema().nullable(),
  stock_max: stringToNumberSchema().nullable(),
  canBeResold: z.boolean().default(false),
  manufacturer: z.boolean().default(false),
  // status: z.enum(['active', 'inactive', 'pending', 'blocked']).default('active'),
  supplierId: stringToNumberSchema().nullable(),
  // images: z.array(z.object({
  //   url: z.string(),
  //   main: z.boolean()
  // })).nullable(),
  // stock_event: z.enum(["input", "output"]).nullable(),
  // image_color: z.string().nullable(),
  // fiscal
  // supplier
  // brand
  // model
})

function stringToNumberSchema() {
  return z.string().transform(value => {
    const numberValue = Number(value);
    return z.number().parse(numberValue)
  })
}

const mutation = makeDomainFunction(schema, environmentSchemaCreate)(async (data, { accessToken }) => {

  return new ProductCreate().create(String(accessToken), {
    name: data.name,
    categories: data.categories.map((category) => Number(category)),
    description: String(data?.description),
    barcode: data.barcode,
    code: data.code,
    weight: data.weight,
    unitId: data.unitId ? Number(data.unitId) : null,
    price_sell: data.price_sell,
    price_cost: data.price_cost,
    stock: data.stock,
    stock_min: data.stock_min,
    stock_max: data.stock_max,
    removeFeedstockFromStock: Boolean(data.removeFeedstockFromStock),
    quantity: data.quantity,
    canBeResold: data.canBeResold,
    manufacturer: data.manufacturer,
    status: data.status,
    supplierId: data.supplierId ? Number(data.supplierId) : null,
    images: data?.images || [],
  })
})

export const action: ActionFunction = async ({ request }) => {
  const accessToken = await AuthCookie.requireAuthCookie(request);

  return formAction({
    request,
    schema,
    mutation,
    environment: {
      accessToken
    },
    successPath: '/products',
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
  const categoriesFetcher = new CategoryListAll().listAll(String(accessToken), {
    page: 1,
    perPage: 50
  }).then((data) => data.results.map((category) => ({
    label: category.name,
    value: String(category.id)
  })));
  const supplierFetcher = new SupplierListAll().listAll(String(accessToken), {
    page: 1,
    perPage: 20
  }).then((data) => data.results.map((supplier) => ({
    label: supplier.name,
    value: String(supplier.id)
  })));

  const [units, categories, suppliers] = await Promise.all([unitsFetcher, categoriesFetcher, supplierFetcher] as const);

  return json({ units, categories, suppliers });
};


export default function Index() {
  const data = useActionData<typeof action>();
  const { categories, units, suppliers } = useLoaderData<typeof loader>();
  const [selectedCategoryList, setSelectedCategoryList] = useState<ComboBoxListType[]>([]);
  const [categoriesList, setCategoriesList] = useState<Array<{
    label: string;
    value: string;
  }>>(categories);
  const [selectedUnit, setSelectedUnit] = useState<ComboBoxListType | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<ComboBoxListType | null>(null);
  console.log('Index:action:: ', data)

  function addCategory(category: ComboBoxListType) {
    setSelectedCategoryList([...selectedCategoryList, category])
    setCategoriesList(categoriesList.map((item) => {
      if (item.value === category.value) {
        return { ...item, disabled: true }
      }
      return item
    }))
  }

  function removeCategory(category: ComboBoxListType) {
    const newSelectedCategoryList = selectedCategoryList.filter((item) => item.value !== category.value)
    setSelectedCategoryList(newSelectedCategoryList)
    setCategoriesList(categoriesList.map((item) => {
      if (item.value === category.value) {
        return { ...item, disabled: false }
      }
      return item
    }))
  }

  return (
    <MasterPage>
      <MasterPage.ContentFull>
        <MasterPage.FormPageHeader
          title="Cadastro de Produtos"
          backButtonLink="/products"
        />

        <Form schema={schema} >
          {
            ({ Field, Errors: GErrors, Button, register, Error: GError, setValue, watch }) => {
              const categories = watch('categories')

              return (
              <>
                <GErrors />
                <GError />
                <FormCard className="space-y-3">
                  <FormCard.Title>Identificação</FormCard.Title>
                  <Field name="name" label="Nome:" required placeholder="Nome do produto..." />
                  <Field name="categories" label="Categoria:" required>
                    {
                      ({ Label, Errors, ...props }) => (
                        <>
                          <Label>Categoria:</Label>

                          <ComboBox {...props} label="Escolha as categorias..." options={categoriesList}
                            setSelectedOption={(value) => {
                              addCategory(value)
                              setValue('categories', [...categories, value.value])
                            }}
                          />
                          <div className="mt-2 space-x-1 space-y-1">
                            {
                              selectedCategoryList.map((category) => (
                                <>
                                  <Badge variant="outline" className="cursor-pointer animate-in" key={category.value} onClick={() => removeCategory(category)}>
                                    <LuXCircle className="w-4 h-4 mr-1 ml-[-7px]" />
                                    {category.label}
                                  </Badge>
                                  <input type="hidden" name="categories[]" value={category.value} />
                                </>
                              ))
                            }
                          </div>
                          <Errors />
                        </>
                      )
                    }
                  </Field>
                  <Field name="description" multiline label="Descrição:" placeholder="Texto descrevendo o produto" />
                </FormCard>

                <FormCard>
                  <FormCard.Title>Códigos</FormCard.Title>
                  <div className="flex flex-col gap-4 my-4 md:flex-row">
                    <Field name="barcode" label="Código de barras:" placeholder="000000000" />
                    <Field name="code" label="Código interno / SKU:" placeholder="ABCD0000" />
                  </div>
                </FormCard>

                <FormCard>
                  <FormCard.Title>Medida</FormCard.Title>
                  <div className="flex flex-col gap-4 my-4 md:flex-row">
                    <Field name="weight" label="Peso / Quantidade:" placeholder="000000000" />
                    <Field name="unitId" label="Unidade:">
                      {
                        ({ Label, Errors, ...props }) => (
                          <>
                            <Label>Unidade de medida:</Label>
                            <ComboBox {...props} options={units} selectedOption={selectedUnit} setSelectedOption={setSelectedUnit} />
                            <Errors />
                          </>
                        )
                      }
                    </Field>
                  </div>
                </FormCard>

                <FormCard>
                  <FormCard.Title>Financeiro</FormCard.Title>
                  <div className="flex flex-col gap-4 my-4 md:flex-row">
                    <Field name="price_sell" label="Valor de venda:" required placeholder="R$ 0,00">
                      {
                        ({ Label, Input, Errors }) => (
                          <>
                            <Label className="block mb-2 text-sm font-semibold ">
                              Valor de venda: <Link to="" className="text-[10px] text-blue-600 underline">Precisa de ajuda para calcular?</Link>
                            </Label>
                            <Input />
                            <Errors />
                          </>
                        )
                      }
                    </Field>
                    <Field name="price_cost" label="Valor de custo:" required placeholder="R$ 0,00">
                      {
                        ({ Label, Input, Errors }) => (
                          <>
                            <Label className="block mb-2 text-sm font-semibold ">
                              Valor de custo: <Link to="" className="text-[10px] text-blue-600 underline">Precisa de ajuda para calcular?</Link>
                            </Label>
                            <Input />
                            <Errors />
                          </>
                        )
                      }
                    </Field>
                  </div>
                </FormCard>

                <FormCard>
                  <FormCard.Title>Estoque</FormCard.Title>
                  <div className="space-y-4 md:w-full md:max-w-xs">
                    <Field name="stock">
                      {
                        ({ Label, Errors }) => (
                          <>
                            <div className="flex items-center space-x-2">
                              <Switch {...register('stock')} />
                              <Label>Controlar estoque:</Label>
                            </div>
                            <Errors />
                          </>
                        )
                      }
                    </Field>

                    <Field name="removeFeedstockFromStock">
                      {
                        ({ Label, Errors }) => (
                          <>
                            <div className="flex items-center space-x-2">
                              <Switch {...register('removeFeedstockFromStock')} />
                              <Label>Subtrair estoque de matéria primas</Label>
                            </div>
                            <Errors />
                          </>
                        )
                      }
                    </Field>

                  </div>
                  <Field className="mt-4" name="quantity" label="Quantidade:" required placeholder="0" />
                  <div className="flex flex-col gap-4 my-4 md:flex-row">
                    <Field name="stock_min" label="Estoque mínimo:" required placeholder="0" />
                    <Field name="stock_max" label="Estoque máximo:" required placeholder="0" />
                  </div>
                </FormCard>

                <FormCard>
                  <FormCard.Title>Devolução</FormCard.Title>
                    <Field name="canBeResold">
                      {
                        ({ Label, Errors }) => (
                          <>
                            <div className="flex items-center space-x-2">
                              <Switch {...register('canBeResold')} />
                              <Label>Após uma devolução, é possível revender o produto?</Label>
                            </div>
                          <Errors />
                          </>
                        )
                      }
                    </Field>
                </FormCard>

                <FormCard>
                  <FormCard.Title>Produção</FormCard.Title>
                    <Field name="manufacturer">
                      {
                        ({ Label, Errors }) => (
                          <>
                            <div className="flex items-center space-x-2">
                              <Switch {...register('manufacturer')} />
                              <Label>O produto é de produção própria?</Label>
                            </div>
                            <Errors />
                          </>
                        )
                      }
                    </Field>
                    <Field name="supplierId" label="Fornecedor:" className="mt-4">
                      {
                        ({ Label, Errors, ...props }) => (
                          <>
                            <Label>Qual o fornecedor:</Label>
                            <ComboBox {...props} options={suppliers} selectedOption={selectedSupplier} setSelectedOption={setSelectedSupplier} />
                            <Errors />
                          </>
                        )
                      }
                    </Field>
                </FormCard>


                <div className="w-full max-w-[610px] m-auto mb-4 py-4 bottom-0 sticky">
                  <Button type="submit" className="block w-full" variant="default" size="lg">
                    Salvar
                  </Button>
                </div>
              </>
            )}
          }
        </Form>
      </MasterPage.ContentFull>
    </MasterPage>
  );
}
