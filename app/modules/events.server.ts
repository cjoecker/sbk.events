import { startOfDay } from "date-fns";

import { CITY } from "~/constants/city";
import { db } from "~/modules/db.server";

export async function getEventsByDay(city: string): Promise<EventDayDb[]> {
	const events = await getUnfinishedEventsAndAfterNow(city);
	const eventDays: EventDayDb[] = [];
	for (const event of events) {
		const eventDate = startOfDay(event.startDate);
		const eventDay = eventDays.find((day) => {
			return day.date.getTime() === eventDate.getTime();
		});
		if (eventDay) {
			eventDay.events.push(event);
		} else {
			eventDays.push({
				date: eventDate,
				events: [event],
			});
		}
	}
	return eventDays;
}

interface EventDayDb {
	date: Date;
	events: EventsDb;
}
type EventsDb = Awaited<ReturnType<typeof getUnfinishedEventsAndAfterNow>>;

export async function getUnfinishedEventsAndAfterNow(city: string) {
	const startOfToday = startOfDay(new Date());
	const now = new Date();
	return db.event.findMany({
		orderBy: {
			startDate: "asc",
		},
		where: {
			location: {
				city: {
					name: city,
				},
			},
			OR: [
				{
					startDate: {
						gte: startOfToday,
					},
				},
				{
					AND: [
						{
							startDate: {
								lt: now,
							},
						},
						{
							endDate: {
								gt: now,
							},
						},
					],
				},
			],
		},
		select: {
			id: true,
			infoUrl: true,
			name: true,
			organizer: {
				select: {
					name: true,
				},
			},
			startDate: true,
			endDate: true,
			location: {
				select: {
					name: true,
					googleMapsUrl: true,
				},
			},
			salsaPercentage: true,
			bachataPercentage: true,
			kizombaPercentage: true,
			likes: true,
		},
	});
}

export async function getAutocompleteOptions() {
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
