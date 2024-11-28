import { withZod } from "@rvf/zod";
import { useForm } from "@rvf/react";
import { z } from "zod";
import { Input } from "~/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useTranslation } from "react-i18next";
import { InputWithLabel } from "~/components/ui/input-with-label";
import { DatePicker } from "~/components/ui/date-picker";
import { EnhancedDialog } from "~/components/enhanced-dialog";
import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { LoaderFunctionArgs } from "@remix-run/node";
import { getEventsByDay } from "~/modules/events.server";
import { getSession } from "~/modules/session.server";
import { db } from "~/modules/db.server";

import { CITY } from "~/constants/city";
import { AutoComplete } from "~/components/ui/autocomplete";
import { useLoaderData } from "@remix-run/react";

const validator = withZod(
	z.object({
		infoUrl: z.string().url(),
		name: z.string().min(1).trim(),
		organizerId: z.number(),
		startDate: z.string(),
		endDate: z.string(),
		locationId: z.number(),
		salsaPercentage: z.number().int().min(0).max(100),
		bachataPercentage: z.number().int().min(0).max(100),
		kizombaPercentage: z.number().int().min(0).max(100),
	})
);

export async function loader({ request }: LoaderFunctionArgs) {
	const locations = await db.location.findMany({
		select: { id: true, name: true },
		where:{
			city:{
				name:CITY
			}
		}
	});
	const locationOptions = locations.map((location) => ({
		value: location.id.toString(),
		label: location.name,
	}));
	const organizers = await db.organizer.findMany({
		select: { id: true, name: true },
		where: {
			events: {
				some: {
					location: {
						city: {
							name: CITY
						}
					}
				}
			}
		}
	});
	const organizerOptions = organizers.map((organizer) => ({
		value: organizer.id.toString(),
		label: organizer.name,
	}));

	return { locationOptions, organizerOptions };
}

export default function EventsUpsert() {
	const [searchValue, setSearchValue] = useState<string>("");
	const [selectedValue, setSelectedValue] = useState<string>("");
	const { locationOptions, organizerOptions } = useLoaderData<typeof loader>();
	const { t } = useTranslation();
	const form = useForm({
		validator,
	});
	const sc = form.scope("aa")
	return (
		<EnhancedDialog title={t("createEvent")}>
			<form className="flex flex-col gap-y-3" {...form.getFormProps()}>
				<InputWithLabel label={t("eventName")} scope={form.scope("eventName")} />
				<InputWithLabel label={t("eventInformationUrl")} scope={form.scope("eventInformationUrl")}  />
				<InputWithLabel
					label={t("startDate")}
					scope={form.scope("startDate")}
					type="datetime-local"
				/>
				<InputWithLabel label={t("endDate")} type="datetime-local" scope={form.scope("endDate")} />
				<div>
					<Label>{t("SalsaBachataKizombaPercentage")}</Label>
					<div className="flex gap-x-2">
						<Input id="salsaPercentage" type="number" scope={form.scope("salsaPercentage")} />
						<div className="my-auto">–</div>
						<Input id="bachataPercentage" type="number" scope={form.scope("bachataPercentage")} />
						<div className="my-auto">–</div>
						<Input id="kizombaPercentage" type="number"  scope={form.scope("kizombaPercentage")}/>
					</div>
				</div>
				<AutoComplete label={t("location")}  scope={form.scope("locationName")} options={locationOptions} />
				<InputWithLabel label={t("locationGoogleMapsUrl")}  scope={form.scope("locationGoogleMapsUrl")}/>
				<InputWithLabel label={t("organizer")} scope={form.scope("organizer")}/>
				<Button type="submit">{t("save")}</Button>
			</form>
		</EnhancedDialog>
	);
}
