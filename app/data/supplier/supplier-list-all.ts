import { SupplierQueryFilterDto, SupplierRepository, SupplierResponseList, SupplierType } from "~/infra/http-client/supplier-repository";

export class SupplierListAll {
  constructor(private readonly supplierRepository = new SupplierRepository()) {}

  async listAll(accessToken: string, filters: SupplierQueryFilterDto): Promise<Omit<SupplierResponseList, 'companyId' | 'updatedAt' | 'deletedAt'>> {
    const data = await this.supplierRepository.listAll(accessToken, filters);

    return {
      results: data.results.map((supplier) => ({
        id: supplier.id,
        name: supplier.name,
        cnpj: supplier.cnpj,
        email: supplier.email,
        phone: supplier.phone,
        createdAt: supplier.createdAt,
      })) as SupplierType[],
      pagination: data.pagination,
    };
  }
}
