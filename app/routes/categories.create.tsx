import { ResultError, makeDomainFunction } from 'domain-functions'
import { ActionFunction, LoaderFunctionArgs, json,   unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  unstable_parseMultipartFormData as parseMultipartFormData,
  UploadHandler,
  redirect, } from '@remix-run/node'
import { getFieldsetProps, getFormProps, getInputProps, useField, useForm, useInputControl } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import MasterPage from '~/components/master-page/MasterPage'
import { pageConfig, schema, environmentSchemaCreate } from './categories._index/page-config'
import { AuthCookie } from '~/data/auth/user-auth-cookie'
import { CategoryCreate } from '~/data/category/category-create'
import { Form, useActionData, useSubmit } from '@remix-run/react'
import { Error } from '~/components/form/Error'
import { Field } from '~/components/form/Field';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import { FormCard } from '~/components/form-card/FormCard';
import { Button } from '~/components/ui/button';
import { Layout } from '~/components/form/Layout';
import { uploadImage } from '~/lib/upload.cloudinary.server';
import React, {useEffect, useState} from 'react';
import {useDropzone} from 'react-dropzone-esm';
const mutation = makeDomainFunction(schema, environmentSchemaCreate)(async (values, { accessToken }) => {
  try {
    const result = await new CategoryCreate().create(accessToken, values);

    return result;
  } catch (error) {
    throw new ResultError({
      errors: [{ message: 'Erro ao criar categoria' }],
    })
  }
})

export const action: ActionFunction = async ({ request }) => {
  const accessToken = await AuthCookie.requireAuthCookie(request);

  const uploadHandler: UploadHandler = composeUploadHandlers(
    async ({ name, data }) => {
      if (name !== "images") {
        return undefined;
      }

      const uploadedImage = await uploadImage(data);
      return uploadedImage.secure_url;
    },
    createMemoryUploadHandler(),
  );

  const formData = await parseMultipartFormData(request, uploadHandler);
  const result = parseWithZod(formData, { schema });

  if (result.status !== 'success') {
    return json(result.reply())
  }

  const payload = {
    name: result.value.name,
    color: result.value.color,
    images: [String(result.value.images)],
  }

  try {
    await new CategoryCreate().create(String(accessToken), payload);

    return redirect(pageConfig.path);
  } catch (error) {
    return {
      payload,
      formErrors: ['Failed to create category. Please try again later.'],
      fieldErrors: {},
    };
  }
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await AuthCookie.requireAuthCookie(request);

  return null;
};

export default function Index() {
  const submit = useSubmit();
  const [files, setFiles] = useState([]);
  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm({
    // onSubmit: (event, { formData }) => {
    //   event.preventDefault();

    //   if (files) {
    //     formData.append("images", files[0]);
    //   }

    //   // submit(formData, {
    //   //   method: "post",
    //   //   encType: "multipart/form-data",
    //   // });
    // },
    lastResult,

    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },

    // shouldValidate: 'onBlur',
    // shouldRevalidate: 'onInput',
  });

  return (
    <MasterPage>
      <MasterPage.ContentFull>
        <MasterPage.FormPageHeader
          title={pageConfig.listTitleTxt}
          backButtonLink={pageConfig.path}
        />

        <Form {...getFormProps(form)} encType='multipart/form-data' id={form.id} method='POST'>
          <FormCard>
            <Layout type="flex-2">
              <FieldInput
                label="Nome:"
                field={fields.name}
              />

              <FieldInput
                label="Cor:"
                field={fields.color}
                type='color'
              />

              <Field {...getFieldsetProps(fields.images)}>
                <Label htmlFor={fields.images.id}>Imagem:</Label>
                <Uploader {...getInputProps(fields.images, { type: 'file' })} files={files} setFiles={setFiles} accept='image/*' />
                {/* <Input {...getInputProps(fields.images, { type: 'file' })} accept='image/*' /> */}
                {fields.images.errors && (
                  <Error>{fields.images.errors}</Error>
                )}
              </Field>
            </Layout>

            <div className="flex justify-end">
              <Button type="submit" form={form.id} className="mt-2" name="intent" value={pageConfig.intent.create}>
                {pageConfig.createTxt}
              </Button>
            </div>
          </FormCard>

        </Form>

      </MasterPage.ContentFull>
    </MasterPage>
  )
}


function FieldInput({ label, field, type = 'text'}) {
  return (
    <Field {...getFieldsetProps(field)}>
      <Label htmlFor={field.id}>{label}</Label>
      <Input {...getInputProps(field, { type })} />
      {field.errors && (
        <Error>{field.errors}</Error>
      )}
    </Field>
  )
}

function Uploader({ files, setFiles, ...props }) {
  const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16
  };

  const thumb = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
    padding: 4,
    boxSizing: 'border-box'
  };

  const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
  };

  const img = {
    display: 'block',
    width: 'auto',
    height: '100%'
  };

  const [meta] = useField(props.name);
	const control = useInputControl(meta);

  const {getRootProps, getInputProps} = useDropzone({
    accept: {
      'image/*': []
    },
    onDrop: acceptedFiles => {
      control.change(acceptedFiles as string[]);
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
    }
  });

  const thumbs = files.map(file => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img
          src={file.preview}
          style={img}
          // Revoke data uri after image is loaded
          onLoad={() => { URL.revokeObjectURL(file.preview) }}
        />
      </div>
    </div>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach(file => URL.revokeObjectURL(file.preview));
  }, []);

  return (
    <section className="container">
      <div {...getRootProps({className: 'dropzone'})}>
        <input {...getInputProps()} {...props} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside style={thumbsContainer}>
        {thumbs}
      </aside>
    </section>
  );
}
