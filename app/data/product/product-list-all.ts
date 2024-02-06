import { ProductRepository } from "~/infra/http-client/product-repository";
import { ProductResponseList, ProductFilterDto } from "./protocols";

export class ProductListAll {
  constructor(private readonly productRepository = new ProductRepository()) {}

  async listAll(accessToken: string, filters?: ProductFilterDto): Promise<ProductResponseList> {
    const data = await this.productRepository.listAll(accessToken, {
      name: filters?.name ?? '',
      category: filters?.category ?? '',
      code: filters?.code ?? '',
      page: filters?.page ?? 1,
      perPage: filters?.perPage ?? 10,
    });

    return {
      results: data.results.map((product) => ({
        id: product.id,
        name: product.name,
        categories: product.categories.map((category) => category.name),
        price_sell: product?.price_sell || null,
        price_cost: product?.price_cost || null,
        code: product.code,
        stock_quantity: product.quantity,
        stock_min: product?.stock_min,
        stock_max: product?.stock_max,
        stock: product.stock,
        status: product.status,
        supplier: product.supplier?.name || '',
        image: product.images[0]?.imageUrl,
      })),
      pagination: data.pagination,
    }
  }
}
