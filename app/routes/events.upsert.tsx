import { withZod } from "@rvf/zod";
import { useForm } from "@rvf/react";
import { z } from "zod";
import { Input } from "~/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useTranslation } from "react-i18next";
import { InputWithLabel } from "~/components/ui/input-with-label";

const validator = withZod(
	z.object({
		infoUrl: z.string().url(),
		name: z.string().min(1).trim(),
		organizerId: z.number(),
		startDate: z.date(),
		endDate: z.date(),
		locationId: z.number(),
		salsaPercentage: z.number().int().min(0).max(100),
		bachataPercentage: z.number().int().min(0).max(100),
		kizombaPercentage: z.number().int().min(0).max(100),
	})
);

export default function EventsUpsert() {
	const { t } = useTranslation();
	const form = useForm({
		validator,
	});
	return (
		<form {...form.getFormProps()}>
			<InputWithLabel label={t("eventName")} id="name" />
			<InputWithLabel label={t("eventInformationUrl")} id="infoUrl" />
			<InputWithLabel label={t("startDate")} id="startDate" type="date" />
			<InputWithLabel label={t("endDate")} id="endDate" type="date" />
			<InputWithLabel label={t("salsaPercentage")} id="salsaPercentage" type="number" />
			<InputWithLabel label={t("bachataPercentage")} id="bachataPercentage" type="number" />
			<InputWithLabel label={t("kizombaPercentage")} id="kizombaPercentage" type="number" />
			<InputWithLabel label={t("location")} id="locationId" />
			<InputWithLabel label={t("organizer")} id="organizerId" />
			<button type="submit">{t("save")}</button>
		</form>
	);
}
