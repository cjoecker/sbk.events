import { SEOHandle } from "@nasa-gcn/remix-seo";
import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	redirect,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "@rvf/remix";
import { addDays, format } from "date-fns";
import React from "react";

import { UpsertEvent, upsertEventValidator } from "~/components/upsert-event";
import { CITY } from "~/constants/city";
import { db } from "~/modules/db.server";
import { getAutocompleteOptions, getDates, updateLoacationOnEventUpsert } from "~/modules/events.server";
import { getSession } from "~/modules/session.server";
import { json } from "~/utils/remix";
import { assert } from "~/utils/validation";

export const handle: SEOHandle = {
	getSitemapEntries: () => {
		return null;
	},
};

export async function loader({ params }: LoaderFunctionArgs) {
	const id = params.id;
	assert(id, "Id is required");
	const event = await db.event.findUnique({
		where: { id: Number(id) },
		select: {
			id: true,
			infoUrl: true,
			name: true,
			organizer: {
				select: { id: true, name: true },
			},
			startDate: true,
			endDate: true,
			location: {
				select: { id: true, name: true, googleMapsUrl: true },
			},
			salsaPercentage: true,
			bachataPercentage: true,
			kizombaPercentage: true,
		},
	});
	assert(event, "Event not found");

	const defaultValues = {
		infoUrl: event.infoUrl,
		name: event.name,
		organizerId: event.organizer.id.toString(),
		organizerName: event.organizer.name,
		date: format(event.startDate, "yyyy-MM-dd"),
		startTime: format(event.startDate, "HH:mm"),
		endTime: format(event.endDate, "HH:mm"),
		startDate: event.startDate.toISOString(),
		endDate: event.endDate.toISOString(),
		locationId: event.location.id.toString(),
		locationName: event.location.name,
		locationGoogleMapsUrl: event.location.googleMapsUrl,
		salsaPercentage: event.salsaPercentage,
		bachataPercentage: event.bachataPercentage,
		kizombaPercentage: event.kizombaPercentage,
	};
	const autocompleteOptions = await getAutocompleteOptions();
	return {
		defaultValues,
		autocompleteOptions,
	};
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
	const { getIsAdmin } = await getSession(request);

	if (!getIsAdmin()) {
		// eslint-disable-next-line @typescript-eslint/only-throw-error
		throw json(null, 403);
	}

	assert(params.id, "Id is required");
	const id = Number(params.id);

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

	await db.event.update({
		where: { id },
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
	return redirect("/events");
};

export default function EventsCreate() {
	const { autocompleteOptions, defaultValues } = useLoaderData<typeof loader>();
	const { locationOptions, organizerOptions, googleMapsUrls } =
		autocompleteOptions;
	return (
		<UpsertEvent
			locationOptions={locationOptions}
			organizerOptions={organizerOptions}
			googleMapsUrls={googleMapsUrls}
			defaultValues={defaultValues}
		/>
	);
}
