import { netlifyPlugin } from "@netlify/remix-edge-adapter/plugin";
import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import { envOnlyMacros } from "vite-env-only";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [envOnlyMacros(),remix(), netlifyPlugin(), tsconfigPaths()],
  server: { port: 4000 },
});
