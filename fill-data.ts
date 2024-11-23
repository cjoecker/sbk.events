import { events } from "~/constants/events";
import { db } from "~/modules/db.server";

async function fillData() {
	const createdOrganizers: string[] = [];
	const createdLocations: string[] = [];

	events.forEach(async (events) => {
		// create organizer
		let organizerId = 0;
		if (createdOrganizers.includes(events.organizer)) {
			const organizer = await db.organizer.findFirst({
				where: {
					name: events.organizer,
				},
				select: {
					id: true,
				},
			});
			organizerId = organizer?.id ?? 0;
		} else {
			const organizer = await db.organizer.create({
				data: {
					name: events.organizer,
					website: "none",
				},
			});
			createdOrganizers.push(events.organizer);
			organizerId = organizer.id;
		}

		let locationId = 0;

		// create location
		if (createdLocations.includes(events.location)) {
			const location = await db.location.findFirst({
				where: {
					name: events.location,
				},
				select: {
					id: true,
				},
			});
			locationId = location?.id ?? 0;
		} else {
			const location = await db.location.create({
				data: {
					name: events.location,
					googleMapsUrl: events.locationUrl,
					city: {
						connect: {
							id: 1,
						},
					},
				},
			});
			createdLocations.push(events.location);
			locationId = location.id;
		}

		// create event
		await db.event.create({
			data: {
				infoUrl: events.url,
				name: events.name,
				organizer: {
					connect: {
						id: organizerId,
					},
				},
				startDate: events.startDate,
				endDate: events.endDate,
				location: {
					connect: {
						id: locationId,
					},
				},
				salsaPercentage: events.salsaPercentage,
				bachataPercentage: events.bachataPercentage,
				kizombaPercentage: events.kizombaPercentage,
			},
		});
	});
}

await fillData().then(() => {
	console.log("Data filled");
});
