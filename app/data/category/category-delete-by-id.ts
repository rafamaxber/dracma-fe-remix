import { json } from "@remix-run/node";
import { CategoryRepository } from "~/infra/http-client/category-repository";

export enum CategoryMessages {
  DELETE_CATEGORY_SUCCESS = 'delete.category.success'
}

export class CategoryDeleteById {
  constructor(private readonly categoryRepository = new CategoryRepository()) {}

  async delete(accessToken: string, id: number) {
    await this.categoryRepository.delete(accessToken, id);

    return json({
      id,
      message: CategoryMessages.DELETE_CATEGORY_SUCCESS
    });
  }
}
