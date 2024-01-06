import { useState } from "react";
import { navigationItems } from "./navigationItems";
import { Link } from "@remix-run/react";

export function SideBarNavigation() {
  const [navigationState, setNavigationState] = useState<{ [key: string]: { visibility: boolean; }; }>({});

  function handleNavigationVisibility(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    const section = String(event.currentTarget.dataset.id);
    setNavigationState({ ...navigationState, [section]: { visibility: !navigationState?.[section]?.visibility } });
  }

  return (
    <nav>
      <ul className="pl-4">
        {navigationItems.map((item) => (
          <li key={item.id}>
            {item?.subItems ? (
              <button type="button" className="inline-block pt-6 pb-2 text-sm font-semibold text-gray-800" data-id={item.id} onClick={handleNavigationVisibility}>{item.label}</button>
            ) : (
              <Link className="inline-block pt-6 pb-2 text-sm font-semibold text-gray-800" data-id={item.id} to={item.url}>{item.label}</Link>
            )}
            {navigationState?.[item.id]?.visibility && item?.subItems && (
              <ul>
                {item?.subItems.map((subItem) => (
                  <li key={subItem.label} className="py-2 pl-6">
                    <Link className="inline-block text-sm text-gray-800" to={subItem.url}>{subItem.label}</Link>
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
