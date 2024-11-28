import { json as DeprecatedJSON } from "@remix-run/node";

// there seems not to be a good alternative for deprecated json
// https://github.com/remix-run/react-router/discussions/12257

// eslint-disable-next-line @typescript-eslint/no-deprecated, unicorn/prefer-export-from
export const json = DeprecatedJSON;

export function getDomainUrl(request: Request) {
	const host =
		request.headers.get("X-Forwarded-Host") ??
		request.headers.get("host") ??
		new URL(request.url).host;
	const protocol = request.headers.get("X-Forwarded-Proto") ?? "http";
	return `${protocol}://${host}`;
}

export function addCookieToHeaders(
	headers: ResponseInit["headers"] = new Headers(),
	value: string | null
) {
	if (!value) return headers;
	if (headers instanceof Headers) {
		headers.append("Set-Cookie", value);
	} else if (Array.isArray(headers)) {
		headers.push(["Set-Cookie", value]);
	} else {
		headers["Set-Cookie"] = value;
	}
	return headers;
}

