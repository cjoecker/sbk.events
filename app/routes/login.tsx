import { SEOHandle } from "@nasa-gcn/remix-seo";
import { Button } from "@nextui-org/react";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { useForm } from "@rvf/remix";
import { validationError } from "@rvf/remix";
import { withZod } from "@rvf/zod";
import React from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { Input } from "~/components/rvf/input";
import { getSession } from "~/modules/session.server";
import { json } from "~/utils/remix";

export const handle: SEOHandle = {
	getSitemapEntries: () => {
		return null;
	},
};

const validator = withZod(
	z.object({
		key: z.string().min(1),
	})
);

export const action = async ({ request }: ActionFunctionArgs) => {
	const result = await validator.validate(await request.formData());
	if (result.error) {
		return validationError(result.error, result.submittedData);
	}

	const { setIsAdmin, getHeaders } = await getSession(request);
	const { key } = result.data;
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
	const { t } = useTranslation();
	const form = useForm({
		method: "post",
		validator,
	});

	return (
		<form className="flex flex-col gap-2" {...form.getFormProps()}>
			<Input label={t("key")} scope={form.scope("key")} type={"password"} />
			<Button type="submit">{t("send")}</Button>
		</form>
	);
}
