import { PreventFlashOnWrongTheme, ThemeProvider, useTheme } from "remix-themes"

import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { useSWEffect , LiveReload } from '@remix-pwa/sw';
import { useChangeLanguage } from "remix-i18next";
import { useTranslation } from "react-i18next";

import { themeSessionResolver } from "./sessions.server";
import styles from "~/components/styles/tailwind.css";
import { cn } from "~/lib/utils";
import { AuthCookie } from "~/data/auth/user-auth-cookie";
import { UserDataProvider } from "~/components/user-auth-data";
import i18next from "~/i18next.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
]

export const handle = {
  // In the handle export, we can add a i18n key with namespaces our route
  // will need to load. This key can be a single string or an array of strings.
  // TIP: In most cases, you should set this to your defaultNS from your i18n config
  // or if you did not set one, set it to the i18next default namespace "translation"
  i18n: "common",
};

export async function loader({ request }: LoaderFunctionArgs) {
  const ENV = {
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_UPLOAD_PRESET: process.env.CLOUDINARY_UPLOAD_PRESET,
  }
  const [userData, { getTheme }, locale] = await Promise.all([
    AuthCookie.getUserAuthData(request),
    themeSessionResolver(request),
    i18next.getLocale(request)
  ])

  return {
    userData,
    locale,
    theme: getTheme(),
    ENV,
  }
}

export default function AppWithProviders() {
  const data = useLoaderData<typeof loader>()

  useChangeLanguage(data.locale);

  return (
    <ThemeProvider specifiedTheme={data.theme} themeAction="/action/set-theme">
      <UserDataProvider userData={data.userData}>
        <App />
      </UserDataProvider>
    </ThemeProvider>
  )
}

export function App() {
  // useSWEffect();

  const data = useLoaderData<typeof loader>()
  const { i18n } = useTranslation();
  const [theme] = useTheme()

  return (
    <html lang={data.locale} dir={i18n.dir()} className={cn(theme)} style={{ colorScheme: String(theme) }}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#808080" />
        <meta name="apple-mobile-web-app-title" content="Dracma" />
        <meta name="application-name" content="Dracma" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-TileImage" content="/icons/mstile-144x144.png" />
        <meta name="theme-color" content="#000000" />

        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} />
        <Links />
      </head>
      <body className="h-screen bg-customBg">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />

        <script src="https://widget.cloudinary.com/v2.0/global/all.js" type="text/javascript"></script>
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const data = useLoaderData<typeof loader>()
  const { i18n } = useTranslation();
  const error = useRouteError();
  console.log('useRouteError: \n');
  console.error(error);
  console.log('\n');

  return (
    <html lang={data.locale} dir={i18n.dir()}>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body className="h-screen bg-customBg">
      Error
        <Scripts />
      </body>
    </html>
  );
}
