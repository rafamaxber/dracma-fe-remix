import { Link, useActionData } from "@remix-run/react";
import { redirect, ActionFunction, MetaFunction } from "@remix-run/node";
import { z } from "zod";
import { Form } from "~/components/form/Form";
import { UserRepository } from "~/infra/http-client/user-repository";
import { Separator } from "~/components/ui/separator";
import teamImage from './images/img1.svg';
import { ResultError, makeDomainFunction } from "domain-functions";
import { performMutation } from "remix-forms";
import { UserLogin } from "~/data/auth/user-login";
import { AuthCookie } from "~/data/auth/user-cookie";

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
    console.log('process.env.DRACMA_API_URL:: ', process.env.DRACMA_API_URL)
    console.error('login:makeDomainFunction:: ', error)
    throw new ResultError({
      errors: [{ message: 'Usuario ou senha incorretos' }],
    })
  }
})

export const action: ActionFunction = async ({ request }) => {
  const result = await performMutation({ request, schema, mutation })

  if (result.success) {
    const authCookieValue = await (AuthCookie.get()).serialize(result.data?.access_token);
    return redirect("/", {
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

export default function Index() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="max-w-[1260px] m-auto px-6">
      <div className="flex flex-row justify-center shadow-2xl md:min-h-[600px] md:mt-20 mt-8">
        <div className="bg-black flex-[2] rounded-l-lg hidden md:flex justify-center items-center">
          <img src={teamImage} alt="register" className="object-cover h-2/3" />
        </div>
        <div className="bg-white rounded-r-lg w-full md:w-auto md:flex-[2] flex py-10 md:py-0">
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
                        Faça login
                      </h1>
                      <p className="mt-2 text-sm md:text-sm text-wrap">
                        Ainda não tem uma conta? {" "}
                        <Link to="/register" className="text-blue-500 underline text-wrap">
                          Cadastre-se aqui
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
                      <Field name="password" type="password" label="Senha" />
                      <div className="flex justify-end">
                        <Link to="/forgot-password" className="text-sm text-blue-500 underline text-wrap md:text-sm relative top-[-10px]">
                          Esqueceu a senha?
                        </Link>
                      </div>
                    </div>

                    <div className="mt-8">
                      <Button className="w-full">Entrar</Button>
                    </div>
                  </>
                )
              }
            }
          </Form>
        </div>
      </div>
    </div>
  );
}
