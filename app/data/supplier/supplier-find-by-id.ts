import { SupplierRepository, SupplierType } from "~/infra/http-client/supplier-repository";

export class SupplierFindById {
  constructor(private readonly repository = new SupplierRepository()) {}

  async find(accessToken: string, id: number): Promise<Omit<SupplierType, "companyId">> {
    const data = await this.repository.findById(accessToken, id);

    return data;
  }
}
