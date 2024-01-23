import type { LoaderFunctionArgs } from "@remix-run/node";
import { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import MasterPage from "~/components/master-page/MasterPage";
import { routes } from "~/components/navigation/navigationItems";
import { AuthCookie } from "~/data/auth/user-auth-cookie";

export const meta: MetaFunction = () => {
  return [
    { title: "Dracma - Centro de comandos" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};


export const loader = async ({ request }: LoaderFunctionArgs) => {
  await AuthCookie.requireAuthCookie(request);

  return null;
};


export default function Index() {

  return (
    <MasterPage>
      <MasterPage.ContentDefault>
        <div className="box-border flex flex-wrap justify-around gap-2">
          {
            Object.entries(routes).map(([item, value]) => (
              <div key={item} className="flex-shrink-0 inline-block p-2 text-white bg-blue-900 h-14">
                <Link to={value}>{item}</Link>
              </div>
            ))
          }
        </div>
      </MasterPage.ContentDefault>
    </MasterPage>
  );
}
