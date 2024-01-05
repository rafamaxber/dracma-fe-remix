import { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import MasterPage from "~/components/master-page/MasterPage";
import { routes } from "~/components/navigation/navigationItems";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
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
