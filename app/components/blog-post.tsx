import { Button } from "@nextui-org/react";
import { useNavigate } from "@remix-run/react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export interface BlogPostProps {
	title: string | undefined;
	content: string | undefined;
	date: string;
}

export const BlogPost = ({ title, content, date }: BlogPostProps) => {
	const { t } = useTranslation();
	const formattedDate = format(new Date(date), "MMMM dd, yyyy");
	const navigate = useNavigate();
	return (
		<div className="glass-l-black z-0 p-2">
			<h1 className="mt-1 text-3xl font-bold">{title}</h1>
			<div className="text-md text-gray-300">{formattedDate}</div>
			<div className="mt-4">
				<Markdown className="markdown" remarkPlugins={[remarkGfm]}>
					{content}
				</Markdown>
				<Button
					color={"primary"}
					onClick={() => {
						navigate("/events");
					}}
				>
					{t("eventsInValencia")}
				</Button>
			</div>
		</div>
	);
};
