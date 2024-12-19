import { LoaderFunctionArgs } from "@vercel/remix";
import { assert } from "~/utils/validation";
import { useLoaderData } from "@remix-run/react";
import * as importedContent from "../blogs/mejores-sitios-bailar-valencia-2025.md";
const posts = [
	{
		url: 'mejores-sitios-bailar-valencia-2025',
		title: 'Mejores Lugares en 2025 de Salsa, Bachata y Kizomba en Valencia',
		date: new Date("2024-12-15"),
		description: 'Los mejores sitios para bailar salsa, bachata y kizomba en Valencia en 2025',
	},
]

export async function loader({ request, params }: LoaderFunctionArgs) {
	const url = params.id
	assert(url, 'blog post url is required');

	const content = await import(`../blogs/${url}.md`).then(module => module.default);
	return {
		content,
	}
}

export type BlogPageProps = {
	url:string;
	title:string;
	date:string;
	description:string;
};
export default function BlogPage ({url,title,date,description}: BlogPageProps) {
	const {content} = useLoaderData<typeof loader>();
	console.log("content", content);
	return (
		<div className="max-2xl glass-l-black">
			<h1>{title}</h1>
			<p>{date}</p>
			<p>{description}</p>
		</div>
	);
};
