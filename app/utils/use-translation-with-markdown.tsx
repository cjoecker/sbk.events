import React from "react";
import { useTranslation } from "react-i18next";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function useTranslationWithMarkdown() {
	const { t, ...rest } = useTranslation();
	const tMarkdown = React.useCallback(
		(key: string, options?: Record<string, unknown>) => {
			return (
				<Markdown className="markdown" remarkPlugins={[remarkGfm]}>
					{t(key, options)}
				</Markdown>
			);
		},
		[t]
	);
	return { t: tMarkdown, ...rest };
}
