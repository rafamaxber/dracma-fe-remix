export const routes = {
  dashboard: "/",
  register: "/register",
  sales: "/sales",
  purchases: "/purchases",
  stock: "/stock",
  financial: "/financial",
  reports: "/reports",
  settings: "/settings",
  profile: "/profile",
  categories: "/categories",
  products: "/products",
  clients: "/clients",
  suppliers: "/suppliers",
  sellers: "/sellers",
  other_spending: "/other-spending",
  other_revenues: "/other-revenues",
};

export const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', subItems: [], url: routes.dashboard },
  {
    id: 'register',
    label: 'Cadastros',
    subItems: [
      { label: "Categorias", url: routes.categories },
      { label: "Produtos", url: routes.products },
      { label: "Clientes", url: routes.clients },
      { label: "Fornecedores", url: routes.suppliers },
      { label: "Estoque", url: routes.stock },
      { label: "Vendedores", url: routes.sellers },
      { label: "Outros gastos", url: routes.other_spending },
      { label: "Outras receitas", url: routes.other_revenues },
    ]
  },
  { id: 'sales', label: 'Vendas', subItems: [], url: routes.sales },
  { id: 'purchases', label: 'Compras', subItems: [], url: routes.purchases },
  { id: 'stock', label: 'Estoque', subItems: [], url: routes.stock },
  { id: 'financial', label: 'Financeiro', subItems: [], url: routes.financial },
  { id: 'reports', label: 'Relatórios', subItems: [], url: routes.reports },
  { id: 'settings', label: 'Configurações', subItems: [], url: routes.settings },
];
