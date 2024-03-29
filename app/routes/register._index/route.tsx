import { Link, useActionData, MetaFunction } from "@remix-run/react";
import { redirect, type ActionFunction, LoaderFunction } from "@remix-run/node";
import { z } from "zod";
import { Form } from "~/components/form/Form";
import { UserRegister } from "~/data/auth/user-register";
import { UserRepository } from "~/infra/http-client/user-repository";
import { Separator } from "~/components/ui/separator";
import teamImage from './images/img1.svg';
import { ResultError, makeDomainFunction } from "domain-functions";
import { performMutation } from "remix-forms";
import { AuthCookie } from "~/data/auth/user-auth-cookie";
import { routes } from "~/components/navigation/navigationItems";
import Logo from '~/components/logo.svg';

const schema = z.object({
  firstName: z.string().min(3).max(32),
  lastName: z.string().min(3).max(32),
  nickName: z.string().min(3).max(32).nullable(),
  email: z.string().email().max(60),
  password: z.string().min(6).max(32),
});

export const meta: MetaFunction = () => [
  { title: "Dracma - Criar conta" },
];

const mutation = makeDomainFunction(schema)(async (body) => {
  try {
    const userRepository = new UserRepository();
    await new UserRegister(userRepository).execute({
      email: body.email,
      password: body.password,
      firstName: body.firstName,
      lastName: body.lastName,
      nickName: body?.nickName || '',
    })
  } catch (error) {
    throw new ResultError({
      errors: [{ message: 'Usuario já cadastrado' }],
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

export const loader: LoaderFunction = async ({ request }) => {
  await AuthCookie.redirectIfAuthenticated(request);

  return null;
}

export default function Index() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="mx-4">
      <div className="max-w-[440px] sm:max-w-[1260px] m-auto rounded-2xl shadow-2xl overflow-hidden md:mt-20 mt-8">
        <div className="flex flex-row justify-center text-card-foreground">
        <div className="w-full max-w-[400px] md:max-w-none md:w-auto md:flex-[2] bg-card">

            <div className="w-full px-4 m-auto mt-8 mb-4 lg:px-0 lg:w-8/12">
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
                          Crie sua conta
                        </h1>
                        <p className="mt-2 text-sm md:text-sm text-wrap">
                          Já tem uma conta?{" "}
                          <Link to="/login" className="font-semibold underline text-link">
                            faça login
                          </Link>
                        </p>
                      </div>
                      <Separator orientation="horizontal" className="w-full my-4 md:my-8" />

                      {actionData?.errors && (
                        <Errors />
                      )}

                      <div className="space-y-2 md:space-y-4">
                        <div className="flex flex-col gap-2 md:gap-4 md:flex-row">
                          <Field name="firstName" label="Nome" />
                          <Field name="lastName" label="Sobrenome" />
                        </div>
                        <Field name="nickName" type="text" label="Nome de usuario" />
                        <Field name="email" type="email" label="E-mail" />
                        <Field name="password" type="password" label="Senha" />
                      </div>

                      <div className="mt-8">
                        <Button className="w-full">Cadastre-se</Button>
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
