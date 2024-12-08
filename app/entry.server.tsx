import { RemixServer } from "@remix-run/react";
import * as Sentry from "@sentry/remix";
import { handleRequest } from "@vercel/remix";
import type { EntryContext } from "@vercel/remix";
import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";

import * as i18n from "./config/i18n";

import i18nServer from "~/modules/i18n.server";

export const handleError = Sentry.wrapHandleErrorWithSentry((error) => {
	console.error("Sentry Error", error);
});

export default async function _handleRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	remixContext: EntryContext
) {
	const instance = createInstance();
	const lng = await i18nServer.getLocale(request);
	const ns = i18nServer.getRouteNamespaces(remixContext);

	await instance.use(initReactI18next).init({ ...i18n, lng, ns });

	const remixServer = <RemixServer context={remixContext} url={request.url} />;
	return handleRequest(
		request,
		responseStatusCode,
		responseHeaders,
		remixServer
	);
}
