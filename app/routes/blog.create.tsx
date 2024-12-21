import { ActionFunctionArgs, LoaderFunctionArgs } from "@vercel/remix";
import { SEOHandle } from "@nasa-gcn/remix-seo";
import { authenticateAdmin } from "~/utils/remix";
import { useEffect, useState } from "react";
import { Input } from "~/components/input";
import { useForm, validationError } from "@rvf/remix";
import { eventSchema, upsertEventValidator } from "~/components/upsert-event";
import { z } from "zod";
import { withZod } from "@rvf/zod";
import { Textarea } from "~/components/test-area";
import { useTranslation } from "react-i18next";
import { Button } from "@nextui-org/react";
import { db } from "~/modules/db.server";
import { BlogPost } from "~/components/blog-post";
import { getKebabCaseFromNormalCase } from "~/utils/misc";

export const blogPostSchema = z.object({
	title: z.string().trim(),
	content: z.string().trim(),
});
const blogPostValidator = withZod(blogPostSchema);

export const handle: SEOHandle = {
	getSitemapEntries: () => {
		return null;
	},
};

export async function loader({ request, params }: LoaderFunctionArgs) {
	await authenticateAdmin(request);
	return null;
}

export async function action({ request, params }: ActionFunctionArgs) {
	await authenticateAdmin(request);

	const result = await blogPostValidator.validate(await request.formData());
	if (result.error) {
		return validationError(result.error, result.submittedData);
	}

	const slug = getKebabCaseFromNormalCase(result.data.title);

	await db.blogPost.create({
		data: {
			slug,
			title: result.data.title,
			content: result.data.content,
		},
	});

	return null;
}

export default function BlogPage() {
	const { t } = useTranslation();
	const form = useForm({
		method: "post",
		validator: blogPostValidator,
	});
	const title = form.field("title").value() as string | undefined;
	const content = form.field("content").value() as string | undefined;

	useEffect(() => {
		if(typeof title === "string"){
			localStorage.setItem("blog-title", title);
		}

		if(typeof content === "string"){
			localStorage.setItem("blog-content", content);
		}
	}, [title, content]);

	useEffect(() => {
		const title = localStorage.getItem("blog-title");
		const content = localStorage.getItem("blog-content");
		if (title) {
			form.field("title").setValue(title);
		}
		if (content) {
			form.field("content").setValue(content);
			}
	}, []);



	return (
		<div>
			<form className="max-2xl flex flex-col gap-2" {...form.getFormProps()}>
				<Input scope={form.scope("title")} label={t("title")} />
				<Textarea
					className="w-full"
					label={t("content")}
					scope={form.scope("content")}
				/>
				<div className="ml-auto">
					<Button type="submit" color={"primary"}>
						{t("save")}
					</Button>
				</div>
			</form>
			<BlogPost title={title} content={content} date={new Date().toString()} />
		</div>
	);
}
