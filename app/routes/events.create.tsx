import { SEOHandle } from "@nasa-gcn/remix-seo";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "@rvf/remix";
import { ActionFunctionArgs, redirect } from "@vercel/remix";
import React from "react";

import {
	eventSchema,
	UpsertEvent,
	upsertEventValidator,
} from "~/components/upsert-event";
import { CITY } from "~/constants/city";
import { db } from "~/modules/db.server";
import {
	getAutocompleteOptions,
	getDates,
	sendNewEventEmail,
	updateLoacationOnEventUpsert,
} from "~/modules/events.server";
import { assert } from "~/utils/validation";
import { z } from "zod";
import { addDays } from "date-fns";

export const handle: SEOHandle = {
	getSitemapEntries: () => {
		return null;
	},
};

export async function loader() {
	return getAutocompleteOptions();
}

export const action = async ({ request }: ActionFunctionArgs) => {
	const result = await upsertEventValidator.validate(await request.formData());
	if (result.error) {
		return validationError(result.error, result.submittedData);
	}
	const {
		infoUrl,
		name,
		organizerId,
		organizerName,
		date,
		startTime,
		endTime,
		locationId,
		locationName,
		locationGoogleMapsUrl,
		salsaPercentage,
		bachataPercentage,
		kizombaPercentage,
	} = result.data;
	const locationIdNumber = locationId ? Number.parseInt(locationId) : undefined;
	const isNewLocation = !locationIdNumber;
	const isNewOrganizer = !organizerId;

	const organizerIdNumber = organizerId
		? Number.parseInt(organizerId)
		: undefined;

	const city = await db.city.findFirst({
		where: { name: CITY },
		select: { id: true },
	});
	assert(city, "City not found");
	const cityId = city.id;
	await updateLoacationOnEventUpsert(locationIdNumber, locationGoogleMapsUrl);
	const { startDate, endDate } = getDates(date, startTime, endTime);

	const newEvent = await db.event.create({
		data: {
			infoUrl,
			name,
			startDate: new Date(startDate),
			endDate: new Date(endDate),
			location: {
				connectOrCreate: {
					where: { id: locationIdNumber ?? 0 },
					create: {
						name: locationName,
						googleMapsUrl: locationGoogleMapsUrl,
						city: {
							connectOrCreate: {
								where: { id: cityId },
								create: { name: CITY },
							},
						},
					},
				},
			},
			organizer: {
				connectOrCreate: {
					where: { id: organizerIdNumber ?? 0 },
					create: { name: organizerName },
				},
			},
			salsaPercentage,
			bachataPercentage,
			kizombaPercentage,
		},
	});
	await sendNewEventEmail(
		newEvent,
		organizerName,
		locationName,
		locationGoogleMapsUrl,
		isNewLocation,
		isNewOrganizer
	);

	return redirect("/events");
};

export default function EventsCreate() {
	const { locationOptions, organizerOptions, googleMapsUrls } =
		useLoaderData<typeof loader>();
	const tomorrow = addDays(new Date(), 1);
	const tomorrowString = tomorrow.toISOString().split("T")[0];

	return (
		<UpsertEvent
			locationOptions={locationOptions}
			organizerOptions={organizerOptions}
			googleMapsUrls={googleMapsUrls}
			defaultValues={
				{
					salsaPercentage: 40,
					bachataPercentage: 60,
					kizombaPercentage: 0,
					date: tomorrowString,
					startTime: "21:00",
					endTime: "01:00",
				} as z.infer<typeof eventSchema>
			}
		/>
	);
}
