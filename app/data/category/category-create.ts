import { CategoryRepository } from "~/infra/http-client/category-repository";
import { CategoryCreateDto } from "./protocols";

export class CategoryCreate {
  constructor(private readonly categoryCreateRepository = new CategoryRepository()) {}

  async create(accessToken: string, values: CategoryCreateDto) {
    await this.categoryCreateRepository.create(accessToken, values);
  }
}
