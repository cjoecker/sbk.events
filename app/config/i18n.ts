import { es, de, enUS, Locale } from "date-fns/locale";
import { serverOnly$ } from "vite-env-only/macros";

import enTranslation from "~/locales/en";
import esTranslation from "~/locales/es";
import { setDefaultOptions } from "date-fns";

export const supportedLngs = ["es", "en", "de"];

export const fallbackLng = "en";

export const defaultNS = "translation";

export const resources = serverOnly$({
	en: { translation: enTranslation },
	es: { translation: esTranslation },
});

const dateFnsLocales: Record<string, Locale> = {
	es,
	de,
	en: enUS,
};
export function setI18nLocale(locale: string | undefined) {
	const dateFnsLocale = dateFnsLocales[locale ?? "en"];
	setDefaultOptions({ locale: dateFnsLocale });
}
