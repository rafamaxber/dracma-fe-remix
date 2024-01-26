import { LuArrowLeft } from "react-icons/lu";
import { Link } from "@remix-run/react";
import { MobileSideBar } from "../navigation/MobileSideBar";
import { DesktopSideBar } from "../navigation/DesktopSideBar";

function MasterPage({ children }: { children: React.ReactNode }) {
  return (
    <main className="lg:flex">

      <DesktopSideBar />
      <MobileSideBar />

      {children}
    </main>
  )
}
MasterPage.displayName = "MasterPage";

function ContentDefault({ children }: { children: React.ReactNode }) {
  return (
    <div className="sm:max-w-[2070px] mx-auto sm:min-w-[800px] w-[100%]">
      <div className="p-2 mx-2 mt-2 rounded sm:mt-4 sm:py-8 sm:mx-4">
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
    <div className="flex items-center justify-between mb-4">
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
    <div className="px-2 bg-blue-950 mb-[-42px] md:mb-[-44px]">
      <div className="w-full max-w-[610px] m-auto md:py-4 h-28 md:h-48 flex md:flex-col md:pt-10 justify-start">
        <Link className="flex items-center justify-center w-8 h-8 mt-5 bg-white rounded-full text-blue-950 md:mt-0 md:hidden" to={backButtonLink}>
          <LuArrowLeft size="20" className="inline-block mr-1"/>
        </Link>
        <div className="absolute left-0 w-full text-center md:block md:text-left md:left-auto md:max-w-[610px] md:m-auto">
          <h1 className="mt-5 text-xl font-semibold text-white md:mt-0 md:text-2xl">{title}</h1>
        </div>
      </div>
    </div>
  )
}
FormPageHeader.displayName = "FormPageHeader";
MasterPage.FormPageHeader = FormPageHeader;

export default MasterPage;
