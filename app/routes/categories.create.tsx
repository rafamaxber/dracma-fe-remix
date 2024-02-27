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
} from "@remix-run/node";
import { useActionData } from "@remix-run/react";

import { formAction } from '~/form-action.server'
import MasterPage from '~/components/master-page/MasterPage'
import { pageConfig, schema, environmentSchemaCreate } from './categories._index/page-config'
import { Form } from './categories._index/Form'
import { AuthCookie } from '~/data/auth/user-auth-cookie'
import { CategoryCreate } from '~/data/category/category-create'
import { uploadImage } from '~/lib/cloudinary-upload.server';

const mutation = makeDomainFunction(schema, environmentSchemaCreate)(async (values, { accessToken }) => {
  // console.log('makeDomainFunction:values:', values)
  try {
    // const result = await new CategoryCreate().create(accessToken, values);

    // return result;
  } catch (error) {
    throw new ResultError({
      errors: [{ message: 'Erro ao criar categoria' }],
    })
  }
})

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

//       const fileRoute = await uploadFiles({
//         name,
//         filename,
//         data,
//         contentType,
//         bodyLength
//       })
// console.log('fileRoute => ', fileRoute)
//       return fileRoute.key;

      const uploadedImage = await uploadImage(data);

      return uploadedImage.secure_url;
    }
  )

  console.log("parseMultipartFormData");
  const formData = await parseMultipartFormData(request, uploadHandler);
  const images = formData.getAll("images");

  console.log('images:', images)

  return formAction({
    request,
    schema,
    mutation,
    // transformValues(values) {
    //   console.log('values:', values)
    //   return {
    //     color: values.color || '',
    //     name: values.name || '',
    //     images: values.images || '',
    //   }
    // },
    // successPath: pageConfig.path,
    environment: {
      accessToken,
    },
  })
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await AuthCookie.requireAuthCookie(request);

  return null;
};

export default function Index() {
  return (
    <MasterPage>
      <MasterPage.ContentFull>
        <MasterPage.FormPageHeader
          title={pageConfig.listTitleTxt}
          backButtonLink={pageConfig.path}
        />
        <Form encType="multipart/form-data" />
      </MasterPage.ContentFull>
    </MasterPage>
  )
}
