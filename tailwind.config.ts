import type { Config } from "tailwindcss";

// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment
const { nextui } = require("@nextui-org/react");

export default {
	content: [
		"./app/**/*.{js,jsx,ts,tsx}",
		"./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		fontFamily: {
			body: ["Libre Franklin", "Calibri", "Arial"],
		},
		fontWeight: {
			normal: "200",
			bold: "400",
		},
	},
	darkMode: "class",
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call
	plugins: [
		nextui({
			layout: {
				radius: {
					small: "1px", // rounded-small
					medium: "3px", // rounded-medium
					large: "4px", // rounded-large
				},
			},
			themes: {
				dark: {
					colors: {
						primary: "#005cd1",
					},
				},
			},
		}),
	],
} satisfies Config;
