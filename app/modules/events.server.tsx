import { Event, EventStatus } from "@prisma/client";
import {
	Body,
	Column,
	Head,
	Html,
	render,
	Row,
	Section,
	Link,
} from "@react-email/components";
import { addDays, format, startOfDay } from "date-fns";

import { CITY } from "~/constants/city";
import { db } from "~/modules/db.server";
import { sendEmail } from "~/modules/email.server";

export async function getEventsByDay(
	city: string,
	isAdmin: boolean
): Promise<EventDayDb[]> {
	const events = await getUnfinishedEventsAndAfterNow(city, isAdmin);
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

export async function getUnfinishedEventsAndAfterNow(
	city: string,
	isAdmin: boolean
) {
	const startOfToday = startOfDay(new Date());
	const now = new Date();
	const status = isAdmin ? {} : { status: EventStatus.PUBLISHED };
	console.log("events", await db.event.findMany());

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
			...status,
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
			status: true,
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

export async function updateLoacationOnEventUpsert(
	locationIdNumber: number | undefined,
	locationGoogleMapsUrl: string
) {
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
			// eslint-disable-next-line @typescript-eslint/only-throw-error
			throw new Response("Organizer not found", { status: 404 });
		}
	}
}

export function getDates(date: string, startTime: string, endTime: string) {
	const startDate = new Date(`${date}T${startTime}Z`);
	let endDate = new Date(`${date}T${endTime}Z`);
	if (endDate < startDate) {
		endDate = addDays(endDate, 1);
	}
	return { startDate, endDate };
}

// eslint-disable-next-line max-params
export async function sendNewEventEmail(
	event: Event,
	organizerName: string,
	locationName: string,
	locationGoogleMapsUrl: string,
	isNewLocation: boolean,
	isNewOrganizer: boolean
) {
	const sbk = `${event.salsaPercentage}-${event.bachataPercentage}-${event.kizombaPercentage}`;
	const startDate = format(event.startDate, "dd.MM.yyyy HH:mm");
	const endDate = format(event.endDate, "dd.MM.yyyy HH:mm");

	const emailEvent = {
		name: event.name,
		infoUrl: event.infoUrl,
		startDate,
		endDate,
		isNewLocation,
		locationId: event.locationId,
		locationName: locationName,
		goggleMapsUrl: locationGoogleMapsUrl,
		isNewOrganizer,
		organizerName: organizerName,
		organizerId: event.organizerId,
		sbk: sbk,
	};

	const htmlEmail = await render(<NewEventEmail event={emailEvent} />);
	await sendEmail(htmlEmail, "➕ New event created");
}

interface NewEventEmailProps {
	event: Record<string, unknown>;
}

export const NewEventEmail = ({ event }: NewEventEmailProps) => {
	const data = Object.entries(event);

	return (
		<Html>
			<Head />
			<Body style={{ textAlign: "left" }}>
				<Section style={{ maxWidth: "600px", textAlign: "left" }}>
					{data.map(([key, value]) => {
						return (
							<Row key={key}>
								<Column
									style={{
										textAlign: "right",
										paddingRight: "10px",
										width: "200px",
									}}
								>
									<strong>{key}:</strong>
								</Column>
								<Column
									style={{
										textAlign: "left",
										wordWrap: "break-word",
										wordBreak: "break-all",
									}}
								>
									{value?.toString()}
								</Column>
							</Row>
						);
					})}
					<Row style={{ marginTop: "50px", textAlign: "center" }}>
						<Link href="https://sbk.events/events">sbk.events</Link>
					</Row>
				</Section>
			</Body>
		</Html>
	);
};

export async function publishEvent(eventId: number, isPublished: boolean) {
	const status = isPublished ? EventStatus.PUBLISHED : EventStatus.DELETED;
	await db.event.update({
		where: { id: eventId },
		data: {
			status,
		},
	});
}

export async function setEventLike(eventId: number, hasLikedEvent: boolean) {
	const increment = hasLikedEvent ? -1 : 1;
	const newEvent = await db.event.update({
		where: { id: eventId },
		data: {
			likes: {
				increment,
			},
		},
	});

	if (newEvent.likes < 0) {
		await db.event.update({
			where: { id: eventId },
			data: {
				likes: 0,
			},
		});
	}
	return newEvent.likes;
}
