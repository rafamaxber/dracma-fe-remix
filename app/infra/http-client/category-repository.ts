import { CategoryCreateDto, CategoryCreateRepository, CategoryDeleteRepository, CategoryFilterDto, CategoryFindByIdRepository, CategoryListRepository, CategoryUpdateRepository, ProductCategoryResponseList } from "~/data/category/protocols";
import { dracmaApiClient } from "./setup.server";

export class CategoryRepository implements CategoryCreateRepository, CategoryListRepository, CategoryDeleteRepository, CategoryUpdateRepository, CategoryFindByIdRepository {
  async create(accessToken: string, values: CategoryCreateDto) {
    const response = await dracmaApiClient.post('/v1/product-category', values, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    return response.data;
  }

  async listAll(accessToken: string, filterDto: CategoryFilterDto): Promise<ProductCategoryResponseList> {
    const { data } = await dracmaApiClient.get('/v1/product-category', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      params: filterDto
    });

    return data;
  }

  async delete(accessToken: string, id: number): Promise<void> {
    await dracmaApiClient.delete(`/v1/product-category/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

  async update(accessToken: string, id: number, values: CategoryCreateDto): Promise<void> {
    await dracmaApiClient.patch(`/v1/product-category/${id}`, values, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
    });
  }

  async findById(accessToken: string, id: number) {
    const { data } = await dracmaApiClient.get(`/v1/product-category/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    return data;
  }
}
