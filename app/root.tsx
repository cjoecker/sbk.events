import { LoaderFunctionArgs, LinksFunction, MetaFunction } from "@remix-run/node";
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
	useRouteError,
} from "@remix-run/react";
import { useEffect } from "react";
import { useChangeLanguage } from "remix-i18next/react";
import Background from "~/images/background.jpg";
import LibreFranklinNormalFont from "~/fonts/libre-franklin-v18-latin-200.woff2";
import LibreFranklinBoldFont from "~/fonts/libre-franklin-v18-latin-regular.woff2";

import i18nServer, { localeCookie } from "./modules/i18n.server";

import { fallbackLng, setI18nLocale } from "~/config/i18n";
import stylesheet from "~/styles/tailwind.css?url";
import { json } from "~/utils/remix";

export const handle = { i18n: ["translation"] };

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [
		{
			title: data?.pageTitle,
		},
		{ charset: "utf-8" },
		{
			name: "description",
			content: data?.pageDescription,
		},
		{
			name: "keywords",
			content: data?.pageKeywords,
		},
		{
			name: "viewport",
			content:
				"width=device-width,initial-scale=1,viewport-fit=cover,maximum-scale=1",
		},
		{
			name: "theme-color",
			content: "#000a1d",
		},
	];
};

export async function loader({ request }: LoaderFunctionArgs) {
	const locale = await i18nServer.getLocale(request);
	const t = await i18nServer.getFixedT(request);
	const pageTitle = t("pageTitle");
	const pageDescription = t("pageDescription");
	const pageKeywords = t("pageKeywords");
	return json(
		{ locale, pageTitle, pageDescription, pageKeywords },
		{ headers: { "Set-Cookie": await localeCookie.serialize(locale) } }
	);
}

export const links: LinksFunction = () => {
	return [
		{ rel: "stylesheet", href: stylesheet },
		{
			rel: "preload",
			as: "font",
			href: LibreFranklinNormalFont,
			type: "font/woff",
			crossOrigin: "anonymous",
		},
		{
			rel: "preload",
			as: "font",
			href: LibreFranklinBoldFont,
			type: "font/woff",
			crossOrigin: "anonymous",
		},
	];
};

export function Layout({ children }: { children: React.ReactNode }) {
	const loaderData = useLoaderData<typeof loader>();
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	const locale = loaderData?.locale ?? fallbackLng;
	setI18nLocale(locale);
	return (
		<html lang={locale}>
			<head>
				<Meta />
				<Links />
			</head>
			<body
				style={{
					backgroundImage: `url(${Background})`,
				}}
				className="font-body h-[100svh] w-[100svw] overflow-hidden bg-black bg-cover bg-right text-base font-normal text-white sm:bg-center "
			>
				<main
					className="h-full overflow-y-auto overflow-x-hidden safe-area-padding"
				>
					<div className="mx-auto max-w-2xl p-2">
						{/*<div className="clouds" />*/}
						{children}
					</div>
				</main>
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	const { locale } = useLoaderData<typeof loader>();
	useChangeLanguage(locale);
	return <Outlet />;
}

export function ErrorBoundary() {
	const error = useRouteError();
	useEffect(() => {
		console.error("error", error);
	}, [error]);

	return (
		<div>
			<h1>Unexpected Error</h1>
		</div>
	);
}
