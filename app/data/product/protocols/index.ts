import { ListAllResponse } from "~/domain/general-types";

export interface ProductDataTable {
  name: string;
  categories: string[];
  price_sell: number | null;
  price_cost: number | null;
  code: string;
  stock_quantity: number;
  id: number;
  image: string;
  stock_min: number;
  stock_max: number;
  status: string;
  supplier: string;
  stock: boolean;
}

export interface ProductResponseList extends ListAllResponse<ProductDataTable>{}

export type ProductFilterDto = {
  perPage?: number;
  page?: number;
  name?: string;
  category?: string;
  code?: string;
};
