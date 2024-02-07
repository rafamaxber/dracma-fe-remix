import { useActionData, useLoaderData } from "@remix-run/react";
import { redirect, ActionFunction, MetaFunction, LoaderFunctionArgs, json } from "@remix-run/node";
import { z } from "zod";
import { Form } from "~/components/form/Form";
import { UserRepository } from "~/infra/http-client/user-repository";
import { Separator } from "~/components/ui/separator";
import teamImage from './images/img1.svg';
import { ResultError, makeDomainFunction } from "domain-functions";
import { performMutation } from "remix-forms";
import { ResetPassword } from "~/data/auth/reset-password";
import { AuthCookie } from "~/data/auth/user-auth-cookie";
import { routes } from "~/components/navigation/navigationItems";
import Logo from '~/components/logo.svg';

const schema = z.object({
  password: z.string().min(6).max(32),
  token: z.string().min(6)
});

export const meta: MetaFunction = () => [
  { title: "Dracma - Criar nova senha" },
];

const mutation = makeDomainFunction(schema)(async (body) => {
  try {
    const userRepository = new UserRepository();
    const result = await new ResetPassword(userRepository).execute(body)
    return result;
  } catch (error) {
    throw new ResultError({
      errors: [{ message: 'Não foi possível atualizar sua senha!' }],
    })
  }
})

export const action: ActionFunction = async ({ request }) => {
  const result = await performMutation({ request, schema, mutation })

  if (result.success) {
    return redirect(routes.login)
  }

  return new Response(JSON.stringify(result), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  })
}

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  await AuthCookie.redirectIfAuthenticated(request);
  const { token } = params;
  return json({ token });
}

export default function Index() {
  const actionData = useActionData<typeof action>();
  const { token } = useLoaderData<typeof loader>();

  return (
    <div className="mx-4">
      <div className="max-w-[440px] sm:max-w-[1260px] m-auto rounded-2xl shadow-2xl overflow-hidden md:mt-20 mt-8">
        <div className="flex flex-row justify-center md:min-h-[600px] text-card-foreground">

          <div className="bg-black flex-[2] hidden sm:flex justify-center items-center">
            <img src={teamImage} alt="register" className="object-cover h-2/3" />
          </div>

          <div className="w-full max-w-[400px] md:max-w-none md:w-auto md:flex-[2] pb-10 md:pb-0 bg-card">

            <div className="w-full px-4 m-auto my-8 lg:px-0 lg:w-8/12">
              <img src={Logo} alt="logo" className="left-[-14px] relative w-40 md:w-48" />
            </div>

            <Form
              schema={schema}
              className="w-full px-4 pb-12 m-auto lg:px-0 lg:w-8/12"
              method="post"
              values={{ token }}
            >
              {
                ({ Button, Field, Errors, register }) => {
                  return (
                    <>
                      <div>
                        <h1 className="text-lg font-semibold md:text-xl">
                          Atualize sua senha
                        </h1>
                        <p className="mt-2 text-sm md:text-sm text-wrap">
                          Crie uma nova senha para sua conta
                        </p>
                      </div>
                      <Separator orientation="horizontal" className="w-full my-4 md:my-8" />

                      {actionData?.errors && (
                        <Errors />
                      )}

                      <Field name="password" type="password" label="Senha" />
                      <Field name="token">
                        {() => (
                          <input {...register('token')} defaultValue={token} type="hidden" />
                        )}
                      </Field>

                      <div className="mt-8">
                        <Button className="w-full">Atualizar senha</Button>
                      </div>
                    </>
                  )
                }
              }
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
