import { CategoryRepository } from "~/infra/http-client/category-repository";
import { ProductCategoryResponse } from "./protocols";

export class CategoryFindById {
  constructor(private readonly categoryRepository = new CategoryRepository()) {}

  async find(accessToken: string, id: number): Promise<ProductCategoryResponse> {
    const data = await this.categoryRepository.findById(accessToken, id);

    return data;
  }
}
