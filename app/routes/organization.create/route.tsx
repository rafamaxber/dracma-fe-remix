import { Link, useActionData, MetaFunction } from "@remix-run/react";
import { redirect, type ActionFunction, LoaderFunctionArgs } from "@remix-run/node";
import { z } from "zod";
import { Form } from "~/components/form/Form";
import { Separator } from "~/components/ui/separator";
import teamImage from './images/img1.svg';
import { ResultError, makeDomainFunction } from "domain-functions";
import { performMutation } from "remix-forms";
import { AuthCookie } from "~/data/auth/user-cookie";
import { CompanyRepository } from "~/infra/http-client/company-repository";
import { CompanyCreate } from "~/data/company/company-create";

const schema = z.object({
  companyName: z.string().min(3).max(32).nullable(),
  role: z.string().min(3).max(32).nullable(),
});

export const meta: MetaFunction = () => [
  { title: "Dracma - Criar organização" },
];

const mutation = (accessToken: string) => (
  makeDomainFunction(schema)(async (body) => {
    try {
      await new CompanyCreate().create(accessToken, body)
    } catch (error) {
      throw new ResultError({
        errors: [{ message: 'Usuario já cadastrado' }],
      })
    }
  })
)

export const action: ActionFunction = async ({ request }) => {
  const accessToken = await AuthCookie.requireAuthCookie(request);

  const result = await performMutation({ request, schema, mutation: mutation(String(accessToken)) })

  if (result.success) {
    return redirect("/")
  }

  return new Response(JSON.stringify(result), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  })
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await AuthCookie.requireAuthCookie(request);

  return null;
};

export default function Index() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="max-w-[1260px] m-auto px-6">
      <div className="flex flex-row justify-center shadow-2xl md:min-h-[600px] md:mt-20 mt-8">
        <div className="bg-white rounded-l-lg w-full md:w-auto md:flex-[2] flex py-10 md:py-0">
          <Form
            schema={schema}
            className="w-full px-4 m-auto lg:px-0 lg:w-8/12"
            method="post"
          >
            {
              ({ Button, Field, Errors }) => {
                return (
                  <>
                    <div className="text-center">
                      <h1 className="text-xl font-semibold md:text-3xl">
                        Crie uma nova organização
                      </h1>
                      <p className="mt-2 text-sm md:text-sm text-wrap">
                        Pode ser o nome da sua empresa, time ou projeto.
                        Caso decida incluir mais pessoas, você poderá convidá-las depois.
                      </p>
                      <Separator orientation="horizontal" className="w-full my-4 md:my-8" />
                      <p className="mt-2 text-sm md:text-sm text-wrap">
                        Está tentando entrar em uma organização existente? {' '}
                        <Link to="/organization/join" className="text-blue-500 hover:text-blue-600 hover:underline">
                          Leia mais aqui.
                        </Link>
                      </p>
                    </div>

                    <Separator orientation="horizontal" className="w-full my-4 md:my-8" />

                    {actionData?.errors && (
                      <div className="relative px-4 py-3 text-red-700 bg-red-100 border border-red-400 rounded md:mb-8">
                        <strong className="font-bold">Ops!</strong>
                        <span className="block sm:inline">
                          <Errors />
                        </span>
                      </div>
                    )}

                    <div className="space-y-2 md:space-y-4">
                      <Field name="companyName" label="Nome da empresa, time ou projeto" />
                      <Field name="role" label="Sua função" />
                    </div>

                    <div className="mt-8">
                      <Button className="w-full">Começar</Button>
                    </div>
                  </>
                )
              }
            }
          </Form>
        </div>
        <div className="bg-black flex-[2] rounded-r-lg hidden md:flex justify-center items-center">
          <img src={teamImage} alt="register" className="object-cover h-2/3" />
        </div>
      </div>
    </div>
  );
}
