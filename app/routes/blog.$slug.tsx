import { LoaderFunctionArgs } from "@vercel/remix";
import { assert } from "~/utils/validation";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/modules/db.server";
import { BlogPost } from "~/components/blog-post";
import { SEOHandle } from "@nasa-gcn/remix-seo";
import { serverOnly$ } from "vite-env-only/macros";

export const handle: SEOHandle = {
	getSitemapEntries: serverOnly$(async () => {
		const posts = await db.blogPost.findMany();
		return posts
			.map((post) => {
				return { route: `/blog/${post.slug}`, priority: 0.9 }
			})
	}),
};


export async function loader({ params }: LoaderFunctionArgs) {
	const slug = params.slug
	assert(slug, 'blog post slug is required');
	const cacheTag = `blog_post_${slug.replaceAll('-', '_')}`;

	const blogPost = await db.blogPost.findFirst({
		where:{
			slug
		},
		cacheStrategy: {
			ttl: 60*60*24*365,
			tags: [cacheTag],
		},
	})

	if(!blogPost){
		// eslint-disable-next-line @typescript-eslint/only-throw-error
		throw new Response("Not found", { status: 404 });
	}

	return {
		blogPost,
		headers: {
			"Cache-Control": `public, max-age=60, s-maxage=${60 * 60 * 24}`,
		}
	}
}


export default function BlogPage () {
	const {blogPost} = useLoaderData<typeof loader>();
	return (
		<BlogPost title={blogPost.title} content={blogPost.content} date={blogPost.updatedAt} />
	);
};
