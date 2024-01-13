import { RegisterUserType, UserRegisterRepository } from "./protocols";

export class UserRegister {
  constructor(
    private userRegisterRepository: UserRegisterRepository,
  ) {}

  async execute(createUserDto: RegisterUserType) {
    return this.userRegisterRepository.register(createUserDto);
  }
}
