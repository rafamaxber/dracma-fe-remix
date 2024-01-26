import { LuMenu, LuPanelLeftClose } from "react-icons/lu";
import { SideBarNavigation } from "./SideBarNavigation";
import { SideBarProps } from "./SideBarProps";
import { routes } from "./navigationItems";
import { useState } from "react";
import { CommandBar } from "./CommandBar";
import { Link } from "@remix-run/react";
import { ModeToggle } from "./ModeToggle";

export function DesktopSideBar({ avatarUrl = 'https://i.pravatar.cc/100', userName = 'John Doe', hasNewMessages = false }: SideBarProps = {}) {
  const [openedMenu, setOpenedMenu] = useState(true);
  function handleOpenMenu() {
    setOpenedMenu(!openedMenu);
  }

  return (
    <aside className={`sticky top-0 bottom-0 hidden h-screen p-2 overflow-y-auto bg-card text-card-foreground side-bar border-r lg:block lg:left-0 ${openedMenu && 'w-80'}`}>

      <div className="flex justify-between gap-1 pb-2 profile-menu">

        {openedMenu && (
          <div className="flex items-center avatar-container">
            <Link className="w-10 h-10 mr-2 avatar-icon" to={routes.profile}>
              <img className="rounded-full" src={avatarUrl} alt={userName} />
            </Link>
            <div className="avatar-name">
              <Link className="block text-ms text-ellipsis" to={routes.profile}>{userName}</Link>
              <Link className="block text-xs underline text-cyan-600" to={routes.profile}>Ver perfil</Link>
            </div>
          </div>
        )}
        <div className="mt-2 hamburguer-menu">
          {
            openedMenu ? (
              <LuPanelLeftClose size="25px" className="text-gray-600 cursor-pointer" onClick={handleOpenMenu} />
            ) : (
              <LuMenu size="25px" className="text-gray-600 cursor-pointer" onClick={handleOpenMenu} />
            )
          }
        </div>
      </div>

      <ModeToggle />
      {openedMenu && <div className="py-3 mt-3"><CommandBar /></div>}
      {openedMenu && <SideBarNavigation />}
    </aside>
  );
}
