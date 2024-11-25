import { generateSitemap } from '@nasa-gcn/remix-seo'
import { type ServerBuild, type LoaderFunctionArgs } from '@remix-run/node'
import { getDomainUrl } from "~/utils/remix";

// @ts-expect-error Virtual modules are not recognized by TypeScript
// See issue here: https://github.com/nasa-gcn/remix-seo/issues/7
// eslint-disable-next-line import/no-unresolved
import { routes } from "virtual:remix/server-build";



export function loader({ request }: LoaderFunctionArgs) {
	return generateSitemap(request, routes, {
		siteUrl: getDomainUrl(request),
		headers: {
			'Cache-Control': `public, max-age=${60 * 5}`,
		},
	});
}
