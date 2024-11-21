import { es, de, enUS, Locale } from "date-fns/locale";
import { serverOnly$ } from "vite-env-only/macros";

import enTranslation from "~/locales/en";
import esTranslation from "~/locales/es";

export const supportedLngs = ["es", "en", "de"];

export const fallbackLng = "en";

export const defaultNS = "translation";

export const resources = serverOnly$({
	en: { translation: enTranslation },
	es: { translation: esTranslation },
});

export const dateFnsLocales: Record<string, Locale> = {
	es,
	de,
	en: enUS,
};
