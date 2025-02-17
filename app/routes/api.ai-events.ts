import { openai } from "@ai-sdk/openai";
import { EventStatus } from "@prisma/client";
import { ActionFunctionArgs, data } from "@vercel/remix";
import { generateObject } from "ai";
import { serverOnly$ } from "vite-env-only/macros";
import { z } from "zod";

import { CITY } from "~/constants/city";
import { db } from "~/modules/db.server";
import { assert, intWithinRange } from "~/utils/validation";

export const action = async ({ request }: ActionFunctionArgs) => {
	authenticateRequest(request);
	// INPUT PARAMETERS
	// details: optional string
	// image: optional string
	// infoUrl: optional string

	// get parameters
	const body = (await request.json()) as unknown;

	const data = z
		.object({
			details: z.string().optional(),
			image: z.string().optional(),
			infoUrl: z.string(),
		})
		.parse(body);

	const content = await getMessagesContent(data.details, data.image);

	const { object, usage } = await generateObject({
		model: openai(MODEL_NAME),
		schema: aiEventSchema,
		messages: [
			{
				role: "user",
				content: content,
			},
		],
	});

	if (object.confidenceLevel < 50) {
		const error = `The confidence level of ${object.confidenceLevel} is too low`;
		console.error(error);
		return {
			error,
		};
	}
	const { alreadyExists, isSetToPublished } = await eventAlreadyExists(
		object.date,
		object.startTime,
		object.locationName
	);
	if (alreadyExists) {
		const error = `Event from ${object.organizerName} at ${object.date} already exists`;
		console.info(error);
		return {
			alreadyExists,
			isSetToPublished,
		};
	}

	const savedEvent = await saveEvent(object, data.infoUrl);

	const price =
		usage.promptTokens * PROMPT_TOKENS_PRICE +
		usage.completionTokens * RESPONSE_TOKENS_PRICE;
	console.info("Price: $", price);

	return {
		event: savedEvent,
		price,
		confidenceLevel: object.confidenceLevel,
	};
};

const PROMPT_TOKENS_PRICE = 0.15 / 1_000_000;
const RESPONSE_TOKENS_PRICE = 0.6 / 1_000_000;
const MODEL_NAME = "gpt-4o-mini";

const GET_EVENT_PROMPT = `
You are an expert maintainer of salsa, bachata and kizomba dancing social events.
Socials are events for no more than one day where the people can dance.
Your goal is to generate an event data objects that can be saved in the database so that the people know where to dance.

For your task, you must generate an event object following this guide:

1. **Confidence Level**:
- The confidence level from 0 to 100 is the probability that the information is correct and it is a real social event.
- The image and message you get might or might not be related to a social event. It can be a random image.
- The message must only contain information about a single event for one day. If not, the confidence level must be lower than 50.
- The information cannot be about a congress or festival. It must be a social event.

2. **Date, start and end time**: 
- We are in the year ${new Date().getFullYear()} 
- If there is no end time, assume the event ends at 3:00 if it starts at night.
- If the event starts in the morning or evening, assume it ends 3 hours after the last activity mentioned or the start time.
- If there is the time for the workshops/classes, give me the as start time the time for the party.
- If an event starts after midnight but close to 00:00, say the start time is 23:30.
- Give the date as YYYY-MM-DD. 
- Give the time as HH:MM.

2. **Salsa, bachata and kizomba percentages**: 
- This is the percentage of the music style that is played in the event. 
- The salsa, bachata and kizomba percentages must be in total 100.
- In case there is no exact information about the percentages, assume it from the message or image.
E.g. if the title says something like "Salsa Something", you can assume 100% salsa.
- In case the percentages cannot be assumed, assume 40% salsa, 60% bachata, 0% kizomba.

3. **Event name**:
- The event name must be in Title Clase.

4. **Location Name**:
- Prefer the locations names as they are saved in the database.
- If the location you recognized is not in the list, is ok to return a new organizer that is not in the list.
- This are the locations area already saved in the database:
{{ locationNames }}

5. **Organize Name**:
- Prefer the organizers names as they are saved in the database.
- If the organizer you recognized is not in the list, is ok to return a new organizer that is not in the list.
- If you cannot recognize the organizer, use the location name as organizer. 
- This is the organizers already saved in the database:
{{ organizerNames }}

{{ socialMediaMessage }}
`;

export function authenticateRequest(request: Request) {
	const secret = request.headers.get("Authorization");
	if (!secret || secret !== process.env.API_SECRET) {
		// serverOnly$ because remix is complaining on build about client code in server
		// eslint-disable-next-line @typescript-eslint/only-throw-error
		throw serverOnly$(data({ error: "Unauthorized" }, { status: 401 }));
	}
}

