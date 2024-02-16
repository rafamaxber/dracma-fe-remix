import { useState } from "react";
import { NavLink } from "@remix-run/react";
import { navigationItems } from "./navigationItems";
import Logo from '~/components/logo.svg';
import { Separator } from "../ui/separator";

export function SideBarNavigation() {
  const [navigationState, setNavigationState] = useState<{ [key: string]: { visibility: boolean; }; }>({});

  function handleNavigationVisibility(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    const section = String(event.currentTarget.dataset.id);
    setNavigationState({ ...navigationState, [section]: { visibility: !navigationState?.[section]?.visibility } });
  }

  return (
    <nav>
      <div className="w-full m-auto lg:w-8/12">
        <img src={Logo} alt="logo" className="relative m-auto w-36" />
      </div>

      <Separator orientation="horizontal" className="w-full my-2" />

      <ul className="pl-4">
        {navigationItems.map((item) => (
          <li key={item.id}>
            {item?.subItems ? (
              <button type="button" className="inline-block pt-6 pb-2 text-sm font-semibold" data-id={item.id} onClick={handleNavigationVisibility}>{item.label}</button>
            ) : (
              <NavLink className="inline-block pt-6 pb-2 text-sm font-semibold" data-id={item.id} to={item.url}>{item.label}</NavLink>
            )}
            {navigationState?.[item.id]?.visibility && item?.subItems && (
              <ul>
                {item?.subItems.map((subItem) => (
                  <li key={subItem.label} className="py-2 pl-6">
                    <NavLink className="inline-block text-sm" to={subItem.url}>{subItem.label}</NavLink>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
