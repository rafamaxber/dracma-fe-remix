import { useEffect, useRef, useState } from "react";
import { LuMenu } from "react-icons/lu";
import { AvatarIcon } from "./AvatarIcon";
import { CommandBar } from "./CommandBar";
import { NotificationIcon } from "./NotificationIcon";
import { SideBarNavigation } from "./SideBarNavigation";
import { SideBarProps } from "./SideBarProps";

export function MobileSideBar({ avatarUrl = 'https://i.pravatar.cc/100', userName = 'John Doe', hasNewMessages = true }: SideBarProps = {}) {
  const [openedMenu, setOpenedMenu] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  function handleOpenMenu() {
    setOpenedMenu(!openedMenu);
  }

  function handleClickOutside(event: MouseEvent) {
    if (ref.current && !ref.current?.contains(event.target as Node)) {
      setOpenedMenu(false);
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between h-12 p-2 rounded-bl-lg rounded-br-lg bg-accent lg:hidden hamburguer-menu">
        <LuMenu size="25px" className="text-primary" onClick={handleOpenMenu} />
        <CommandBar />
        <NotificationIcon hasNewMessages={hasNewMessages} />
        <AvatarIcon avatarUrl={avatarUrl} userName={userName} />
      </div>
      {openedMenu && (
        <div ref={ref} className="fixed border-r shadow-sm z-10 left-0 top-0 side-bar-mobile lg:hidden h-screen bottom-0 lg:left-0 p-2 w-[300px] overflow-y-auto bg-accent overflow-auto">
          <SideBarNavigation />
        </div>
      )}
    </div>
  );
}
