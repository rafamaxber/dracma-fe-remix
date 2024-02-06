import { dracmaApiClient } from "./setup.server";
import { ListAllResponse, ListAllFilterType } from "~/domain/general-types";

export interface SupplierType {
  id: number
  name: string
  cnpj?: string
  email?: string
  phone?: string
  createdAt: string
  companyId: number
  updatedAt: string
  deletedAt: string
}

export interface SupplierResponseList extends ListAllResponse<SupplierType>{}
export interface SupplierQueryFilterDto extends ListAllFilterType {
  name?: string;
}

export type SupplierCreateDto = Omit<SupplierType, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'companyId'>;

export class SupplierRepository {
  async create(accessToken: string, values: SupplierCreateDto) {
    const response = await dracmaApiClient.post('/v1/supplier', values, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    return response.data;
  }

  async listAll(accessToken: string, filterDto: SupplierQueryFilterDto): Promise<SupplierResponseList> {
    const { data } = await dracmaApiClient.get('/v1/supplier', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      params: filterDto
    });

    return data;
  }

  async delete(accessToken: string, id: number): Promise<void> {
    await dracmaApiClient.delete(`/v1/supplier/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

  async update(accessToken: string, id: number, values: SupplierCreateDto): Promise<void> {
    await dracmaApiClient.patch(`/v1/supplier/${id}`, values, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
    });
  }

  async findById(accessToken: string, id: number): Promise<Omit<SupplierType, 'companyId'>> {
    const { data } = await dracmaApiClient.get(`/v1/supplier/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    return data;
  }
}
