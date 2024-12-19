import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export type BlogPostProps = {
	title: string;
	content: string;
	date: string;
};
export const BlogPost = ({title,content,date}: BlogPostProps) => {
	return (
		<div>
			<h1>{title}</h1>
			<p>{date}</p>
			<div><Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown></div>
		</div>
	);
};
