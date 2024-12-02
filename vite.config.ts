import { vitePlugin as remix } from "@remix-run/dev";
import { vercelPreset } from "@vercel/remix/vite";
import { defineConfig } from "vite";
import { envOnlyMacros } from "vite-env-only";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [
		envOnlyMacros(),
		remix({
			presets: [vercelPreset()],
		}),
		tsconfigPaths(),
	],
	server: { port: 4000 },
});
