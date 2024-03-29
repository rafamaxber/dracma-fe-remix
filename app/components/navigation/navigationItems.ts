export const routes = {
  dashboard: "/",
  register: "/register",
  order: "/order",
  sales: "/sales",
  purchases: "/purchases",
  stock: "/stock",
  feedstock: "/feedstock",
  financial: "/financial",
  reports: "/reports",
  settings: "/settings",
  profile: "/profile",
  categories: "/categories",
  products: "/products",
  customers: "/customers",
  suppliers: "/suppliers",
  sellers: "/sellers",
  other_spending: "/other-spending",
  other_revenues: "/other-revenues",
  login: "/login",
  create_organization: "/organization/create",
} as const;

export const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', url: routes.dashboard },
  {
    id: 'register',
    label: 'Cadastros',
    subItems: [
      { label: "Categorias", url: routes.categories },
      { label: "Fornecedores", url: routes.suppliers },
      { label: "Insumos", url: routes.feedstock },
      { label: "Produtos", url: routes.products },
      { label: "Clientes", url: routes.customers },
      { label: "Vendedores", url: routes.sellers },
      { label: "Outros gastos", url: routes.other_spending },
      { label: "Outras receitas", url: routes.other_revenues },
    ]
  },
  { id: 'order', label: 'Pedidos', url: routes.order },
  { id: 'sales', label: 'Vendas', url: routes.sales },
  { id: 'purchases', label: 'Compras', url: routes.purchases },
  { id: 'stock', label: 'Estoque', url: routes.stock },
  { id: 'financial', label: 'Financeiro', url: routes.financial },
  { id: 'reports', label: 'Relatórios', url: routes.reports },
  { id: 'settings', label: 'Configurações', url: routes.settings },
];
