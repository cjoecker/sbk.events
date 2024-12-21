import { LoaderFunctionArgs } from "@vercel/remix";
import { assert } from "~/utils/validation";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/modules/db.server";
import { BlogPost } from "~/components/blog-post";


export async function loader({ params }: LoaderFunctionArgs) {
	const slug = params.slug
	assert(slug, 'blog post slug is required');

	const blogPost = await db.blogPost.findFirst({
		where:{
			slug
		}
	})

	if(!blogPost){
		// eslint-disable-next-line @typescript-eslint/only-throw-error
		throw new Response("Not found", { status: 404 });
	}

	return {
		blogPost,
	}
}


export default function BlogPage () {
	const {blogPost} = useLoaderData<typeof loader>();
	return (
		<BlogPost title={blogPost.title} content={blogPost.content} date={blogPost.updatedAt} />
	);
};
