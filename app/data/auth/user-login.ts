import { LoginUserDto, UserLoginRepository } from "./protocols";

export class UserLogin {
  constructor(
    private userLoginRepository: UserLoginRepository,
  ) {}

  async execute(loginUserDto: LoginUserDto) {
    return this.userLoginRepository.login(loginUserDto);
  }
}
