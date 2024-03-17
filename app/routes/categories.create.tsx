import { ResultError, makeDomainFunction } from 'domain-functions'
import {
  json,
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createFileUploadHandler as createFileUploadHandler,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  unstable_parseMultipartFormData as parseMultipartFormData,
  ActionFunction,
  LoaderFunctionArgs,
  UploadHandler,
  UploadHandlerPart,
  redirect,
  LinksFunction,
} from "@remix-run/node";
import { useActionData } from "@remix-run/react";

import MasterPage from '~/components/master-page/MasterPage'
import { pageConfig, schema, environmentSchemaCreate } from './categories._index/page-config'
import { Form } from './categories._index/Form'
import { AuthCookie } from '~/data/auth/user-auth-cookie'
import { CategoryCreate } from '~/data/category/category-create'
import { uploadImage } from '~/lib/cloudinary-upload.server';

export const action: ActionFunction = async ({ request }) => {
  const accessToken = await AuthCookie.requireAuthCookie(request);

  const uploadHandler: UploadHandler = composeUploadHandlers(
    async ({
      name,
      filename,
      data,
      contentType
    }) => {
      if (name !== "images") {
        return undefined;
      }

      const uploadedImage = await uploadImage(data);

      return uploadedImage.secure_url;
    }
  )

  console.log("parseMultipartFormData");
  const formData = await parseMultipartFormData(request, uploadHandler);
  const images = formData.getAll("images");

  console.log('images:', images)

  try {
    const result = await new CategoryCreate().create(String(accessToken), {
      name: String(formData.get('name')),
      color: String(formData.get('color')),
      images,
    });

    return redirect(pageConfig.path);
  } catch (error) {
    throw new ResultError({
      errors: [{ message: 'Erro ao criar categoria' }],
    })
  }
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await AuthCookie.requireAuthCookie(request);

  return null;
};

export const links: LinksFunction = () => [
  {
    rel: "preload",
    as: "script",
    href: "https://widget.cloudinary.com/v2.0/global/all.js",
    type: "text/javascript",
  }
]

export default function Index() {
  return (
    <MasterPage>
      <MasterPage.ContentFull>
        <MasterPage.FormPageHeader
          title={pageConfig.listTitleTxt}
          backButtonLink={pageConfig.path}
        />
        <Form encType="multipart/form-data" />

        <button
          id="upload_widget"
          className="cloudinary-button">
            Upload files
        </button>
      </MasterPage.ContentFull>
    </MasterPage>
  )
}
