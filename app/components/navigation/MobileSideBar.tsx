import { useEffect, useRef, useState } from "react";
import { LuCloud, LuLifeBuoy, LuLogOut, LuMenu, LuMoon, LuPlus, LuSun, LuUser, LuUserPlus, LuUsers, LuX } from "react-icons/lu";
import { AvatarIcon } from "./AvatarIcon";
import { CommandBar } from "./CommandBar";
import { NotificationIcon } from "./NotificationIcon";
import { SideBarNavigation } from "./SideBarNavigation";
import { SideBarProps } from "./SideBarProps";
import { DropdownMenuShortcut, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuGroup, DropdownMenuItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSubTrigger, DropdownMenuPortal, DropdownMenuSubContent, DropdownMenuSub } from "../ui/dropdown-menu";
import { Form } from "@remix-run/react";
import { Theme, useTheme } from "remix-themes";

export function MobileSideBar({ avatarUrl = 'https://i.pravatar.cc/100', userName = 'John Doe', hasNewMessages = false }: SideBarProps = {}) {
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
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-14">
      <div className="flex items-center justify-between gap-4 p-2">
        <div>
          {openedMenu ? (
              <LuX size="28px" className="text-slate-500 w-7" />
              ) : (
              <LuMenu size="28px" className="text-slate-500 w-7" onClick={handleOpenMenu} />
          )}
        </div>
        <CommandBar />
        <div>
          <NotificationIcon size="28px" hasNewMessages={hasNewMessages} />
        </div>
        <Menu>
          <AvatarIcon avatarUrl={avatarUrl} userName={userName} />
        </Menu>
      </div>
      {openedMenu && (
        <div ref={ref} className="fixed border-t border-r shadow-sm z-10 left-0 side-bar-mobile h-screen top-[64px] sm:top-14 p-2 w-[300px] overflow-y-auto overflow-auto border-border/40 bg-background">
          <SideBarNavigation />
        </div>
      )}
      {openedMenu && <div className="fixed z-0 w-screen h-screen backdrop-blur bg-black/55"></div>}
    </header>
  );
}

export function Menu({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <LuUser className="w-4 h-4 mr-2" />
            <span>Meu perfil</span>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <LuUsers className="w-4 h-4 mr-2" />
            <span>Time</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LuUserPlus className="w-4 h-4 mr-2" />
            <span>Enviar convite</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LuLifeBuoy className="w-4 h-4 mr-2" />
          <span>Supporte</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LuCloud className="w-4 h-4 mr-2" />
          <span>API</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            {
              theme === Theme.LIGHT ? (
                <LuSun className="w-4 h-4 mr-2" />
              ) : (
                <LuMoon className="w-4 h-4 mr-2" />
              )
            }
            <span>Tema</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                <DropdownMenuRadioItem value={Theme.LIGHT}>
                  <LuSun className="h-[1.2rem] w-[1.2rem] rotate-0 transition-all mr-2" /> <span>Light</span>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value={Theme.DARK}>
                  <LuMoon className="h-[1.2rem] w-[1.2rem] rotate-0 transition-all mr-2" /> <span>Dark</span>
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>



        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LuLogOut className="w-4 h-4 mr-2" />
          <Form className="block w-full" action="/logout" method="post">
            <button className="block w-full text-left" type="submit">Sair</button>
          </Form>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  )
}
