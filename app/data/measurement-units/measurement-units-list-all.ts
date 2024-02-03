import { MesurementUnitsRepository, MeasurementUnitsFilterDto, MesurementUnitsResponseList } from "~/infra/http-client/mesurement-units";

export class MeasurementUnitsListAll {
  constructor(private readonly measurementUnitsRepository = new MesurementUnitsRepository()) {}

  async listAll(accessToken: string, filterDto: MeasurementUnitsFilterDto): Promise<MesurementUnitsResponseList> {
    const response = await this.measurementUnitsRepository.listAll(accessToken, filterDto);

    return response;
  }
}
