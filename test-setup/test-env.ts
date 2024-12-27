import "dotenv/config";
import "./db.ts";
import "@testing-library/jest-dom/vitest";
import deTranslation from "~/locales/en";


vi.mock("react-i18next", () => {
	return {
		useTranslation: () => {
			return {
				t: (key: string, args?: Record<string, string>) => {
					let translation =
						(deTranslation as Record<string, string>)[key] ?? key;

					if (args) {
						const keys = Object.keys(args);
						keys.forEach((key) => {
							translation = translation.replace(`{{${key}}}`, args[key]);
						});
					}
					return translation;
				},
				i18n: {
					language: "de",
				},
			};
		},
	};
});

