import { Link, useActionData, useSearchParams } from "@remix-run/react";
import { redirect, ActionFunction, MetaFunction, LoaderFunction } from "@remix-run/node";
import { z } from "zod";
import { Form } from "~/components/form/Form";
import { UserRepository } from "~/infra/http-client/user-repository";
import { Separator } from "~/components/ui/separator";
import teamImage from './images/img1.svg';
import { ResultError, makeDomainFunction } from "domain-functions";
import { performMutation } from "remix-forms";
import { ForgotPassword } from "~/data/auth/user-forgot-password";
import { AuthCookie } from "~/data/auth/user-auth-cookie";
import Logo from '~/components/logo.svg';

const schema = z.object({
  email: z.string().email().max(60),
});

export const meta: MetaFunction = () => [
  { title: "Dracma - Esqueci minha senha" },
];

const mutation = makeDomainFunction(schema)(async (body) => {

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

export const loader: LoaderFunction = async ({ request }) => {
  await AuthCookie.redirectIfAuthenticated(request);

  return null;
}

export default function Index() {
  const actionData = useActionData<typeof action>();
  const [searchParams] = useSearchParams(new URLSearchParams('success=false'));
  const isSuccessPage = searchParams.get("success") === 'true';

  return (
    <div className="mx-4">
      {
        isSuccessPage && (
          <div className="max-w-[440px] sm:max-w-[1260px] m-auto shadow-2xl overflow-hidden mt-8 px-4 py-3 text-green-700 bg-green-100 border border-green-400 rounded md:mb-8 md:mt-10">
            <strong className="block font-bold">Sucesso!</strong>
            <span className="block sm:inline">
              Enviamos um e-mail para você com as instruções para recuperar sua senha.
            </span>
          </div>
        )
      }
      <div className="max-w-[440px] sm:max-w-[1260px] m-auto rounded-2xl shadow-2xl overflow-hidden md:mt-20 mt-8">
        <div className="flex flex-row justify-center md:min-h-[600px] text-card-foreground">
          <div className="w-full max-w-[400px] md:max-w-none md:w-auto md:flex-[2] pb-10 md:pb-0 bg-card">

            <div className="w-full px-4 m-auto my-8 lg:px-0 lg:w-8/12">
              <img src={Logo} alt="logo" className="left-[-14px] relative w-40 md:w-48" />
            </div>

            <Form
              schema={schema}
              className="w-full px-4 pb-12 m-auto lg:px-0 lg:w-8/12"
              method="post"
            >
              {
                ({ Button, Field, Errors }) => {
                  return (
                    <>
                      <div>
                        <h1 className="text-lg font-semibold md:text-xl">
                          Esqueceu sua senha?
                        </h1>
                        <p className="mt-2 text-sm md:text-sm text-wrap">
                          Não, pode fazer o login aqui {" "}
                          <Link to="/login" className="font-semibold underline text-link">
                            login
                          </Link>
                          {" "} ou {" "}
                          <Link to="/register" className="font-semibold underline text-link">
                            cadastre-se
                          </Link>
                        </p>
                      </div>
                      <Separator orientation="horizontal" className="w-full my-4 md:my-8" />

                      {actionData?.errors && (
                        <Errors />
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
          <div className="bg-black flex-[2] hidden sm:flex justify-center items-center">
            <img src={teamImage} alt="register" className="object-cover h-2/3" />
          </div>
        </div>
      </div>
    </div>
  );
}
