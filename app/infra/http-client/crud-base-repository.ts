import { dracmaApiClient } from "./setup.server";
import { ListAllResponse, ListAllFilterType } from "~/domain/general-types";

export const RESOURCE_LIST = {
  v1: {
    supplier: "/v1/supplier",
    category: "/v1/category",
    product: "/v1/product",
    user: "/v1/user",
    customer: "/v1/customer",
    feedstock: "/v1/feedstock",
    product_recipes: "/v1/product-recipes",
    orders: "/v1/orders",
  }
} as const;

export class CrudBaseRepository {
  constructor(private readonly resource: string, private readonly accessToken: string) {}

  async create<Data>(values: Data) {
    const response = await dracmaApiClient.post(`${this.resource}`, values, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`
      }
    });

    return response.data;
  }

  async listAll<Results, Filters>(filterDto: Filters & ListAllFilterType): Promise<ListAllResponse<Results>> {
    const { data } = await dracmaApiClient.get(`${this.resource}`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`
      },
      params: filterDto
    });

    return data;
  }

  async delete(id: number): Promise<void> {
    await dracmaApiClient.delete(`${this.resource}/${id}`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`
      }
    });
  }

  async update<Data>(id: number, values: Data): Promise<void> {
    await dracmaApiClient.patch(`${this.resource}/${id}`, values, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`
      },
    });
  }

  async findById<Result>(id: number): Promise<Result> {
    const { data } = await dracmaApiClient.get(`${this.resource}/${id}`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`
      }
    });

    return data;
  }
}
