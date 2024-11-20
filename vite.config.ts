import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import { envOnlyMacros } from "vite-env-only";
import tsconfigPaths from "vite-tsconfig-paths";
import { netlifyPlugin } from "@netlify/remix-adapter/plugin";

export default defineConfig({
  plugins: [envOnlyMacros(),remix(), netlifyPlugin(), tsconfigPaths()],
  server: { port: 4000 },
});
