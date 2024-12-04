import { generateSitemap } from "@nasa-gcn/remix-seo";
import { ServerRouteManifest } from "@remix-run/server-runtime/dist/routes";
import { type LoaderFunctionArgs } from "@vercel/remix";
// @ts-expect-error Virtual modules are not recognized by TypeScript
// See issue here: https://github.com/nasa-gcn/remix-seo/issues/7
import { routes } from "virtual:remix/server-build";

import { getDomainUrl } from "~/utils/remix";

export function loader({ request }: LoaderFunctionArgs) {
	return generateSitemap(request, routes as ServerRouteManifest, {
		siteUrl: getDomainUrl(request),
		headers: {
			"Cache-Control": `public, max-age=${60 * 5}`,
		},
	});
}
