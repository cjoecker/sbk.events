import { NextUIProvider, Progress } from "@nextui-org/react";
import { I18nProvider } from "@react-aria/i18n";
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
	useNavigation,
	useRouteError,
} from "@remix-run/react";
import { captureRemixErrorBoundaryError, withSentry } from "@sentry/remix";
import { LoaderFunctionArgs, LinksFunction, MetaFunction } from "@vercel/remix";
import { ReactNode, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useChangeLanguage } from "remix-i18next/react";

import i18nServer, { localeCookie } from "./modules/i18n.server";

import { fallbackLng, setI18nLocale } from "~/config/i18n";
import LibreFranklinNormalFont from "~/fonts/libre-franklin-v18-latin-200.woff2";
import LibreFranklinBoldFont from "~/fonts/libre-franklin-v18-latin-regular.woff2";
import Background from "~/images/background.webp";
import stylesheet from "~/styles/tailwind.css?url";
import { json } from "~/utils/remix";
import { getMetas } from "~/utils/seo";

export const handle = { i18n: ["translation"] };

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return getMetas(data?.pageTitle, data?.pageDescription, data?.pageKeywords);
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
			as: "image",
			href: Background,
		},
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
		{
			rel: "icon",
			type: "image/png",
			sizes: "32x32",
			href: "/favicon.png",
		},
		{
			rel: "apple-touch-icon",
			sizes: "180x180",
			href: "/favicons/apple-touch-icon.png",
		},
		{
			rel: "icon",
			type: "image/png",
			sizes: "32x32",
			href: "/favicons/favicon-32x32.png",
		},
		{
			rel: "icon",
			type: "image/png",
			sizes: "16x16",
			href: "/favicons/favicon-16x16.png",
		},
		{ rel: "manifest", href: "/site.webmanifest" },
		{ rel: "icon", href: "/favicon.ico" },
	];
};

export function Layout({ children }: { children: ReactNode }) {
	const loaderData = useLoaderData<typeof loader>();
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	const locale = loaderData?.locale ?? fallbackLng;
	const navigation = useNavigation();
	const isLoading = navigation.state !== "idle";
	setI18nLocale(locale);
	return (
		<html lang={locale} className="dark">
			<head>
				<Meta />
				<Links />
				<script
					async
					src={"https://www.googletagmanager.com/gtag/js?id=ID"}
				></script>
				<script
					dangerouslySetInnerHTML={{
						__html: `
        var host = window.location.hostname;
				if(host != "localhost")
				{
				    window.dataLayer = window.dataLayer || [];
				    function gtag(){dataLayer.push(arguments);}
				    gtag('js', new Date());
				    gtag('config', 'G-942TBH82GN', {
				    page_path: window.location.pathname,
				    });
				}
         `,
					}}
				/>
			</head>
			<body
				style={{
					backgroundImage: `url(${Background})`,
				}}
				className="h-[100svh] w-[100svw] overflow-hidden bg-black bg-cover bg-right font-body text-base font-normal text-white sm:bg-center "
			>
				{isLoading && (
					<Progress
						size="sm"
						isIndeterminate
						aria-label="Loading..."
						className="absolute w-full"
						color={"secondary"}
						style={{ zIndex: 60 }}
					/>
				)}
				<div className="h-full overflow-y-auto overflow-x-hidden">
					<div className="mx-auto flex h-full max-w-2xl flex-col p-2">
						<main className="mb-8 mt-2 flex-1">{children}</main>
						<Footer />
					</div>
				</div>
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

function Footer() {
	const { t } = useTranslation();
	return (
		<footer className="mt-10 flex w-full flex-col pb-2 text-sm">
			<div className="mx-auto">
				{t("madeWith")}{" "}
				<span aria-label={t("love")}>
					♡ {t("by")}{" "}
					<a
						className="text-green-200 underline hover:text-green-400"
						href={"https://jocker.dev/"}
					>
						Christian Jöcker
					</a>
				</span>
			</div>
			<div className="mx-auto mt-0.5 text-center text-xs italic text-gray-300">
				{t("thisIsAnOpenSourceProject")}{" "}
				<a
					className="underline hover:text-gray-400"
					href={"https://github.com/cjoecker/sbk.events"}
				>
					{t("contributions")}
				</a>{" "}
				{t("areWelcome")}
			</div>
		</footer>
	);
}

function App() {
	const { locale } = useLoaderData<typeof loader>();
	useChangeLanguage(locale);
	const calendarLocale = locale === "en" ? "en-UK" : locale;
	return (
		<NextUIProvider>
			<I18nProvider locale={calendarLocale}>
				<Outlet />
			</I18nProvider>
		</NextUIProvider>
	);
}

export default withSentry(App);

export function ErrorBoundary() {
	const error = useRouteError();
	useEffect(() => {
		console.error("error", error);
	}, [error]);

	captureRemixErrorBoundaryError(error);

	return (
		<div>
			<h1>Unexpected Error</h1>
		</div>
	);
}