const aiEventSchema = z.object({
	confidenceLevel: intWithinRange(0, 100),
	name: z.string().trim().min(1),
	organizerName: z.string().min(1),
	date: z.string(),
	startTime: z.string(),
	endTime: z.string(),
	locationName: z.string().min(1),
	salsaPercentage: intWithinRange(0, 100),
	bachataPercentage: intWithinRange(0, 100),
	kizombaPercentage: intWithinRange(0, 100),
});
type AiEvent = z.infer<typeof aiEventSchema>;

async function saveEvent(aiEvent: AiEvent, infoUrl: string) {
	const city = await db.city.findFirst({
		where: { name: CITY },
		select: { id: true },
	});
	assert(city, "City not found");
	const cityId = city.id;

	const startDate = new Date(`${aiEvent.date}T${aiEvent.startTime}Z`);
	const endDate = new Date(`${aiEvent.date}T${aiEvent.endTime}Z`);

	const organizer = await db.organizer.findFirst({
		where: {
			name: {
				equals: aiEvent.organizerName.trim(),
				mode: "insensitive",
			},
		},
		select: { id: true },
	});

	const location = await db.location.findFirst({
		where: {
			name: {
				equals: aiEvent.locationName.trim(),
				mode: "insensitive",
			},
		},
		select: { id: true },
	});

	return db.event.create({
		data: {
			infoUrl: infoUrl,
			name: aiEvent.name,
			startDate: startDate,
			endDate: endDate,
			location: {
				connectOrCreate: {
					where: { id: location?.id ?? 0 },
					create: {
						name: aiEvent.locationName,
						googleMapsUrl: "",
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
					where: { id: organizer?.id ?? 0 },
					create: { name: aiEvent.organizerName },
				},
			},
			salsaPercentage: aiEvent.salsaPercentage,
			bachataPercentage: aiEvent.bachataPercentage,
			kizombaPercentage: aiEvent.kizombaPercentage,
			status: EventStatus.PUBLISHED,
		},
		select: {
			id: true,
			infoUrl: true,
			name: true,
			startDate: true,
			endDate: true,
			location: {
				select: {
					name: true,
					googleMapsUrl: true,
				},
			},
			organizer: {
				select: {
					name: true,
				},
			},
			salsaPercentage: true,
			bachataPercentage: true,
			kizombaPercentage: true,
		},
	});
}

async function eventAlreadyExists(
	date: string,
	time: string,
	locationName: string
) {
	const response = {
		alreadyExists: false,
		isSetToPublished: false,
	};
	const startDate = new Date(`${date}T${time}Z`);
	const event = await db.event.findFirst({
		where: {
			startDate,
			location: {
				name: {
					equals: locationName.trim(),
					mode: "insensitive",
				},
			},
		},
		select: {
			status: true,
			id: true,
		},
	});
	const exists = !!event;
	if (exists && event.status !== EventStatus.PUBLISHED) {
		await db.event.update({
			where: { id: event.id },
			data: { status: EventStatus.PUBLISHED },
		});
		response.isSetToPublished = true;
		console.info(
			`Event from ${locationName} at ${date} was not published. Now it is published`
		);
	}
	response.alreadyExists = exists;

	return response;
}

async function getOrganizerNames() {
	const organizers = await db.organizer.findMany({
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
		select: { name: true },
	});
	return organizers
		.map((organizer) => {
			return `${organizer.name} \n`;
		})
		.join("");
}

async function getLocationNames() {
	const locations = await db.location.findMany({
		where: {
			city: {
				name: CITY,
			},
		},
		select: { name: true },
	});
	return locations
		.map((location) => {
			return `${location.name} \n`;
		})
		.join("");
}

async function getMessagesContent(
	details: string | undefined,
	image: string | undefined
) {
	let socialMediaMessage = "";
	if (details) {
		socialMediaMessage = `SOCIAL MEDIA MESSAGE: ${details} \n`;
	}

	const organizerNames = await getOrganizerNames();
	const locationNames = await getLocationNames();

	const messageParameters = {
		organizerNames,
		locationNames,
		socialMediaMessage,
	};

	const content: Content[] = [
		{
			type: "text",
			text: getMessageWithParameters(GET_EVENT_PROMPT, messageParameters),
		},
	];

	if (image) {
		content.push({
			type: "image",
			image: image,
		});
	}
	return content;
}

function getMessageWithParameters(
	template: string,
	parameters: Record<string, string>
) {
	return template.replaceAll(/{{\s*(\w+)\s*}}/g, (match, key: string) => {
		return parameters[key] ?? match;
	});
}

type Content =
	| { type: "text"; text: string }
	| { type: "image"; image: string };
