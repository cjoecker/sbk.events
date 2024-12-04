import { SEOHandle } from "@nasa-gcn/remix-seo";
import { Button } from "@nextui-org/react";
import { ActionFunctionArgs, redirect } from "@vercel/remix";
import React from "react";

import { getSession } from "~/modules/session.server";
import { json } from "~/utils/remix";

export const handle: SEOHandle = {
	getSitemapEntries: () => {
		return null;
	},
};

export const action = async ({ request }: ActionFunctionArgs) => {
	const formData = await request.formData();
	const key = formData.get("key") as string | undefined;
	const { setIsAdmin, getHeaders } = await getSession(request);
	if (key === process.env.CRUD_EVENT_KEY) {
		setIsAdmin();
		return redirect("/events", {
			headers: await getHeaders(),
		});
	}

	// eslint-disable-next-line @typescript-eslint/only-throw-error
	throw json(null, 403);
};

export default function Login() {
	return (
		<form className="flex flex-col gap-2" method={"post"} action={"/login"}>
			<input name="key" type="password" placeholder={"key"} />
			<Button type="submit">Login</Button>
		</form>
	);
}
