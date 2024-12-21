import { format } from "date-fns";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export interface BlogPostProps {
	title: string | undefined;
	content: string | undefined;
	date: string;
}
export const BlogPost = ({ title, content, date }: BlogPostProps) => {
	const formattedDate = format(new Date(date), "MMMM dd, yyyy");
	return (
		<div className="glass-l-black z-0 p-2">
			<h1 className="mt-1 text-3xl font-bold">{title}</h1>
			<div className="text-md text-gray-300">{formattedDate}</div>
			<div className="mt-4">
				<Markdown className="markdown" remarkPlugins={[remarkGfm]}>
					{content}
				</Markdown>
			</div>
		</div>
	);
};
