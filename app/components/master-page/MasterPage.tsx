import { MobileSideBar } from "../navigation/MobileSideBar";
import { DesktopSideBar } from "../navigation/DesktopSideBar";

function MasterPage({ children }: { children: React.ReactNode }) {
  return (
    <main className="sm:flex">

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

export default MasterPage;
