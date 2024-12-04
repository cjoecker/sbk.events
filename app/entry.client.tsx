import { RemixBrowser } from "@remix-run/react";
import { inject } from "@vercel/analytics";
import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { getInitialNamespaces } from "remix-i18next/client";

import * as i18n from "~/config/i18n";

inject();

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
