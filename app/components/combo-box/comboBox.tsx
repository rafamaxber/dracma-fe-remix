import { useState } from "react"
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
}

export function ComboBox({ label = "Selecionar", options = [], placeholderText = "Filtre por...", commandEmpty = "Nenhum resultado encontrado" }: { label?: string, options: ComboBoxListType[], placeholderText?: string, commandEmpty?: string }) {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [selectedStatus, setSelectedStatus] = useState<ComboBoxListType | null>(
    null
  )

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-start w-full">
            {selectedStatus ? <>{selectedStatus.label}</> : <>{label}</>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <ComboBoxList setOpen={setOpen} setSelectedStatus={setSelectedStatus} options={options} placeholderText={placeholderText} commandEmpty={commandEmpty} />
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="justify-start w-full">
          {selectedStatus ? <>{selectedStatus.label}</> : <>{label}</>}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <ComboBoxList setOpen={setOpen} setSelectedStatus={setSelectedStatus} options={options} placeholderText={placeholderText} commandEmpty={commandEmpty} />
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
