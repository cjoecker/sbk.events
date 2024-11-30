import { SEOHandle } from "@nasa-gcn/remix-seo";
import { Button } from "@nextui-org/react";
import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/node";
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
import { UpsertEvent } from "~/components/upsert-event";
import { getAutocompleteOptions } from "~/modules/events.server";

export const handle: SEOHandle = {
	getSitemapEntries: () => {
		return null;
	},
};

const validator = withZod(
	z.object({
		infoUrl: z.string().trim().url(),
		name: z.string().trim().min(1),
		organizerId: z.string().optional(),
		organizerName: z.string().min(1),
		startDate: z.string().min(1),
		endDate: z.string().min(1),
		locationId: z.string().optional(),
		locationName: z.string().min(1),
		locationGoogleMapsUrl: z.string().trim().url(),
		salsaPercentage: intWithinRange(0, 100),
		bachataPercentage: intWithinRange(0, 100),
		kizombaPercentage: intWithinRange(0, 100),
	})
);

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
		startDate: event.startDate.toISOString(),
		endDate: event.endDate.toISOString(),
		locationId: event.location.id.toString(),
		locationName: event.location.name,
		locationGoogleMapsUrl: event.location.googleMapsUrl,
		salsaPercentage: event.salsaPercentage,
		bachataPercentage: event.bachataPercentage,
		kizombaPercentage: event.kizombaPercentage,
	}
	const autocompleteOptions = await getAutocompleteOptions();
	return {
		defaultValues,
		autocompleteOptions,
	};
}

export const action = async ({ request }: ActionFunctionArgs) => {
	const { getIsAdmin } = await getSession(request);

	if (!getIsAdmin()) {
		// eslint-disable-next-line @typescript-eslint/only-throw-error
		throw json(null, 403);
	}

	const result = await validator.validate(await request.formData());
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
	const {autocompleteOptions,defaultValues } =
		useLoaderData<typeof loader>();
	const { locationOptions, organizerOptions, googleMapsUrls } = autocompleteOptions;
	return (
		<UpsertEvent
			locationOptions={locationOptions}
			organizerOptions={organizerOptions}
			googleMapsUrls={googleMapsUrls}
			defaultValues={defaultValues}
		/>
	);
}

