import { ForgotPasswordRepository, ForgotPasswordDto } from "./protocols";

export class ForgotPassword {
  constructor(
    private forgotPasswordRepository: ForgotPasswordRepository,
  ) {}

  async execute(forgotPasswordDto: ForgotPasswordDto) {
    return this.forgotPasswordRepository.forgotPassword(forgotPasswordDto);
  }
}
