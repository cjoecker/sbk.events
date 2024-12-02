import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import { envOnlyMacros } from "vite-env-only";
import tsconfigPaths from "vite-tsconfig-paths";
import { vercelPreset } from "@vercel/remix/vite";


export default defineConfig({
	plugins: [envOnlyMacros(), remix({
		presets: [vercelPreset()],
	}), tsconfigPaths()],
	server: { port: 4000 },
});
