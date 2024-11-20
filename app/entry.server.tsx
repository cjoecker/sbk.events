// This is mostly copied from the Remix Deno template
// https://github.com/remix-run/remix/blob/main/templates/classic-remix-compiler/deno/app/entry.server.tsx

// When using the classic Remix compiler, this is imported directly from the site's `app/entry.server`.
// When using Vite, we load this as a virtual module, so that it can be loaded conditionally
// depending on whether we are in dev mode or not. This file is only loaded in production.
// We need to do this because in dev mode we are going through Vite which does not yet suport
// Deno and thus uses Node.js. See https://github.com/vitejs/vite/discussions/16358.

import type { AppLoadContext, EntryContext } from '@netlify/remix-runtime'
import { RemixServer } from '@remix-run/react'
import { isbot } from 'isbot'
import * as ReactDOMServer from 'react-dom/server'
import { createInstance } from "i18next";
import i18nServer from "~/modules/i18n.server";
import { I18nextProvider, initReactI18next } from "react-i18next";
import * as i18n from "~/config/i18n";

const ABORT_DELAY = 5000;

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  _loadContext: AppLoadContext,
) {
  const instance = createInstance();
  const lng = await i18nServer.getLocale(request);
  const ns = i18nServer.getRouteNamespaces(remixContext);

  await instance.use(initReactI18next).init({ ...i18n, lng, ns });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ABORT_DELAY);

  const body = await ReactDOMServer.renderToReadableStream(
    <I18nextProvider i18n={instance}>
      <RemixServer
        context={remixContext}
        url={request.url}
        abortDelay={ABORT_DELAY}
      /></I18nextProvider>,
    {
      signal: controller.signal,
      onError(error: unknown) {
        if (!controller.signal.aborted) {
          // Log streaming rendering errors from inside the shell
          console.error(error);
        }
        responseStatusCode = 500;
      },
    }
  );

  body.allReady.then(() => clearTimeout(timeoutId));

  if (isbot(request.headers.get("user-agent") || "")) {
    await body.allReady;
  }

  responseHeaders.set("Content-Type", "text/html");
  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
