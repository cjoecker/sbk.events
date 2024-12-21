import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export type BlogPostProps = {
	title: string | undefined;
	content: string | undefined;
	date: string;
};
export const BlogPost = ({ title, content, date }: BlogPostProps) => {
	const formattedDate = new Date(date).toLocaleDateString();
	return (
		<div className="glass-l-black p-2 z-0">
			<h1 className="text-3xl font-bold mt-1">{title}</h1>
			<div className="text-md text-gray-300">{formattedDate}</div>
			<div className="mt-4">
				<Markdown className="markdown" remarkPlugins={[remarkGfm]}>{content}</Markdown>
			</div>
		</div>
	);
};
