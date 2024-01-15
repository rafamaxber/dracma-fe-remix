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

const schema = z.object({
  password: z.string().min(6).max(32),
  token: z.string().min(6)
});

export const meta: MetaFunction = () => [
  { title: "Dracma - Criar nova senha" },
];

const mutation = makeDomainFunction(schema)(async (body) => {
console.log(body);
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
    return redirect("/login", )
  }

  return new Response(JSON.stringify(result), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  })
}

export const loader = ({ params }: LoaderFunctionArgs) => {
  const { token } = params;

  return json({ token });
}


export default function Index() {
  const actionData = useActionData<typeof action>();
  const { token } = useLoaderData<typeof loader>();

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
            values={{ token }}
          >
            {
              ({ Button, Field, Errors, register }) => {
                return (
                  <>
                    <div className="text-center">
                      <h1 className="text-xl font-semibold md:text-3xl">
                        Atualize sua senha
                      </h1>
                      <p className="mt-2 text-sm md:text-sm text-wrap">
                        Crie uma nova senha para sua conta
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
  );
}
