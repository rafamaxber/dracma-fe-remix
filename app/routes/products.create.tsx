import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, Link, json, useActionData, useLoaderData } from "@remix-run/react";
import { useRef, useState } from "react";
import { z } from "zod";
import { LuXCircle } from "react-icons/lu";

import { ComboBox, ComboBoxListType } from "~/components/combo-box/comboBox";
import { FormCard } from "~/components/form-card/FormCard";
import MasterPage from "~/components/master-page/MasterPage";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import { AuthCookie } from "~/data/auth/user-auth-cookie";
import { CategoryListAll } from "~/data/category/category-list-all";
import { MeasurementUnitsListAll } from "~/data/measurement-units/measurement-units-list-all";
import { ProductCreate } from "~/data/product/product-create";

export const meta: MetaFunction = () => {
  return [
    { title: "Cadastro de Produtos" },
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1, user-scalable=no",
    },
  ];
};

const schema = z.object({
  name: z.string().min(3),
  category: z.string().min(3),
  sub_category: z.string().min(3).nullable(),
  description: z.string().min(3).nullable(),
  code: z.string(),
  sku: z.string().nullable(),
  weight: z.string().nullable(),
  unit: z.string().nullable(),
  sale_value: z.string(),
  cost_value: z.string(),
  // finished_product: z.boolean().default(false),
  control_stock: z.boolean().default(false),
  min_stock: z.number().nullable(),
  subtracts_from_raw_materials: z.boolean().default(false),
  stock_event: z.enum(["input", "output"]).nullable(),
  images: z.array(z.string()).nullable(),
  image_color: z.string().nullable(),
  // fiscal
  // supplier
  // brand
  // model
})

export const action = async ({ request }: ActionFunctionArgs) => {
  const accessToken = await AuthCookie.requireAuthCookie(request);
  const data = Object.fromEntries(await request.formData())
  const result = schema.safeParse(data);
  console.log(data)

  if (!result.success) {
    return json({ error: result.error });
  }

  const product = await new ProductCreate().create(String(accessToken), {
    name: result.data.name,
    category: result.data.category,
    // sub_category: result.data.sub_category,
    description: result.data.description,
    code: result.data.code,
    sku: result.data.sku,
    weight: result.data.weight,
    unit: result.data.unit,
    sale_value: result.data.sale_value,
    cost_value: result.data.cost_value,
    finished_product: result.data.finished_product,
    control_stock: result.data.control_stock,
    // min_stock: result.data.min_stock,
    subtracts_from_raw_materials: result.data.subtracts_from_raw_materials,
    stock_event: result.data.stock_event,
    images: result.data.images,
    image_color: result.data.image_color,

  })

  return json(result);
};

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

  const [units, categories] = await Promise.all([unitsFetcher, categoriesFetcher] as const);

  return json({ units, categories });
};


