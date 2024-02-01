import { redirect } from "@remix-run/node";
import { AuthCookie } from "~/data/auth/user-auth-cookie";

export const action = async () => AuthCookie.logout();

export const loader = async () => redirect("/login");
