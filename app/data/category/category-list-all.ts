import { CategoryRepository } from "~/infra/http-client/category-repository";
import { CategoryFilterDto } from "./protocols";

export class CategoryListAll {
  constructor(private readonly categoryListRepository = new CategoryRepository()) {}

  async listAll(accessToken: string, filters: CategoryFilterDto) {
    const data = await this.categoryListRepository.listAll(accessToken, filters);

    return data;
  }
}
