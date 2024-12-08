import { SEOHandle } from "@nasa-gcn/remix-seo";
import { redirect } from "@vercel/remix";

export function loader() {
	return redirect("/events", { status: 301 });
}

export const handle: SEOHandle = {
	getSitemapEntries: () => {
		return null;
	},
};
