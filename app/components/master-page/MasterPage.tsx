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
      <div className="p-2 mx-2 mt-2 bg-white rounded sm:mt-4 sm:p-8 sm:mx-4">
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

export default MasterPage;
