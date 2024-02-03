import { ProductCreateDto, ProductRepository } from "~/infra/http-client/product-repository";

export class ProductCreate {
  constructor(private readonly productRepository = new ProductRepository()) {}

  async create(accessToken: string, values: ProductCreateDto) {
    const response = await this.productRepository.create(accessToken, values);

    return response;
  }
}
