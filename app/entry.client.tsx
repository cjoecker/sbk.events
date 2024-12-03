import { RemixBrowser } from "@remix-run/react";
import i18next from "i18next";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";
import Fetch from "i18next-fetch-backend";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { getInitialNamespaces } from "remix-i18next/client";
import { inject } from '@vercel/analytics';

import { defaultNS, fallbackLng, supportedLngs } from "~/config/i18n";

inject();

async function main() {
	await i18next
		.use(initReactI18next)
		.use(Fetch)
		.use(I18nextBrowserLanguageDetector)
		.init({
			defaultNS,
			fallbackLng,
			supportedLngs,
			ns: getInitialNamespaces(),
			detection: {
				order: ["htmlTag"],
				caches: [],
			},
			backend: {
				loadPath: "/api/locales?lng={{lng}}&ns={{ns}}",
			},
		});

	startTransition(() => {
		hydrateRoot(
			document,
			<I18nextProvider i18n={i18next}>
				<StrictMode>
					<RemixBrowser />
				</StrictMode>
			</I18nextProvider>
		);
	});
}

// eslint-disable-next-line unicorn/prefer-top-level-await
main().catch((error: unknown) => {
	console.error(error);
});
