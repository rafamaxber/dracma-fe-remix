import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

export type FilterBarProps = {
  filterForm: React.ReactNode,
  children?: React.ReactNode
}

export type FilterBarSheetProps = {
  title?: string,
  side?: "top" | "bottom" | "left" | "right" | null | undefined,
  openSheet: boolean,
  handleToggleSheet: () => void,
  children: React.ReactNode
}

export function FilterBar({ filterForm, children }: FilterBarProps) {
  return (
    <div className="block mb-2 md:flex md:justify-start">

      {filterForm}
      {children && children}

    </div>
  )
}

function FilterBarSheet({
  title = "Filtre por:",
  openSheet,
  handleToggleSheet,
  side = 'top',
  children
}: FilterBarSheetProps) {
  return (
    <Sheet open={openSheet} onOpenChange={handleToggleSheet}>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>

        {children}

      </SheetContent>
    </Sheet>
  )
}
FilterBar.Sheet = FilterBarSheet;
