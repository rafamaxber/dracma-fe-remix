import { ListAllResponse } from "~/domain/general-types";
import { dracmaApiClient } from "./setup.server";

export type ProductQueryFilterDto = {
  perPage?: number;
  page?: number;
  name?: string;
  category?: string;
  code?: string;
}

export interface ProductType {
  id: number
  name: string
  code: string
  canBeResold: boolean
  price_sell?: number
  price_cost: number
  manufacturer: boolean
  barcode: number | null
  status: string
  quantity: number
  description: string
  weight: number
  stock: boolean
  stock_min: number
  stock_max: number
  removeFeedstockFromStock: boolean
  updatedAt: string
  supplier: {
    id?: number
    name?: string
  }
  categories: Array<{
    id: number
    name: string
  }>
  unit?: string
  images: Array<{
    imageUrl: string
  }>
}

interface ProductResponseList extends ListAllResponse<ProductType>{}

export interface ProductCreateDto extends Omit<ProductType, 'id' | 'updatedAt' | 'images' | 'categories' | 'supplier'> {
  images: Array<{
    url: string,
    main: boolean
  }>
  categories: Array<{
    id: number
  }>
  supplier: {
    id: number
  }
}

export class ProductRepository {
  async create(accessToken: string, values: ProductCreateDto) {
    const response = await dracmaApiClient.post('/v1/product', values, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    return response.data;
  }

  async listAll(accessToken: string, filterDto: ProductQueryFilterDto): Promise<ProductResponseList> {
    const { data } = await dracmaApiClient.get('/v1/product', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      params: filterDto
    });

    return data;
  }

  // async delete(accessToken: string, id: number): Promise<void> {
  //   await dracmaApiClient.delete(`/v1/product/${id}`, {
  //     headers: {
  //       Authorization: `Bearer ${accessToken}`
  //     }
  //   });
  // }

  // async update(accessToken: string, id: number, values: ProductCreateDto): Promise<void> {
  //   await dracmaApiClient.patch(`/v1/product/${id}`, values, {
  //     headers: {
  //       Authorization: `Bearer ${accessToken}`
  //     },
  //   });
  // }

  // async findById(accessToken: string, id: number) {
  //   const { data } = await dracmaApiClient.get(`/v1/product/${id}`, {
  //     headers: {
  //       Authorization: `Bearer ${accessToken}`
  //     }
  //   });

  //   return data;
  // }
}
