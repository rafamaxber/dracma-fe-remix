import { LuMenu, LuPanelLeftClose } from "react-icons/lu";
import { SideBarNavigation } from "./SideBarNavigation";
import { SideBarProps } from "./SideBarProps";
import { routes } from "./navigationItems";
import { useState } from "react";
import { CommandBar } from "./CommandBar";

export function DesktopSideBar({ avatarUrl = 'https://i.pravatar.cc/100', userName = 'John Doe', hasNewMessages = false }: SideBarProps = {}) {
  const [openedMenu, setOpenedMenu] = useState(true);
  function handleOpenMenu() {
    setOpenedMenu(!openedMenu);
  }

  return (
    <aside className="sticky top-0 bottom-0 hidden h-screen p-2 overflow-y-auto bg-white side-bar sm:block lg:left-0 max-w-80">

      <div className={`flex justify-between gap-1 pb-2 profile-menu`}>

        {openedMenu && (
          <div className="flex items-center avatar-container">
            <a className="w-10 h-10 mr-2 avatar-icon" href={routes.profile}>
              <img className="rounded-full" src={avatarUrl} alt={userName} />
            </a>
            <div className="avatar-name">
              <a className="block text-ms text-ellipsis" href={routes.profile}>{userName}</a>
              <a className="block text-xs underline text-cyan-600" href={routes.profile}>Ver perfil</a>
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

      {openedMenu && <div className="py-3 mt-3"><CommandBar /></div>}
      {openedMenu && <SideBarNavigation />}
    </aside>
  );
}
