import { useEffect } from "react";
import { Form, useNavigation } from "@remix-run/react";
import { classnames, display } from 'tailwindcss-classnames';
import { ComboBox, useComboBox, ComboBoxListType } from "~/components/combo-box/comboBox";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { LuSettings2 } from "react-icons/lu";
import { Label } from "~/components/ui/label";
import { QueryType } from "./route";

interface SearchFormProps {
  showPartial?: boolean;
  onOpenFullForm?: () => void;
  query: QueryType;
  categoryDataList: ComboBoxListType[]
}

export function SearchForm({
  showPartial = false, onOpenFullForm, query, categoryDataList
}: SearchFormProps) {
  const { selectedOption, setSelectedOption } = useComboBox();
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  const buttonTxt = isLoading ? "Filtrando..." : "Filtrar";

  const hidden = classnames(
    display({ 'hidden': showPartial })
  );

  useEffect(() => {
    if (query?.category) {
      const category = categoryDataList.find((status) => status.value === query.category);
      category && setSelectedOption(category);
    }
  }, []);

  return (
    <Form replace className="flex flex-col space-y-4 md:gap-4 md:items-end md:flex-row md:w-full md:flex-wrap" method="get">
      <fieldset className="md:w-full md:max-w-xs">
        <Label className="block mb-2 text-sm font-semibold ">Pesquisar:</Label>
        <Input name="name" className="w-full" placeholder="Nome do produto..." defaultValue={query?.name} />
      </fieldset>

      <fieldset className={`md:w-full md:max-w-xs ${hidden}`}>
        <Label className="block mb-2 text-sm font-semibold">Categoria:</Label>
        <ComboBox selectedOption={selectedOption} setSelectedOption={setSelectedOption} options={categoryDataList} />
        <input type="hidden" name="category" value={selectedOption?.value} defaultValue={query?.category} />
      </fieldset>

      <fieldset className={`md:w-full md:max-w-xs ${hidden}`}>
        <Label className="block mb-2 text-sm font-semibold ">Código:</Label>
        <Input name="code" className="w-full" placeholder="1234567" defaultValue={query?.code} />
      </fieldset>

      <div className="flex flex-row-reverse justify-end md:flex-row">
        <Button type="submit" variant="outline" name="intent" value="search-product" className="sticky bottom-0 left-0 w-full h-10 md:w-28">{buttonTxt}</Button>
        {showPartial && <Button variant="link" type="button" onClick={onOpenFullForm} className="flex items-center px-4 py-2 text-blue-500 underline">
          <LuSettings2 className="mr-2" /> Mais Filtros
        </Button>}
      </div>
    </Form>
  );
}