export default function Index() {
  const data = useActionData<typeof action>();
  const formRef = useRef<HTMLFormElement>(null);
  const { categories, units } = useLoaderData<typeof loader>();
  const [selectedCategoryList, setSelectedCategoryList] = useState<ComboBoxListType[]>([]);
  const [categoriesList, setCategoriesList] = useState<Array<{
    label: string;
    value: string;
  }>>(categories);
  const [selectedUnit, setSelectedUnit] = useState<ComboBoxListType | null>(null);
  console.log('action:: ', data)
  function handleChangeSwitch(field: string) {
    return (value: boolean) => {
      console.log(field, value)
    }
  }

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

        <Form ref={formRef} method="post" className="px-2">

          <FormCard className="space-y-3">
            <FormCard.Title>Identificação</FormCard.Title>
            <fieldset className="flex-grow w-full">
              <Label className="block mb-2 text-sm font-semibold ">Nome:</Label>
              <Input required name="name" className="w-full" placeholder="Nome do produto..." />
            </fieldset>

            <fieldset className="flex-grow w-full">
              <Label className="block mb-2 text-sm font-semibold ">Categoria:</Label>
              <ComboBox selectedOption={{
                label: "Escolha as categorias...",
                value: selectedCategoryList.map((category) => category.value).join(",")
              }} name="category" setSelectedOption={addCategory} options={categoriesList} />
              {Boolean(selectedCategoryList.length) && (
                <div className="mt-2 space-x-1 space-y-1">
                  {
                    selectedCategoryList.map((category) => (
                      <Badge variant="outline" className="cursor-pointer animate-in" key={category.value} onClick={() => removeCategory(category)}>
                        <LuXCircle className="w-4 h-4 mr-1 ml-[-7px]" />
                        {category.label}
                      </Badge>
                    ))
                  }
                </div>
              )}
            </fieldset>

            <fieldset className="w-full">
              <Label className="block mb-2 text-sm font-semibold ">Descrição:</Label>
              <Textarea name="description" className="w-full" placeholder="Texto descrevendo o produto" />
            </fieldset>
          </FormCard>

          <FormCard>
            <FormCard.Title>Códigos</FormCard.Title>
            <div className="flex flex-col gap-4 my-4 md:flex-row">
              <fieldset className="md:w-full md:max-w-xs">
                <Label className="block mb-2 text-sm font-semibold ">Código de barras:</Label>
                <Input required name="code" className="w-full" placeholder="000000000" />
              </fieldset>
              <fieldset className="md:w-full md:max-w-xs">
                <Label className="block mb-2 text-sm font-semibold ">Código interno / SKU:</Label>
                <Input required name="sku" className="w-full" placeholder="ABCD0000" />
              </fieldset>
            </div>
          </FormCard>

          <FormCard>
            <FormCard.Title>Medida</FormCard.Title>
            <div className="flex flex-col gap-4 my-4 md:flex-row">
              <fieldset className="md:w-full md:max-w-xs">
                <Label className="block mb-2 text-sm font-semibold ">Peso / Quantidade:</Label>
                <Input required name="code" className="w-full" placeholder="000000000" />
              </fieldset>
              <fieldset className="md:w-full md:max-w-xs">
                <Label className="block mb-2 text-sm font-semibold ">Unidade:</Label>
                <ComboBox selectedOption={selectedUnit} name="unit" setSelectedOption={setSelectedUnit} options={units} />
              </fieldset>
            </div>
          </FormCard>

          <FormCard>
            <FormCard.Title>Financeiro</FormCard.Title>
            <div className="flex flex-col gap-4 my-4 md:flex-row">
              <fieldset className="md:w-full md:max-w-xs">
                <Label className="block mb-2 text-sm font-semibold ">
                  Valor de venda: <Link to="" className="text-[10px] text-blue-600 underline">Precisa de ajuda para calcular?</Link>
                </Label>
                <Input required name="sale_value" className="w-full" placeholder="R$ 0,00" />
              </fieldset>
              <fieldset className="md:w-full md:max-w-xs">
                <Label className="block mb-2 text-sm font-semibold ">
                  Valor de custo: <Link to="" className="text-[10px] text-blue-600 underline">Precisa de ajuda para calcular?</Link>
                </Label>
                <Input required name="cost_value" className="w-full" placeholder="R$ 0,00" />
              </fieldset>
            </div>
          </FormCard>

          <FormCard>
            <FormCard.Title>Estoque</FormCard.Title>
            <div className="flex flex-col gap-4 my-4 md:flex-row">
              <fieldset className="space-y-4 md:w-full md:max-w-xs">
                <div className="flex items-center space-x-2">
                  <Switch id="control_stock" onCheckedChange={handleChangeSwitch('control_stock')} />
                  <Label className="text-xs" htmlFor="control_stock">Controlar estoque</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="subtracts_from_raw_materials" onCheckedChange={handleChangeSwitch('subtracts_from_raw_materials')} />
                  <Label className="text-xs" htmlFor="subtracts_from_raw_materials">Subtrair estoque de matéria primas</Label>
                </div>
              </fieldset>
              <fieldset className="md:w-full md:max-w-xs">
                <Label className="block mb-2 text-sm font-semibold ">Estoque:</Label>
                <Input required name="name" className="w-full" placeholder="0" />
              </fieldset>
            </div>
          </FormCard>

          <div className="w-full max-w-[610px] m-auto mb-4 py-4 bottom-0 sticky">
            <Button type="submit" className="block w-full" variant="default" size="lg">
              Salvar
            </Button>
          </div>
        </Form>
      </MasterPage.ContentFull>
    </MasterPage>
  );
}
