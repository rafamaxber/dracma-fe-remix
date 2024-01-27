import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import MasterPage from "~/components/master-page/MasterPage";
import { AuthCookie } from "~/data/auth/user-auth-cookie";
import { CategoryFindById } from "~/data/category/category-find-by-id";
import { pageConfig } from "./categories._index/page-config";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

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
          title={pageConfig.formViewTitleTxt}
          backButtonLink={pageConfig.path}
        />
        <Card>
          <CardHeader className="flex justify-between">
            <CardTitle>Categoria:</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between">
            <span>Nome: {data.name}</span>
            <span>Data de criação: {new Date(data.createdAt).toLocaleDateString()}</span>
          </CardContent>
        </Card>
      </MasterPage.ContentFull>
    </MasterPage>
  )
}
