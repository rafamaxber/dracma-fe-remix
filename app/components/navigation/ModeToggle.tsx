import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "~/components/ui/dropdown-menu"
import { LuMoon, LuSun } from "react-icons/lu"
import { Theme, useTheme } from "remix-themes"
import { Button } from "../ui/button"


export function ModeToggle() {
  const [theme, setTheme] = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {
            theme === Theme.LIGHT ? (
              <LuSun className="h-[1.2rem] w-[1.2rem] rotate-0 transition-all" />
            ) : (
              <LuMoon className="h-[1.2rem] w-[1.2rem] rotate-0 transition-all" />
            )
          }
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme(Theme.LIGHT)} className="gap-2">
          <LuSun className="h-[1.2rem] w-[1.2rem] rotate-0 transition-all" /> <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme(Theme.DARK)} className="gap-2">
          <LuMoon className="h-[1.2rem] w-[1.2rem] rotate-0 transition-all" /> <span>Dark</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
