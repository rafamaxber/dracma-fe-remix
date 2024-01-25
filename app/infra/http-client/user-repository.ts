import {
  ForgotPasswordRepository,
  LoginResponse,
  LoginUserDto,
  RegisterUserType,
  ResetPasswordRepository,
  UserLoginRepository,
  UserRegisterRepository
} from "~/data/auth/protocols";
import { dracmaApiClient } from './setup.server';

export class UserRepository implements UserRegisterRepository, UserLoginRepository, ForgotPasswordRepository, ResetPasswordRepository {
  async register(createUserDto: Omit<RegisterUserType, 'id'>): Promise<Omit<RegisterUserType, 'password'>> {
    const response = await dracmaApiClient.post('/v1/auth/register', createUserDto);

    return response.data;
  }

  async login(loginUserDto: LoginUserDto): Promise<LoginResponse> {
    const response = await dracmaApiClient.post('/v1/auth/login', loginUserDto);

    return response.data;
  }

  async forgotPassword(forgotPasswordDto: Pick<RegisterUserType, 'email'>): Promise<string> {
    const response = await dracmaApiClient.post('/v1/auth/forgot-password', forgotPasswordDto);

    return response.data;
  }

  async resetPassword(resetPasswordDto: Pick<RegisterUserType, 'password'>): Promise<string> {
    const response = await dracmaApiClient.post('/v1/auth/reset-password', resetPasswordDto);

    return response.data;
  }
}
