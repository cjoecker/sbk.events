import { withZod } from "@rvf/zod";
import { useForm } from "@rvf/remix";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	redirect,
} from "@remix-run/node";

import { db } from "~/modules/db.server";

import { CITY } from "~/constants/city";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { AutoComplete } from "~/components/rvf/autocomplete";
import { EnhancedDialog } from "~/components/rvf/enhanced-dialog";
import { Input } from "~/components/rvf/input";
import { Button } from "@nextui-org/react";
import { assert, intWithinRange } from "~/utils/validation";
import { validationError } from "@rvf/remix";
import { useField } from "@rvf/react";
import { SEOHandle } from "@nasa-gcn/remix-seo";
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
		<form className="flex gap-2 flex-col" {...form.getFormProps()}>
				<Input label={t("key")} scope={form.scope("key")} type={"password"} />
				<Button type="submit">{t("send")}</Button>
		</form>
	);
}
