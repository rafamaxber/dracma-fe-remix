import { ListAllFilterType, ListAllResponse } from "~/data/types";

export type CategoryCreateDto = {
  name: string;
}

export interface CategoryFilterDto extends ListAllFilterType {
  name?: string;
}

export type ProductCategoryResponse = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export type ProductCategoryResponseList = ListAllResponse<ProductCategoryResponse>

export interface CategoryCreateRepository {
  create(accessToken: string, bodyDto: CategoryCreateDto): Promise<void>;
}

export interface CategoryListRepository {
  listAll(accessToken: string, filterDto: CategoryFilterDto): Promise<ProductCategoryResponseList>;
}

export interface CategoryDeleteRepository {
  delete(accessToken: string, id: number): Promise<void>;
}

export interface CategoryUpdateRepository {
  update(accessToken: string, id: number, bodyDto: CategoryCreateDto): Promise<void>;
}

export interface CategoryFindByIdRepository {
  findById(accessToken: string, id: number): Promise<ProductCategoryResponse>;
}
