import { SEOHandle } from "@nasa-gcn/remix-seo";
import { Button } from "@nextui-org/react";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate, useNavigation } from "@remix-run/react";
import { useField } from "@rvf/react";
import { useForm } from "@rvf/remix";
import { validationError } from "@rvf/remix";
import { withZod } from "@rvf/zod";
import React from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { AutoComplete } from "~/components/autocomplete";
import { EnhancedDialog } from "~/components/enhanced-dialog";
import { Input } from "~/components/input";
import { CITY } from "~/constants/city";
import { db } from "~/modules/db.server";
import { getSession } from "~/modules/session.server";
import { json } from "~/utils/remix";
import { assert, intWithinRange } from "~/utils/validation";
import { UpsertEvent, upsertEventValidator } from "~/components/upsert-event";
import { getAutocompleteOptions } from "~/modules/events.server";

export const handle: SEOHandle = {
	getSitemapEntries: () => {
		return null;
	},
};

export async function loader() {
	return getAutocompleteOptions();
}

export const action = async ({ request }: ActionFunctionArgs) => {
	const { getIsAdmin } = await getSession(request);

	if (!getIsAdmin()) {
		// eslint-disable-next-line @typescript-eslint/only-throw-error
		throw json(null, 403);
	}

	const result = await upsertEventValidator.validate(await request.formData());
	if (result.error) {
		return validationError(result.error, result.submittedData);
	}
	const {
		infoUrl,
		name,
		organizerId,
		organizerName,
		startDate,
		endDate,
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
	if (locationIdNumber) {
		const location = await db.location.findFirst({
			where: {
				id: locationIdNumber,
			},
			select: { id: true, name: true, googleMapsUrl: true },
		});
		if (location) {
			if (location.googleMapsUrl !== locationGoogleMapsUrl) {
				await db.location.update({
					where: {
						id: locationIdNumber,
					},
					data: {
						googleMapsUrl: locationGoogleMapsUrl,
					},
				});
			}
		} else {
			return new Response("Organizer not found", { status: 404 });
		}
	}

	await db.event.create({
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
	const { locationOptions, organizerOptions, googleMapsUrls } =
		useLoaderData<typeof loader>();
	return (
		<UpsertEvent
			locationOptions={locationOptions}
			organizerOptions={organizerOptions}
			googleMapsUrls={googleMapsUrls}
		/>
	);
}
