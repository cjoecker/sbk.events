import { LoaderFunctionArgs } from "@vercel/remix";
import { assert } from "~/utils/validation";
import { useLoaderData } from "@remix-run/react";
import * as importedContent from "../blogs/mejores-sitios-bailar-valencia-2025.md";
import { db } from "~/modules/db.server";
import { useTranslation } from "react-i18next";
import { useFormatDate } from "~/utils/use-format-date";
import { ArrowRight01Icon } from "hugeicons-react";

export async function loader({ request, params }: LoaderFunctionArgs) {
	const posts = await db.blogPost.findMany({
		select: {
			title: true,
			updatedAt: true,
		},
		orderBy: {
			updatedAt: "desc",
		}
	});
	return {
		posts,
	};
}

export default function BlogPosts() {
	const { t } = useTranslation();
	const { posts } = useLoaderData<typeof loader>();
	const { formatDateToText } = useFormatDate();
	return (
		<div>
			<h2 className="mb-2 text-xl font-bold">{t("blog")}</h2>
			<ul className="glass-s-grey">
				{posts.map((post) => {
					return (
						<li
							key={post.title}
							className="flex cursor-pointer p-2 hover:bg-gray-600/40"
						>
							<div className="flex flex-col w-full">
								<h2 className="font-bold">{post.title}</h2>
								<div className="text-sm text-gray-300">
									{formatDateToText(post.updatedAt)}
								</div>
							</div>
							<ArrowRight01Icon className="my-auto ml-2" />
						</li>
					);
				})}
			</ul>
		</div>
	);
}
