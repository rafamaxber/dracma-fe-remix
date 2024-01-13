import { LoginResponse, LoginUserDto, RegisterUserType, UserLoginRepository, UserRegisterRepository } from "~/data/auth/protocols";
import { dracmaApiClient } from './setup';

export class UserRepository implements UserRegisterRepository, UserLoginRepository {
  async register(createUserDto: Omit<RegisterUserType, 'id'>): Promise<Omit<RegisterUserType, 'password'>> {
    const response = await dracmaApiClient.post('/v1/auth/register', createUserDto);

    return response.data;
  }

  async login(loginUserDto: LoginUserDto): Promise<LoginResponse> {
    const response = await dracmaApiClient.post('/v1/auth/login', loginUserDto);

    return response.data;
  }
}
