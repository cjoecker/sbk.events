import { RemixBrowser, useLocation, useMatches } from "@remix-run/react";
import * as Sentry from "@sentry/remix";
import { inject } from "@vercel/analytics";
import { injectSpeedInsights } from "@vercel/speed-insights";
import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { startTransition, StrictMode, useEffect } from "react";
import { hydrateRoot } from "react-dom/client";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { getInitialNamespaces } from "remix-i18next/client";

import * as i18n from "~/config/i18n";

Sentry.init({
	dsn: "https://2984a28357ecebb8ffff932fd110fe1e@o4508432566255616.ingest.de.sentry.io/4508432570318928",
	tracesSampleRate: 1,

	integrations: [
		Sentry.browserTracingIntegration({
			useEffect,
			useLocation,
			useMatches,
		}),
		Sentry.replayIntegration({
			maskAllText: true,
			blockAllMedia: true,
		}),
	],

	replaysSessionSampleRate: 0.1,
	replaysOnErrorSampleRate: 1,
});

inject();
injectSpeedInsights();

// eslint-disable-next-line @typescript-eslint/no-floating-promises
i18next
	.use(initReactI18next)
	.use(LanguageDetector)
	.init({
		react: { useSuspense: false },
		ns: getInitialNamespaces(),
		detection: { order: ["htmlTag"], caches: [] },
		backend: {
			cache: "no-store",
		},
		...i18n,
	})
	// eslint-disable-next-line unicorn/prefer-top-level-await
	.then(hydrate);

function hydrate() {
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
