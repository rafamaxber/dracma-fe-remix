import MasterPage from "~/components/master-page/MasterPage";

export default function Products() {
  return (
    <MasterPage>
      <MasterPage.ContentDefault>
        <h1 className="text-2xl font-semibold text-">Produtos</h1>

        <div className="filter-bar"></div>
      </MasterPage.ContentDefault>
    </MasterPage>
  );
}
