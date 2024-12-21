import { LoaderFunctionArgs } from "@vercel/remix";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { db } from "~/modules/db.server";
import { useTranslation } from "react-i18next";
import { useFormatDate } from "~/utils/use-format-date";
import { ArrowRight01Icon, Edit02Icon } from "hugeicons-react";
import { getKebabCaseFromNormalCase } from "~/utils/misc";
import { getSession } from "~/modules/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
	const { getIsAdmin } = await getSession(request);
	const isAdmin = getIsAdmin();
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
		isAdmin
	};
}

export default function BlogPosts() {
	const { t } = useTranslation();
	const { posts, isAdmin } = useLoaderData<typeof loader>();
	const { formatDateToText } = useFormatDate();
	const navigate = useNavigate();
	return (
		<div>
			<h1 className="mb-1 text-2xl font-bold">{t("blog")}</h1>
			<ul className="glass-s-grey">
				{posts.map((post) => {
					const slug = getKebabCaseFromNormalCase(post.title);
					const href = `/blog/${slug}`;
					return (
						<li
							className="relative"
							key={post.title}
						>
							{isAdmin && (
								<button
									className="absolute right-1 top-1"
									aria-label={t("editEvent")}
									onClick={()=>{
										const slug = getKebabCaseFromNormalCase(post.title);
										navigate(`/blog/upsert?slug=${slug}`);
									}}
								>
									<Edit02Icon size={18} />
								</button>
							)}
							<a href={href} className="flex cursor-pointer p-2 hover:bg-gray-600/40" >
							<div className="flex flex-col w-full">
								<h2 className="font-bold">{post.title}</h2>
								<div className="text-sm text-gray-300">
									{formatDateToText(post.updatedAt)}
								</div>
							</div>
							<ArrowRight01Icon className="my-auto ml-2" />
							</a>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
