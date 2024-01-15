import { Link, useActionData, useLoaderData } from "@remix-run/react";
import { redirect, ActionFunction, MetaFunction, LoaderFunctionArgs, json } from "@remix-run/node";
import { z } from "zod";
import { Form } from "~/components/form/Form";
import { UserRepository } from "~/infra/http-client/user-repository";
import { Separator } from "~/components/ui/separator";
import teamImage from './images/img1.svg';
import { ResultError, makeDomainFunction } from "domain-functions";
import { performMutation } from "remix-forms";
import { ForgotPassword } from "~/data/auth/user-forgot-password";

const schema = z.object({
  email: z.string().email().max(60),
});

export const meta: MetaFunction = () => [
  { title: "Dracma - Esqueci minha senha" },
];

const mutation = makeDomainFunction(schema)(async (body: any) => {

  try {
    const userRepository = new UserRepository();
    const result = await new ForgotPassword(userRepository).execute(body)
    return result;
  } catch (error) {
    throw new ResultError({
      errors: [{ message: 'E-mail incorreto' }],
    })
  }
})

export const action: ActionFunction = async ({ request }) => {
  const result = await performMutation({ request, schema, mutation })

  if (result.success) {
    return redirect("?success=true")
  }

  return new Response(JSON.stringify(result), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  })
}

export const loader = ({ request }: LoaderFunctionArgs) => {
  const url = request.url;
  const searchParams = new URL(url).searchParams;
  const success = searchParams.get("success") || "";

  return json({ success: success === 'true' });
}

export default function Index() {
  const actionData = useActionData<typeof action>();
  const loaderData = useLoaderData<typeof loader>();

  console.log(loaderData);

  return (
    <div className="max-w-[1260px] m-auto px-6">
      {
        loaderData?.success && (
          <div className="px-4 py-3 text-green-700 bg-green-100 border border-green-400 rounded md:mb-8 md:mt-20">
            <strong className="block font-bold">Sucesso!</strong>
            <span className="block sm:inline">
              Enviamos um e-mail para você com as instruções para recuperar sua senha.
            </span>
          </div>
        )
      }
      <div className="flex flex-row justify-center shadow-2xl md:min-h-[600px] md:mt-20 mt-8">
        <div className="bg-white flex-col rounded-l-lg w-full md:w-auto md:flex-[2] flex py-10 md:py-0">
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
                        Esqueceu sua senha?
                      </h1>
                      <p className="mt-2 text-sm md:text-sm text-wrap">
                        Não, pode fazer o login aqui {" "}
                        <Link to="/login" className="text-blue-500 underline text-wrap">
                          login
                        </Link>
                        {" "} ou {" "}
                        <Link to="/register" className="text-blue-500 underline text-wrap">
                          cadastre-se
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
                      <Field name="email" type="email" label="E-mail" />
                    </div>

                    <div className="mt-8">
                      <Button className="w-full">Recuperar senha</Button>
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
