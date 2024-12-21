import { json as DeprecatedJSON } from "@vercel/remix";

import { getSession } from "~/modules/session.server";

// there seems not to be a good alternative for deprecated json
// https://github.com/remix-run/react-router/discussions/12257

// eslint-disable-next-line @typescript-eslint/no-deprecated
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

export async function authenticateAdmin(request: Request) {
	const { getIsAdmin } = await getSession(request);

	if (!getIsAdmin()) {
		// eslint-disable-next-line @typescript-eslint/only-throw-error
		throw json(null, 403);
	}
}

/**
 * Renames some common hooks, so we can use an "unsafe" version,
 * in which the linting doesn't check the dependency array.
 *
 * Please use with care, as this can easily lead to bugs
 */

export { useEffect as useEffectUnsafe, useMemo as useMemoUnsafe } from "react";
