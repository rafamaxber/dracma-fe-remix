import { LoginResponse } from "~/data/auth/protocols";

export type CompanyCreateDto = {
  companyName: string;
  role?: string;
}

export interface CompanyCreateRepository {
  createCompany(accessToken: string, createCompanyDto: CompanyCreateDto): Promise<LoginResponse>;
}
