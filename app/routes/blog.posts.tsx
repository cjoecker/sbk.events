import { Button } from "@nextui-org/react";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { LoaderFunctionArgs } from "@vercel/remix";
import { Add01Icon, ArrowRight01Icon } from "hugeicons-react";
import { useTranslation } from "react-i18next";

import { db } from "~/modules/db.server";
import { getSession } from "~/modules/session.server";
import { getKebabCaseFromNormalCase } from "~/utils/misc";
import { useFormatDate } from "~/utils/use-format-date";

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
		},
	});
	return {
		posts,
		isAdmin,
	};
}

export default function BlogPosts() {
	const { t } = useTranslation();
	const { posts, isAdmin } = useLoaderData<typeof loader>();
	const { formatDateToText } = useFormatDate();
	const navigate = useNavigate();
	return (
		<div className="relative">
			{isAdmin && (
				<Button
					className="fixed bottom-2 right-3 z-40 h-14 w-14"
					size={"lg"}
					radius={"full"}
					isIconOnly
					color="primary"
					aria-label={t("addEvent")}
					onClick={() => {
						navigate("/blog/upsert");
					}}
				>
					<Add01Icon />
				</Button>
			)}
			<h1 className="mb-1 text-2xl font-bold">{t("blog")}</h1>
			<ul className="glass-s-black divide-y-1 divide-white/30">
				{posts.map((post) => {
					const slug = getKebabCaseFromNormalCase(post.title);
					const href = `/blog/${slug}`;
					return (
						<li key={post.title}>
							<a
								href={href}
								className="flex cursor-pointer p-2 hover:bg-gray-600/40"
							>
								<div className="flex w-full flex-col">
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
