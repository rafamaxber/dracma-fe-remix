import { Form, useNavigation } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { QueryType } from "./route";

interface SearchFormProps {
  query: QueryType;
}
export function SearchForm({
  query,
}: SearchFormProps) {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  const buttonTxt = isLoading ? "Filtrando..." : "Filtrar";

  return (
    <Form replace className="flex flex-col space-y-4 md:gap-4 md:items-end md:flex-row md:w-full md:flex-wrap" method="get">
      <fieldset className={`md:w-full md:max-w-xs`}>
        <Label className="block mb-2 text-sm font-semibold">Pesquisar:</Label>
        <Input name="q" className="w-full" placeholder="Nome categoria/subcategoria" defaultValue={query?.q} />
      </fieldset>

      <div className="flex justify-end md:flex-row">
        <Button type="submit" name="intent" value="search-category" className="h-10 md:w-28">{buttonTxt}</Button>
      </div>
    </Form>
  );
}
