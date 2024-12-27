import { ActionFunctionArgs, LoaderFunctionArgs } from "@vercel/remix";
import { addDays, startOfDay, startOfWeek } from "date-fns";
import { db } from "~/modules/db.server";
import { EventFrequency, EventStatus, Event } from "@prisma/client";

type NewEvent = Omit<Event, "id" | "createdAt" | "updatedAt"> &{
	id: undefined;
	createdAt: undefined;
	updatedAt: undefined;
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	const today = startOfWeek(new Date());
	const twoWeeksAgo = addDays(today, -14);

	const lastFrequentEvents = await db.event.findMany({
		where: {
			startDate: {
				gte: twoWeeksAgo,
			},
			frequency: EventFrequency.WEEKLY,
		},
	});
	const futureEvents = await db.event.findMany({
		where: {
			startDate: {
				gte: today,
			},
		},
	});

	const newEvents: NewEvent[] = [];

	for (const event of lastFrequentEvents) {
		const eventStartWeekDay = event.startDate.getDay();

		const nextEventStartDate = addDays(
			today,
			eventStartWeekDay
		);
		const nextEventStartDateTime = new Date(
			nextEventStartDate.getFullYear(),
			nextEventStartDate.getMonth(),
			nextEventStartDate.getDate(),
			event.startDate.getHours(),
			event.startDate.getMinutes()
		);

		const eventAlreadyExists = futureEvents.some((e) => {
			return (
				e.startDate.getTime() === nextEventStartDateTime.getTime() &&
				e.organizerId === event.organizerId
			);
		});
		const eventAlreadyExistsInNewEvents = newEvents.some((e) => {
			return (
				e.startDate.getTime() === nextEventStartDateTime.getTime() &&
				e.organizerId === event.organizerId
			);
		});
		console.log("\n\nname", event.name);
		console.log("eventAlreadyExistsInNewEvents", eventAlreadyExistsInNewEvents);
		console.log("eventAlreadyExists", eventAlreadyExists);
		if (!eventAlreadyExists && !eventAlreadyExistsInNewEvents) {
			const eventEndWeekDay = event.startDate.getDay();
			const nextEventEndDate = addDays(today, eventEndWeekDay - today.getDay());
			const nextEventEndDateTime = new Date(
				nextEventEndDate.getFullYear(),
				nextEventEndDate.getMonth(),
				nextEventEndDate.getDate(),
				event.endDate.getHours(),
				event.endDate.getMinutes()
			);

			newEvents.push({
				...event,
				startDate: nextEventStartDateTime,
				endDate: nextEventEndDateTime,
				status: EventStatus.PENDING_CREATION_APPROVAL,
				id: undefined,
				createdAt: undefined,
				updatedAt: undefined,
			});
		}
	}
	console.log("\n\nnewEvents", newEvents);
	await db.event.createMany({
		data: newEvents,
	});

	return {
		success: true,
	};
};
