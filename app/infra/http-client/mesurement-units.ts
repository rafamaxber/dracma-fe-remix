import { ListAllFilterType, ListAllResponse } from "~/domain/general-types";
import { dracmaApiClient } from "./setup.server";

export interface MesurementUnitsResponse {
  id: number
  name: string
  createdAt: string
  updatedAt: string
  deletedAt: string
}

export type MesurementUnitsResponseList = ListAllResponse<MesurementUnitsResponse>

export interface MeasurementUnitsFilterDto extends ListAllFilterType {
  name?: string;
}

export class MesurementUnitsRepository {
  async listAll(accessToken: string, filterDto: MeasurementUnitsFilterDto): Promise<MesurementUnitsResponseList> {
    const { data } = await dracmaApiClient.get('/v1/units', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      params: filterDto
    });

    return data;
  }
}
