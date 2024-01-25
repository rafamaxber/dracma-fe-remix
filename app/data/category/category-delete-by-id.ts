import { CategoryRepository } from "~/infra/http-client/category-repository";

export class CategoryDeleteById {
  constructor(private readonly categoryRepository = new CategoryRepository()) {}

  async delete(accessToken: string, id: number) {
    const data = await this.categoryRepository.delete(accessToken, id);

    return data;
  }
}
