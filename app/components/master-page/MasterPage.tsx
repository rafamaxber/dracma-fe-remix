import { LuArrowLeft } from "react-icons/lu";
import { Link } from "@remix-run/react";
import { MobileSideBar } from "../navigation/MobileSideBar";
import { Button } from "../ui/button";

function MasterPage({ children }: { children: React.ReactNode }) {
  return (
    <main className="">

      <MobileSideBar />
      {children}
    </main>
  )
}
MasterPage.displayName = "MasterPage";

function ContentDefault({ children }: { children: React.ReactNode }) {
  return (
    <div className="sm:max-w-[2070px] mx-auto sm:min-w-[800px] w-[100%]">
      <div className="p-2 py-6 mx-2 rounded lg:py-8 sm:mx-4">
        {children}
      </div>
    </div>
  )
}
ContentDefault.displayName = "ContentDefault";
MasterPage.ContentDefault = ContentDefault;

function ContentFull({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full">
      {children}
    </div>
  )
}
ContentFull.displayName = "ContentFull";
MasterPage.ContentFull = ContentFull;

function HeaderDefault({
  title,
  children
}: {
  title: string,
  children?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between mb-10">
      <h1 className="text-lg font-semibold sm:text-2xl">{title}</h1>
      <div className="flex flex-row flex-wrap justify-end gap-3">
        {children}
      </div>
    </div>
  )
}
HeaderDefault.displayName = "HeaderDefault";
MasterPage.HeaderDefault = HeaderDefault;

function FormPageHeader({
  title,
  backButtonLink
}: {
  title: string,
  backButtonLink: string,
}) {
  return (
    <div className="w-full dark:bg-grid-white/[0.2] bg-dot-black/[0.2] relative flex items-center justify-center">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,white)]"></div>
      <div className="w-full max-w-[610px] m-auto py-4 h-24 md:h-48 flex md:flex-col md:pt-20 justify-start relative z-20 text-4xl font-bold sm:text-7xl bg-clip-text bg-gradient-to-b from-neutral-200 to-neutral-500">
        <Button variant="default" asChild className="rounded-full" size="icon">
          <Link className="relative z-10 flex items-center justify-center w-8 h-8 mt-5 ml-2 md:mt-0" to={backButtonLink}>
            <LuArrowLeft size="25" className="inline-block mr-1"/>
          </Link>
        </Button>
        <div className="absolute left-0 w-full text-center md:block md:text-left md:left-12 md:max-w-[610px] md:m-auto">
          <h1 className="mt-5 text-xl font-semibold text-foreground md:mt-0 md:text-2xl">{title}</h1>
        </div>
      </div>
    </div>
  )
}
FormPageHeader.displayName = "FormPageHeader";
MasterPage.FormPageHeader = FormPageHeader;

export default MasterPage;
