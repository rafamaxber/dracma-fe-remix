import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import { useRef, useState } from "react";
import { z } from "zod";
import { ComboBox, ComboBoxListType } from "~/components/combo-box/comboBox";
import { FormCard } from "~/components/form-card/FormCard";
import MasterPage from "~/components/master-page/MasterPage";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";

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
  code: z.number(),
  sku: z.string().nullable(),
  weight: z.string().nullable(),
  unit: z.string().nullable(),
  sale_value: z.string(),
  cost_value: z.string(),
  finished_product: z.boolean().default(false),
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
  const data = Object.fromEntries(await request.formData())
  const result = schema.safeParse(data);
  console.log(data)
console.log(JSON.stringify(result))
  return result;
};


// export const loader = async ({ request }: LoaderFunctionArgs) => {
//   return null;
// };



export default function Index() {
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<ComboBoxListType | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<ComboBoxListType | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<ComboBoxListType | null>(null);
  const categories = [{
    value: "1",
    label: "Categoria 1"
  }, {
    value: "2",
    label: "Categoria 2"
  }, {
    value: "3",
    label: "Categoria 3"
  }];
  const subCategories = [{
    value: "1",
    label: "Sub-Categoria 1"
  }, {
    value: "2",
    label: "Sub-Categoria 2"
  }, {
    value: "3",
    label: "Sub-Categoria 3"
  }];
  const units = [
    {
      value: "kg",
      label: "kg"
    }, {
      value: "gr",
      label: "gr"
    },
    {
      value: "unidades",
      label: "unidades"
    }
  ]


  function handleChangeSwitch(field: string) {
    return (value: boolean) => {
      console.log(field, value)
    }
  }

  return (
    <MasterPage>
      <MasterPage.ContentFull>
        <MasterPage.FormPageHeader
          title="Cadastro de Produtos"
          backButtonLink="/products"
        />

        <Form ref={formRef} method="post" className="px-2">

          <FormCard>
            <FormCard.Title>Identificação</FormCard.Title>
            <fieldset className="flex-grow w-full">
              <Label className="block mb-2 text-sm font-semibold ">Nome:</Label>
              <Input required name="name" className="w-full" placeholder="Nome do produto..." />
            </fieldset>
            <div className="flex flex-col gap-4 my-4 md:flex-row">
              <fieldset className="md:w-full md:max-w-xs">
                <Label className="block mb-2 text-sm font-semibold ">Categoria:</Label>
                <ComboBox selectedOption={selectedCategory} name="category" setSelectedOption={setSelectedCategory} options={categories} />
              </fieldset>
              <fieldset className="md:w-full md:max-w-xs">
                <Label className="block mb-2 text-sm font-semibold ">Sub-Categoria:</Label>
                <ComboBox selectedOption={selectedSubCategory} name="sub_category" setSelectedOption={setSelectedSubCategory} options={subCategories} />
              </fieldset>
            </div>
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
            <Button type="submit" className="block w-full" variant="default" disabled size="lg">
              Salvar
            </Button>
          </div>
        </Form>
      </MasterPage.ContentFull>
    </MasterPage>
  );
}
