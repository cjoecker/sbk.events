import { format } from "date-fns";
import { getI18n } from "react-i18next";
import { useHydrated } from "remix-utils/use-hydrated";

import { dateFnsLocales } from "~/config/i18n";

export function useFormatDate() {
	const isHydrated = useHydrated();
	const language = getI18n().language;
	const formatDateToText = (date: string | undefined) => {
		if (!isHydrated || !date || date === "") {
			return "";
		}
		const locale = dateFnsLocales[language] ?? dateFnsLocales.en;
		// format like Mar 10, 2022
		return format(new Date(date), "MMM. dd yyyy", { locale });
	};
	return { formatDateToText };
}
