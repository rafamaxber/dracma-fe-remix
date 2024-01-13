import { TypedResponse, createCookie, redirect } from "@remix-run/node"

export interface UserAuthType {
  id: string;
  companyId?: string;
  firstName: string;
  lastName: string;
  nickName: string;
  iat?: number;
  exp?: number;
}

export class AuthCookie {
  static get() {
      const secret = process.env.COOKIE_SECRET

      if (!secret) {
        throw new Error("Missing COOKIE_SECRET environment variable")
      }

      return createCookie("auth", {
        // domain: process.env.DOMAIN,
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secrets: [secret],
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 1 day
      })
  }

  static async requireAuthCookie(request: Request): Promise<UserAuthType | TypedResponse<never>> {
    const authCookie = request.headers.get('Cookie');
    const accessToken = await (AuthCookie.get())
      .parse(authCookie);

    if (!accessToken) {
      throw redirect("/login", {
        headers: {
          "Set-Cookie": await (AuthCookie.get()).serialize('', {
            maxAge: 0,
          }),
        },
      });
    }

    return atob(accessToken.split('.')[1]) as unknown as UserAuthType;
  }
}
