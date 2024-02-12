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
  selectedOption: ComboBoxListType
  setSelectedOption: (status: ComboBoxListType) => void
  withHiddenInput?: boolean
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
  withHiddenInput = false,
}: ComboBoxProps) {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  function renderLabel() {
    if (selectedOption?.label) {
      return selectedOption.label
    }

    if (selectedOption?.value) {
      return selectedOption?.value
    }

    return label;
  }

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-between w-full shadow">
            {renderLabel()}
            <LuChevronDown className="ml-2" />
            {withHiddenInput && <input type="hidden" name={name} value={selectedOption?.value} defaultValue={defaultValue} />}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <ComboBoxList setOpen={setOpen} setSelectedOption={setSelectedOption} options={options} placeholderText={placeholderText} commandEmpty={commandEmpty} />
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="justify-between w-full">
          {renderLabel()}
          <LuChevronDown className="ml-2" />
          {withHiddenInput && <input type="hidden" name={name} value={selectedOption?.value} defaultValue={defaultValue} />}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <ComboBoxList setOpen={setOpen} setSelectedOption={setSelectedOption} options={options} placeholderText={placeholderText} commandEmpty={commandEmpty} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function ComboBoxList({
  setOpen,
  setSelectedOption,
  options,
  placeholderText,
  commandEmpty,
}: {
  setOpen: (open: boolean) => void
  setSelectedOption: (status: ComboBoxListType) => void,
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
                setSelectedOption(
                  options.find((priority) => priority.value === value) as ComboBoxListType
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

export function SingleComboBox({ options, defaultSelectedOption, onSelectedOption, name }: {
  options: ComboBoxListType[],
  defaultSelectedOption: ComboBoxListType,
  onSelectedOption: (option: ComboBoxListType) => void,
  name: string
}) {
  const { selectedOption, setSelectedOption } = useComboBox();

  function handleSelectOption(option: ComboBoxListType) {
    setSelectedOption(option);
    onSelectedOption(option);
  }

  return (
    <ComboBox
      options={options}
      selectedOption={selectedOption || defaultSelectedOption}
      setSelectedOption={handleSelectOption}
      name={name}
    />
  )
}
