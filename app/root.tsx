import { LoaderFunctionArgs, LinksFunction } from "@remix-run/node";
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

import i18nServer, { localeCookie } from "./modules/i18n.server";

import { fallbackLng, setI18nLocale } from "~/config/i18n";
import stylesheet from "~/styles/tailwind.css?url";
import { json } from "~/utils/remix";

export const handle = { i18n: ["translation"] };

export async function loader({ request }: LoaderFunctionArgs) {
	const locale = await i18nServer.getLocale(request);
	return json(
		{ locale },
		{ headers: { "Set-Cookie": await localeCookie.serialize(locale) } }
	);
}

export const links: LinksFunction = () => {
	return [{ rel: "stylesheet", href: stylesheet }];
};

export function Layout({ children }: { children: React.ReactNode }) {
	const loaderData = useLoaderData<typeof loader>();
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	const locale = loaderData?.locale ?? fallbackLng;
	setI18nLocale(locale);
	return (
		<html lang={locale}>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				{children}
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
