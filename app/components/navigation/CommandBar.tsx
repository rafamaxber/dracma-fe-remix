"use client"

import * as React from "react"
import {
  LuSearch
} from "react-icons/lu"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "~/components/ui/command"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Link } from "lucide-react"
import { useNavigate, useNavigation } from "@remix-run/react"
import { navigationItems } from "./navigationItems"

export function CommandBar() {
  const [open, setOpen] = React.useState(false)
  const navigate = useNavigate()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <div className="flex justify-end w-full">
      <Button variant="outline" className="relative justify-start w-full md:w-80" onClick={() => setOpen(true)}>
        <LuSearch className="w-4 h-4 mr-2" />
        <span className="hidden lg:inline-flex">Buscar ações</span>
        <span className="inline-flex lg:hidden">Buscar...</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-7 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[12px] font-medium opacity-100 sm:flex"><span className="text-sm">⌘</span>K</kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Busque o que desejar" />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado</CommandEmpty>
          <CommandGroup>
            {
              navigationItems.map((item, index) => {
                if (item.id !== 'register') {
                  return (
                    <CommandItem key={index} onSelect={(value) => navigate(value)} value={item.url}>
                      <span>{item.label}</span>
                    </CommandItem>
                  )
                }

                return item.subItems?.map((subItem, subIndex) => {
                  return (
                    <>
                      <CommandItem key={subIndex} onSelect={(value) => navigate(`${subItem.url}/create`)} value={`criar, novo, adicionar, incluir, ${subItem.label}`}>
                        <span>Adicionar {subItem.label}</span>
                      </CommandItem>
                      <CommandItem key={subIndex} onSelect={(value) => navigate(`${subItem.url}`)} value={`ver, listar, relatório, report, tabela ${subItem.label}`}>
                        <span>Lista de {subItem.label}</span>
                      </CommandItem>
                    </>
                  )
                })
              })
            }
          </CommandGroup>
          <CommandSeparator />
        </CommandList>
      </CommandDialog>
    </div>
  )
}
