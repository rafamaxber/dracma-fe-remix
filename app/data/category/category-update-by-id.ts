import { CategoryRepository } from "~/infra/http-client/category-repository";
import { CategoryCreateDto } from "./protocols";

export class CategoryUpdateById {
  constructor(private readonly categoryRepository = new CategoryRepository()) {}

  async update(accessToken: string, id: number, values: CategoryCreateDto) {
    const data = await this.categoryRepository.update(accessToken, id, values);

    return data;
  }
}
