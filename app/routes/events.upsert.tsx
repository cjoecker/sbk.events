import { withZod } from "@rvf/zod";
import { useForm } from "@rvf/react";
import { z } from "zod";
import { Input } from "~/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useTranslation } from "react-i18next";
import { InputWithLabel } from "~/components/ui/input-with-label";
import { DatePicker } from "~/components/ui/date-picker";
import { EnhancedDialog } from "~/components/enhanced-dialog";
import React from "react";
import { Button } from "~/components/ui/button";

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
		<EnhancedDialog title={t("createEvent")}>
			<form className="flex flex-col gap-y-3" {...form.getFormProps()}>
				<InputWithLabel label={t("eventName")} id="name" />
				<InputWithLabel label={t("eventInformationUrl")} id="infoUrl" />
				<InputWithLabel
					label={t("startDate")}
					id="startDate"
					type="datetime-local"
				/>
				<InputWithLabel label={t("endDate")} id="endDate" type="date" />
				<div>
					<Label>{t("SalsaBachataKizombaPercentage")}</Label>
					<div className="flex gap-x-2">
						<Input id="salsaPercentage" type="number" />
						<div className="my-auto">–</div>
						<Input id="bachataPercentage" type="number" />
						<div className="my-auto">–</div>
						<Input id="kizombaPercentage" type="number" />
					</div>
				</div>
				<InputWithLabel label={t("locationName")} id="locationId" />
				<InputWithLabel label={t("locationGoogleMapsUrl")} id="locationId" />
				<InputWithLabel label={t("organizer")} id="organizerId" />
				<Button type="submit">{t("save")}</Button>
			</form>
		</EnhancedDialog>
	);
}
