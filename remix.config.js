/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/.*"],
  tailwind: true,
  postcss: true,
  serverModuleFormat: 'esm',
  serverDependenciesToBundle: [
    /^react-icons/,
    '@remix-pwa/sw',
    '@remix-pwa/strategy',
    '@remix-pwa/dev',
    '@remix-pwa/sync',
    '@remix-pwa/cache',
    'idb',
    "remix-i18next",
  ],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  // serverBuildPath: "build/index.js",
};
