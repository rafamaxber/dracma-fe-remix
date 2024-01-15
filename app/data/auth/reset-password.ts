import { ResetPasswordDto, ResetPasswordRepository } from "./protocols";

export class ResetPassword {
  constructor(
    private resetPasswordRepository: ResetPasswordRepository,
  ) {}

  async execute(resetPasswordDto: ResetPasswordDto) {
    return this.resetPasswordRepository.resetPassword(resetPasswordDto);
  }
}
