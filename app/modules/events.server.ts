import { startOfDay } from "date-fns";

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
			infoUrl: true,
			name: true,
			organizer: {
				select: {
					name: true,
					website: true,
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
		},
	});
}
