import { Link, useActionData } from "@remix-run/react";
import { redirect, ActionFunction, MetaFunction, LoaderFunction } from "@remix-run/node";
import { z } from "zod";
import { Form } from "~/components/form/Form";
import { UserRepository } from "~/infra/http-client/user-repository";
import { Separator } from "~/components/ui/separator";
import teamImage from './images/img1.svg';
import { ResultError, makeDomainFunction } from "domain-functions";
import { performMutation } from "remix-forms";
import { UserLogin } from "~/data/auth/user-login";
import { AuthCookie, UserAuthType } from "~/data/auth/user-auth-cookie";
import { JwtService } from "~/data/auth/jtw";
import { routes } from "~/components/navigation/navigationItems";
import Logo from '~/components/logo.svg';

const schema = z.object({
  email: z.string().email().max(60),
  password: z.string().min(6).max(32),
});

export const meta: MetaFunction = () => [
  { title: "Dracma - Faça login" },
];

const mutation = makeDomainFunction(schema)(async (body) => {

  try {
    const userRepository = new UserRepository();
    const result = await new UserLogin(userRepository).execute(body)
    return result;
  } catch (error) {
    throw new ResultError({
      errors: [{ message: 'Usuario ou senha incorretos' }],
    })
  }
})

export const action: ActionFunction = async ({ request }) => {
  const result = await performMutation({ request, schema, mutation })

  if (result.success) {
    const accessTokenKey = result.data?.access_token;
    const authCookieValue = await (AuthCookie.get()).serialize(accessTokenKey);

    const accessTokenJwt: UserAuthType = JwtService.format(accessTokenKey);
    if (accessTokenJwt.companyId) {
      return redirect(routes.dashboard, {
        headers: {
          "Set-Cookie": authCookieValue,
        },
      })
    }

    return redirect(routes.create_organization, {
      headers: {
        "Set-Cookie": authCookieValue,
      },
    })
  }

  return new Response(JSON.stringify(result), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  })
}

export const loader: LoaderFunction = async ({ request }) => {
  const isLoggedIn = await AuthCookie.redirectIfAuthenticated(request);

  if (isLoggedIn) {
    return redirect('/')
  }

  return null;
}

export default function Index() {
  const actionData = useActionData<typeof action>();

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
            >
              {
                ({ Button: FormButton, Field, Errors }) => {
                  return (
                    <>
                      <div>
                        <h1 className="text-lg font-semibold md:text-xl">
                          Faça login
                        </h1>
                        <p className="mt-2 text-sm md:text-sm text-wrap">
                          Ainda não tem uma conta? {" "}
                          <Link to="/register" className="font-semibold underline text-link">
                            Cadastre-se aqui
                          </Link>
                        </p>
                      </div>
                      <Separator orientation="horizontal" className="w-full my-4 md:my-8" />

                      {actionData?.errors && (
                        <Errors />
                      )}

                      <div className="space-y-2 md:space-y-4">
                        <Field name="email" type="email" label="E-mail" />
                        <Field name="password" type="password" label="Senha" />
                        <div className="flex justify-end">
                          <Link to="/forgot-password" className="text-sm font-semibold text-link underline text-wrap md:text-sm relative top-[-10px]">
                            Esqueceu a senha?
                          </Link>
                        </div>
                      </div>

                      <div className="mt-8">
                        <FormButton className="w-full" variant="default">Entrar</FormButton>
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
