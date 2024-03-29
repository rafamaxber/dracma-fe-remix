import { TypedResponse, createCookie, redirect } from "@remix-run/node";
import { routes } from "~/components/navigation/navigationItems";
import { JwtService } from "./jtw";

export interface UserAuthType {
  id: string;
  companyId?: string;
  firstName: string;
  lastName: string;
  nickName: string;
  iat?: number;
  exp?: number;
}

export type UserDataType = Pick<UserAuthType, 'firstName' | 'nickName'>;

export class AuthCookie {
  static get() {
    const secret = process.env.COOKIE_SECRET;

    if (!secret) {
      throw new Error("Missing COOKIE_SECRET environment variable");
    }

    return createCookie("auth", {
      // domain: process.env.DOMAIN,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secrets: [secret],
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
    });
  }

  static async requireAuthCookie(
    request: Request,
  ): Promise<string | TypedResponse<never>> {
    const authCookie = request.headers.get("Cookie");
    const accessToken = await AuthCookie.get().parse(authCookie);

    if (accessToken) {
      return accessToken;
    }

    throw redirect(routes.login, {
      headers: {
        "Set-Cookie": await AuthCookie.get().serialize("", {
          maxAge: 0,
        }),
      },
    });
  }

  static async redirectIfAuthenticated(request: Request): Promise<void | TypedResponse<never>> {
    const authCookie = request.headers.get("Cookie");
    const accessToken = await AuthCookie.get().parse(authCookie);

    if (accessToken) {
      throw redirect(routes.dashboard);
    }
  }

  static async getUserAuthData(request: Request): Promise<UserDataType> {
    const authCookie = request.headers.get("Cookie");
    const accessToken = await AuthCookie.get().parse(authCookie);

    if (accessToken) {
      const accessTokenJwt: UserAuthType = JwtService.format(accessToken);
      return { firstName: accessTokenJwt.firstName, nickName: accessTokenJwt.nickName } ;
    }

    return { firstName: "", nickName: "" };
  }

  static async logout() {
    return redirect("/login", {
      headers: {
        "Set-Cookie": await AuthCookie.get().serialize("", {
          maxAge: 0,
        }),
      },
    });
  }
}
