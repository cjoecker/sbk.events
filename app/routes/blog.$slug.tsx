import { SEOHandle } from "@nasa-gcn/remix-seo";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { LoaderFunctionArgs, MetaFunction } from "@vercel/remix";
import { Edit02Icon } from "hugeicons-react";
import { useTranslation } from "react-i18next";
import { serverOnly$ } from "vite-env-only/macros";

import { BlogPost } from "~/components/blog-post";
import { db } from "~/modules/db.server";
import { getSession } from "~/modules/session.server";
import { getKebabCaseFromNormalCase } from "~/utils/misc";
import { assert } from "~/utils/validation";

export const handle: SEOHandle = {
	getSitemapEntries: serverOnly$(async () => {
		const posts = await db.blogPost.findMany();
		return posts.map((post) => {
			return { route: `/blog/${post.slug}`, priority: 0.9 };
		});
	}),
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	// cut until the next . after 200 characters
	const description = data?.blogPost.content
		.slice(0, 200)
		.replace(/[^.]*$/, "");
	return [
		{
			title: `${data?.blogPost.title} | sbk.events`,
		},
		{
			name: "description",
			content: description,
		},
	];
};

export async function loader({ params, request }: LoaderFunctionArgs) {
	const { getIsAdmin } = await getSession(request);
	const isAdmin = getIsAdmin();
	const slug = params.slug;
	assert(slug, "blog post slug is required");

	const blogPost = await db.blogPost.findFirst({
		where: {
			slug,
		},
	});

	if (!blogPost) {
		// eslint-disable-next-line @typescript-eslint/only-throw-error
		throw new Response("Not found", { status: 404 });
	}

	return {
		isAdmin,
		blogPost,
		headers: {
			"Cache-Control": `public, max-age=60, s-maxage=${60 * 60 * 24}`,
		},
	};
}

export default function BlogPage() {
	const { blogPost, isAdmin } = useLoaderData<typeof loader>();
	const { t } = useTranslation();
	const navigate = useNavigate();
	return (
		<div className="relative">
			{isAdmin && (
				<button
					className="absolute right-1 top-1 z-10"
					aria-label={t("editEvent")}
					onClick={() => {
						const slug = getKebabCaseFromNormalCase(blogPost.title);
						navigate(`/blog/upsert?slug=${slug}`);
					}}
				>
					<Edit02Icon size={18} />
				</button>
			)}
			<BlogPost
				title={blogPost.title}
				content={blogPost.content}
				date={blogPost.updatedAt}
			/>
		</div>
	);
}
