import { Link, useActionData, MetaFunction } from "@remix-run/react";
import { redirect, type ActionFunction, LoaderFunctionArgs } from "@remix-run/node";
import { z } from "zod";
import { Form } from "~/components/form/Form";
import { Separator } from "~/components/ui/separator";
import teamImage from './images/img1.svg';
import { ResultError, makeDomainFunction } from "domain-functions";
import { performMutation } from "remix-forms";
import { AuthCookie, UserAuthType } from "~/data/auth/user-auth-cookie";
import { CompanyCreate } from "~/data/company/company-create";
import { routes } from "~/components/navigation/navigationItems";
import Logo from '~/components/logo.svg';
import { JwtService } from "~/data/auth/jtw";

const schema = z.object({
  companyName: z.string().min(3).max(32),
  role: z.string().min(3).max(32).nullable(),
});

export const meta: MetaFunction = () => [
  { title: "Dracma - Criar organização" },
];

const mutation = (accessToken: string) => (
  makeDomainFunction(schema)(async (body) => {
    try {
      const result = new CompanyCreate().create(accessToken, {
        companyName: String(body.companyName),
        role: String(body?.role || ''),
      })
      return result;
    } catch (error) {
      throw new ResultError({
        errors: [{ message: 'Usuario já cadastrado' }],
      })
    }
  })
)

export const action: ActionFunction = async ({ request }) => {
  const accessToken = await AuthCookie.requireAuthCookie(request);

  const result = await performMutation({
    mutation: mutation(String(accessToken)),
    request,
    schema,
  })

  if (result.success) {
    const authCookieValue = await (AuthCookie.get()).serialize(result.data?.access_token);
    return redirect(routes.dashboard, {
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

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const accessTokenKey = await AuthCookie.requireAuthCookie(request);
  if (typeof accessTokenKey === 'string') {
    const accessTokenJwt: UserAuthType = JwtService.format(accessTokenKey);
    if (accessTokenJwt.companyId) return redirect(routes.dashboard)
  }

  return null;
};

export default function Index() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="mx-4">
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
                          <Link to="/organization/join" className="underline text-link hover:underline">
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
          <div className="bg-black flex-[2] hidden sm:flex justify-center items-center">
            <img src={teamImage} alt="register" className="object-cover h-2/3" />
          </div>
        </div>
      </div>
    </div>
  );
}
