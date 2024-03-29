import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

installGlobals();

export default defineConfig({
  ssr: {
    noExternal: ["react-icons"]
  },
  server: {
    port: 3000,
  },
  plugins: [remix({
    ignoredRouteFiles: ["**/*.css"],
  }), tsconfigPaths()],
});
