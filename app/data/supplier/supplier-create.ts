import { SupplierRepository } from "~/infra/http-client/supplier-repository";

export interface CreateDto {
  name: string;
  cnpj?: string;
  email?: string;
  phone?: string;
}

export class SupplierCreate {
  constructor(private readonly repository = new SupplierRepository()) {}

  async create(accessToken: string, values: CreateDto) {
    await this.repository.create(accessToken, {
      name: values.name,
      cnpj: values?.cnpj,
      email: values?.email,
      phone: values?.phone,
    });
  }
}
