import { dracmaApiClient } from './setup';
import { CompanyCreateRepository, CompanyCreateDto } from "~/data/company/protocols";

export class CompanyRepository implements CompanyCreateRepository {
  async createCompany(accessToken: string, createCompanyDto: CompanyCreateDto) {

    const response = await dracmaApiClient.post('/v1/company/create-my', {
      description: "",
      initialBalanceDate: new Date().toISOString(),
      name: createCompanyDto.companyName,
      role: createCompanyDto.role,
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  }

}
