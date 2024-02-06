import { SupplierRepository, SupplierCreateDto } from "~/infra/http-client/supplier-repository";

export class SupplierUpdateById {
  constructor(private readonly repository = new SupplierRepository()) {}

  async update(accessToken: string, id: number, values: SupplierCreateDto) {
    const data = await this.repository.update(accessToken, id, values);

    return data;
  }
}
