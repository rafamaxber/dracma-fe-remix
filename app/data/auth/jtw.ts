export class JwtService {
  static format(token: string | undefined) {
    return JSON.parse(atob(token?.split('.')[1] || ''));
  }
}
