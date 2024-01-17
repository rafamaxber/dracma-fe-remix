import { CompanyCreateDto, CompanyCreateRepository } from "./protocols";
import { CompanyRepository } from '~/infra/http-client/company-repository';

export class CompanyCreate {
  constructor(
    private companyCreateRepository: CompanyCreateRepository = new CompanyRepository(),
  ) {}

  async create(accessToken: string, createUserDto: CompanyCreateDto) {
    return this.companyCreateRepository.createCompany(accessToken, createUserDto);
  }
}
