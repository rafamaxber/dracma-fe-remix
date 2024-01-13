export interface RegisterUserType {
  id: string;
  firstName: string;
  lastName: string;
  nickName: string;
  email: string;
  password: string;
}

export type LoginUserDto = Pick<RegisterUserType, 'email' | 'password'>

export type LoginResponse = {
  access_token: string;
}

export interface UserRegisterRepository {
  register(createUserDto: Omit<RegisterUserType, 'id'>): Promise<Omit<RegisterUserType, 'password'>>;
}

export interface UserLoginRepository {
  login(loginUserDto: Pick<RegisterUserType, 'email' | 'password'>): Promise<LoginResponse>;
}
