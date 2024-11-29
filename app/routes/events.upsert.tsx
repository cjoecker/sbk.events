import { withZod } from "@rvf/zod";
import { useForm } from "@rvf/react";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import { ActionFunctionArgs, DataFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";

import { db } from "~/modules/db.server";

import { CITY } from "~/constants/city";
import { useLoaderData } from "@remix-run/react";
import { AutoComplete } from "~/components/rvf/autocomplete";
import { EnhancedDialog } from "~/components/rvf/enhanced-dialog";
import { Input } from "~/components/rvf/input";
import { Button } from "@nextui-org/react";
import { intWithinRange } from "~/utils/validation";
import { validationError } from "@rvf/remix";

const validator = withZod(
	z.object({
		infoUrl: z.string().url(),
		name: z.string().min(1).trim(),
		// organizerId: z.string(),
		startDate: z.string(),
		endDate: z.string(),
		// locationId: z.string(),
		// locationGoogleMapsUrl: z.string(),
		// salsaPercentage: intWithinRange(0, 100),
		// bachataPercentage: intWithinRange(0, 100),
		// kizombaPercentage: intWithinRange(0, 100),
	})
);

export async function loader({ request }: LoaderFunctionArgs) {
	const locations = await db.location.findMany({
		select: { id: true, name: true },
		where: {
			city: {
				name: CITY,
			},
		},
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
							name: CITY,
						},
					},
				},
			},
		},
	});
	const organizerOptions = organizers.map((organizer) => ({
		value: organizer.id.toString(),
		label: organizer.name,
	}));

	return { locationOptions, organizerOptions };
}
export const action = async ({ request }: ActionFunctionArgs) => {1


	console.log("1", 1);
	const result = await validator.validate(await request.formData());

	if (result.error) {
		// validationError comes from `@rvf/remix`
		return validationError(result.error, result.submittedData);
	}

	console.log("result.data", result.data);

	return null;
};


export default function EventsUpsert() {
	const { locationOptions, organizerOptions } = useLoaderData<typeof loader>();
	const { t } = useTranslation();
	const form = useForm({
		validator,
	});
	return (
		<EnhancedDialog title={t("createEvent")}>
			<form className="flex flex-col gap-y-3" {...form.getFormProps()}>
				<Input label={t("eventName")} scope={form.scope("name")} />
				<Input
					label={t("eventInformationUrl")}
					scope={form.scope("infoUrl")}
				/>
				<Input
					label={t("startDate")}
					scope={form.scope("startDate")}
					// type="datetime-local"
				/>
				<Input
					label={t("endDate")}
					// type="datetime-local"
					scope={form.scope("endDate")}
				/>
				<AutoComplete
					label={t("location")}
					scope={form.scope("locationId")}
					options={locationOptions}
					allowsCustomValue={true}
					allowsEmptyCollection={false}
					selectorIcon={null}
					isClearable={false}
				/>
				<Input
					label={t("locationGoogleMapsUrl")}
					scope={form.scope("locationGoogleMapsUrl")}
				/>
				<AutoComplete
					label={t("organizer")}
					scope={form.scope("organizerId")}
					options={organizerOptions}
					allowsCustomValue={true}
					allowsEmptyCollection={false}
					selectorIcon={null}
					isClearable={false}
				/>
				<div className="flex gap-x-2">
					<Input
						id="salsaPercentage"
						type="number"
						scope={form.scope("salsaPercentage")}
					/>
					<div className="my-auto">–</div>
					<Input
						id="bachataPercentage"
						type="number"
						scope={form.scope("bachataPercentage")}
					/>
					<div className="my-auto">–</div>
					<Input
						id="kizombaPercentage"
						type="number"
						scope={form.scope("kizombaPercentage")}
					/>
				</div>
				<Button type="submit">{t("save")}</Button>
			</form>
		</EnhancedDialog>
	);
}


// export default function EventsUpsert() {
// 	const { locationOptions, organizerOptions } = useLoaderData<typeof loader>();
// 	const { t } = useTranslation();
// 	const form = useForm({
// 		validator,
// 	});
// 	const sc = form.scope("aa");
// 	return (
// 		<EnhancedDialog title={t("createEvent")}>
// 			<form className="flex flex-col gap-y-3" {...form.getFormProps()}>

// 				<div>
// 					<Label>{t("SalsaBachataKizombaPercentage")}</Label>

// 				<AutoComplete
// 					label={t("location")}
// 					scope={form.scope("location")}
// 					options={locationOptions}
// 					allowsCustomValue={true}
// 					allowsEmptyCollection={false}
// 					selectorIcon={null}
// 					isClearable={false}
// 				/>
// 				<Autocomplete
// 					label="Select an animal"
// 					className="max-w-xs"
// 				>
// 					{animals.map((animal) => (
// 						<AutocompleteItem key={animal.value} value={animal.value}>
// 							{animal.label}
// 						</AutocompleteItem>
// 					))}
// 				</Autocomplete>
// 				<Input
// 					label={t("locationGoogleMapsUrl")}
// 					scope={form.scope("locationGoogleMapsUrl")}
// 				/>
// 				<Input
// 					label={t("organizer")}
// 					scope={form.scope("organizer")}
// 				/>
// 				<Button type="submit">{t("save")}</Button>
// 			</form>
// 		</EnhancedDialog>
// 	);
// }
