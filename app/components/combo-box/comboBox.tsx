import { useState } from "react"
import { LuChevronDown } from "react-icons/lu";

import { Button } from "~/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "~/components/ui/drawer"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import { useMediaQuery } from "~/components/hooks/useMediaQuery"

export type ComboBoxListType = {
  value: string
  label: string
  disabled?: boolean
}

export function useComboBox<T extends ComboBoxListType>() {
  const [selectedOption, setSelectedOption] = useState<T | null>(null)

  return {
    selectedOption,
    setSelectedOption,
  }
}

type ComboBoxProps = {
  label?: string
  options?: ComboBoxListType[]
  name?: string
  defaultValue?: string
  placeholderText?: string
  commandEmpty?: string
  selectedOption: ComboBoxListType | null
  setSelectedOption: (status: ComboBoxListType | null) => void
}

export function ComboBox({
  label = "Selecionar",
  name = "combo-box-field",
  defaultValue = "",
  options = [],
  placeholderText = "Filtre por...",
  commandEmpty = "Nenhum resultado encontrado",
  selectedOption,
  setSelectedOption,
}: ComboBoxProps) {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-between w-full shadow">
            {selectedOption ? <>{selectedOption.label}</> : <>{label}</>}
            <LuChevronDown className="ml-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <ComboBoxList setOpen={setOpen} setSelectedStatus={setSelectedOption} options={options} placeholderText={placeholderText} commandEmpty={commandEmpty} />
          <input type="hidden" name={name} value={selectedOption?.value} defaultValue={defaultValue} />
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="justify-between w-full">
          {selectedOption ? <>{selectedOption.label}</> : <>{label}</>}
          <LuChevronDown className="ml-2" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <ComboBoxList setOpen={setOpen} setSelectedStatus={setSelectedOption} options={options} placeholderText={placeholderText} commandEmpty={commandEmpty} />
          <input type="hidden" name={name} value={selectedOption?.value} defaultValue={defaultValue} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function ComboBoxList({
  setOpen,
  setSelectedStatus,
  options,
  placeholderText,
  commandEmpty,
}: {
  setOpen: (open: boolean) => void
  setSelectedStatus: (status: ComboBoxListType | null) => void,
  options: ComboBoxListType[],
  placeholderText: string,
  commandEmpty: string,
}) {
  return (
    <Command>
      <CommandInput className="border-none search-input-combo-box" placeholder={placeholderText} />
      <CommandList>
        <CommandEmpty>{commandEmpty}</CommandEmpty>
        <CommandGroup>
          {options.map((option) => (
            <CommandItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              onSelect={(value) => {
                setSelectedStatus(
                  options.find((priority) => priority.value === value) || null
                )
                setOpen(false)
              }}
            >
              {option.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
