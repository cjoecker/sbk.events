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

import { AutoComplete } from "~/components/rvf/autocomplete";
import { EnhancedDialog } from "~/components/rvf/enhanced-dialog";
import { Input } from "~/components/rvf/input";
import { CITY } from "~/constants/city";
import { db } from "~/modules/db.server";
import { getSession } from "~/modules/session.server";
import { json } from "~/utils/remix";
import { assert, intWithinRange } from "~/utils/validation";

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

export async function loader() {
	const locations = await db.location.findMany({
		select: { id: true, name: true, googleMapsUrl: true },
		where: {
			city: {
				name: CITY,
			},
		},
	});
	const locationOptions = locations.map((location) => {
		return {
			id: location.id.toString(),
			name: location.name,
		};
	});
	const googleMapsUrls = locations.map((location) => {
		return {
			id: location.id.toString(),
			googleMapsUrl: location.googleMapsUrl,
		};
	});
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
	const organizerOptions = organizers.map((organizer) => {
		return {
			id: organizer.id.toString(),
			name: organizer.name,
		};
	});
	return { locationOptions, organizerOptions, googleMapsUrls };
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

export default function EventsUpsert() {
	const { locationOptions, organizerOptions, googleMapsUrls } =
		useLoaderData<typeof loader>();
	const { t } = useTranslation();
	const form = useForm({
		method: "post",
		validator,
	});
	const navigate = useNavigate();
	const locationGoogleMapsUrlField = useField(
		form.scope("locationGoogleMapsUrl")
	);
	const navigation = useNavigation();
	const isSubmitting = navigation.state === "submitting";
	const handleLocationSelected = (id: string) => {
		const selectedLocation = googleMapsUrls.find((location) => {
			return location.id === id;
		});
		if (selectedLocation) {
			locationGoogleMapsUrlField.setValue(selectedLocation.googleMapsUrl);
			locationGoogleMapsUrlField.validate();
		}
	};

	return (
		<EnhancedDialog
			title={t("createEvent")}
			onClose={() => {
				navigate("/events");
			}}
		>
			<form className="flex flex-col gap-y-3" {...form.getFormProps()}>
				<Input label={t("eventName")} scope={form.scope("name")} />
				<Input label={t("eventInformationUrl")} scope={form.scope("infoUrl")} />
				<Input
					label={t("startDate")}
					scope={form.scope("startDate")}
					type="datetime-local"
				/>
				<Input
					label={t("endDate")}
					type="datetime-local"
					scope={form.scope("endDate")}
				/>
				<AutoComplete
					label={t("location")}
					idScope={form.scope("locationId")}
					nameScope={form.scope("locationName")}
					options={locationOptions}
					selectorIcon={null}
					isClearable={false}
					onSelectionChange={handleLocationSelected}
				/>
				<Input
					label={t("locationGoogleMapsUrl")}
					scope={form.scope("locationGoogleMapsUrl")}
				/>
				<AutoComplete
					label={t("organizer")}
					idScope={form.scope("organizerId")}
					nameScope={form.scope("organizerName")}
					options={organizerOptions}
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
				<Button type="submit" disabled={isSubmitting}>
					{t("save")}
				</Button>
			</form>
		</EnhancedDialog>
	);
}
