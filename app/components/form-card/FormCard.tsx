import { cn } from "~/lib/utils";
import { Separator } from "../ui/separator";

export function FormCard({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("w-full max-w-[610px] m-auto mb-4 py-4 bg-card border rounded-md shadow-md p-4 relative", className)}>
      {children}
    </div>
  )
}

function FormCardTitle({ children }: { children: React.ReactNode}) {
  return (
    <>
      <div className="flex items-center justify-center my-2 md:justify-between">
        <h2 className="text-lg font-semibold">{children}</h2>
      </div>
      <Separator className="mt-4 mb-7" />
    </>
  )
}

FormCard.Title = FormCardTitle;
