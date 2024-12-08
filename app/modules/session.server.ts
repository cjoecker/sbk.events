import { createCookieSessionStorage } from "@vercel/remix";

import { addCookieToHeaders } from "~/utils/remix";

interface SessionData {
	likedEvents: number[];
	isAdmin: boolean;
}

export const { getSession: getCookieSession, commitSession } =
	createCookieSessionStorage<SessionData, SessionData>({
		cookie: {
			name: "__session",
			httpOnly: true,
			path: "/",
			sameSite: "lax",
			secrets: [process.env.COOKIE_SECRET ?? ""],
			secure: true,
			maxAge: 60 * 60 * 24 * 365
		},
	});

export async function getSession(request: Request) {
	const session = await getCookieSession(request.headers.get("Cookie"));
	const initialValue = await commitSession(session);

	const commit = async () => {
		const currentValue = await commitSession(session);
		return currentValue === initialValue ? null : currentValue;
	};

	return {
		session,
		commit,
		likeEvent: (likedEvent: number) => {
			const likedEvents = session.get("likedEvents") ?? [];
			const hasLikedEvent = likedEvents.includes(likedEvent);
			if (hasLikedEvent) {
				session.set(
					"likedEvents",
					likedEvents.filter((event) => {
						return event !== likedEvent;
					})
				);
			} else {
				session.set("likedEvents", [...likedEvents, likedEvent]);
			}
		},
		getHasLikedEvent: (likedEvent: number) => {
			const likedEvents = session.get("likedEvents") ?? [];
			return likedEvents.includes(likedEvent);
		},
		getLikedEvents: () => {
			return session.get("likedEvents") ?? [];
		},
		setIsAdmin: () => {
			session.set("isAdmin", true);
		},
		getIsAdmin: () => {
			return session.get("isAdmin") ?? false;
		},
		/**
		 * This will initialize a Headers object if one is not provided.
		 * It will set the 'Set-Cookie' header value on that headers object.
		 * It will then return that Headers object.
		 */
		getHeaders: async (headers: ResponseInit["headers"] = new Headers()) => {
			const value = await commit();
			return addCookieToHeaders(headers, value);
		},
	};
}
