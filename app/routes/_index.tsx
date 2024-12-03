import { SEOHandle } from "@nasa-gcn/remix-seo";
import { MetaFunction, redirect } from "@remix-run/node";
import { useTranslation } from "react-i18next";

export const meta: MetaFunction = () => {
	return [
		{ title: "SBK Events" },
		{ name: "description", content: "salsa bachata and kizomba events" },
		{
			name: "keywords",
			content:
				"salsa events, bachata events, kizomba events, salsa dance, bachata dance, kizomba dance, salsa festivals, bachata festivals, kizomba festivals, salsa parties, bachata parties, kizomba parties, salsa workshops, bachata workshops, kizomba workshops",
		},
	];
};

export function loader() {
	return redirect("/events", { status: 301 });
}

export const handle: SEOHandle = {
	getSitemapEntries: () => {
		return null;
	},
};

export default function Index() {
	const { t } = useTranslation();
	return (
		<div
			className="v-screem flex h-screen"
			style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}
		>
			<div className="m-auto flex flex-col gap-2 text-center">
				<h1 className="text-3xl text-white">{t("worldWideSbkEvents")}</h1>
				<h2 className="m-auto text-2xl text-gray-400">{t("comingSoon")}</h2>
			</div>
		</div>
	);
}
