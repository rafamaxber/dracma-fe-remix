import { dracmaApiClient } from "./setup.server";
import { ListAllResponse, ListAllFilterType } from "~/domain/general-types";

export interface SupplierType {
  id: number
  name: string
  cnpj: string
  email: string
  phone: string
  createdAt: string
  companyId: number
  updatedAt: string
  deletedAt: string
}

export interface SupplierResponseList extends ListAllResponse<SupplierType>{}
export interface SupplierQueryFilterDto extends ListAllFilterType {
  name?: string;
}

export class SupplierRepository {
  async listAll(accessToken: string, filterDto: SupplierQueryFilterDto): Promise<SupplierResponseList> {
    const { data } = await dracmaApiClient.get('/v1/supplier', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      params: filterDto
    });

    return data;
  }
}
