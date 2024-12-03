import { generateRobotsTxt } from "@nasa-gcn/remix-seo";
import { type LoaderFunctionArgs } from "@vercel/remix";

import { getDomainUrl } from "~/utils/remix";

export function loader({ request }: LoaderFunctionArgs) {
	return generateRobotsTxt([
		{ type: "sitemap", value: `${getDomainUrl(request)}/sitemap.xml` },
	]);
}
