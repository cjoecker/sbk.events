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
import Background from "~/images/background.jpg";
import RobotoFontRegularWoff2 from "~/fonts/roboto-flex-v26-latin-regular.woff2";

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
	return [
		{ rel: "stylesheet", href: stylesheet },
		{
			rel: "preload",
			as: "font",
			href: RobotoFontRegularWoff2,
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
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body
				style={{
					backgroundImage: `url(${Background})`,
					paddingBottom: "env(safe-area-inset-bottom)",
				}}
				className="h-screen w-screen overflow-hidden bg-black bg-cover bg-center text-base font-normal text-white"
			>
				<main className=" h-full overflow-y-auto overflow-x-hidden">
					<div className=" max-w-2xl mx-auto">
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
