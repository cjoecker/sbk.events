import { openai } from "@ai-sdk/openai";
import { EventStatus } from "@prisma/client";
import { ActionFunctionArgs } from "@vercel/remix";
import { generateObject } from "ai";
import { format } from "date-fns";
import { z } from "zod";

import { CITY } from "~/constants/city";
import { db } from "~/modules/db.server";
import { assert, intWithinRange } from "~/utils/validation";

export const action = async ({ request }: ActionFunctionArgs) => {
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
			infoUrl: z.string().optional(),
		})
		.parse(body);

	let socialMediaMessage = "";
	if (data.details) {
		socialMediaMessage = `Social media message: ${data.details} \n`;
	}

	if (!(await isSocialEvent(socialMediaMessage, data.image))) {
		const error =
			"The message and the image are not about a social dancing event";
		console.error(error);
		return {
			error,
		};
	}

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
	const organizerNames = organizers
		.map((organizer) => {
			return `${organizer.name} \n`;
		})
		.join("");

	const locations = await db.location.findMany({
		where: {
			city: {
				name: CITY,
			},
		},
		select: { name: true },
	});
	const locationNames = locations
		.map((location) => {
			return `${location.name} \n`;
		})
		.join("");
	const futureEvents = await db.event.findMany({
		where: {
			startDate: {
				gte: new Date(),
			},
			location: {
				city: {
					name: CITY,
				},
			},
		},
		select: { organizer: true, startDate: true },
	});
	const futureEventNames = futureEvents
		.map((event) => {
			return `${format(event.startDate, "dd/MM/yy hh:mm")} - ${
				event.organizer.name
			} \n`;
		})
		.join("");

	const messageParameters = {
		organizerNames,
		locationNames,
		futureEventNames,
		socialMediaMessage,
	};

	const content: Content[] = [
		{
			type: "text",
			text: getMessageWithParameters(getEventPrompt, messageParameters),
		},
	];

	if (data.image) {
		content.push({
			type: "image",
			image: data.image,
		});
	}

	const { object, usage } = await generateObject({
		model: openai("gpt-4o-mini"),
		schema: aiEventSchema,
		messages: [
			{
				role: "user",
				content: content,
			},
		],
	});

	if (await eventExists(object.date, object.startTime, object.locationName)) {
		const error = `Event from ${object.organizerName} at ${object.date} already exists`;
		console.error(error);
		return {
			error,
		};
	}

	const savedEvent = await saveEvent(object);

	// console.info(JSON.stringify(object, null, 2));
	const price =
		usage.promptTokens * promptTokensPrice +
		usage.completionTokens * completionTokensPrice;
	console.info("Price: $", price);

	return savedEvent;
};

async function isSocialEvent(
	socialMediaMessage: string,
	image: string | undefined
) {
	const content: Content[] = [
		{
			type: "text",
			text: getMessageWithParameters(checkIfEventPrompt, {
				socialMediaMessage,
			}),
		},
	];

	if (image) {
		content.push({
			type: "image",
			image,
		});
	}

	const { object } = await generateObject({
		model: openai("gpt-4o-mini"),
		schema: z.object({
			// infoUrl: z.string().trim().url(),
			isSocialEvent: z.boolean(),
		}),
		messages: [
			{
				role: "user",
				content: content,
			},
		],
	});
	return object.isSocialEvent;
}

const checkIfEventPrompt = `
You are a maintainer of salsa, bachata and kizomba dancing social events.
Your task is to identify if the message and the image are about a social event.
The message can only contain information about a single event for one day.
The information cannot be about a congress or festival.

{{ socialMediaMessage }}
`;

const getEventPrompt = `
You are a maintainer of salsa, bachata and kizomba dancing social events.
Socials are events for no more than one day where the people can dance.
Your task is to generate an event objects that can be saved in the database so that the people know where to dance.
The messages are from social media might contain unnecessary information.
We are in the year ${new Date().getFullYear()}


If there is no end time, assume the event ends at 3:00 if it starts at night.
If it starts in the morning or evening, assume it ends 3 hours after the last activity mentioned or the start time.
If there is the time for the workshops/classes, give me the as start time the time for the party.
Give me the date as YYYY-MM-DD. The time as HH:MM.

The salsa, bachata and kizomba percentages must be in total 100.
In case there is no information about the percentages, assume it from the title of the event.
E.g. if the title says something like "Salsa Something", you can assume 100% salsa.
In case it cannot be assumed from the title, assume 40% salsa, 60% bachata, 0% kizomba.
Give me the event name in Title Clase.

Prefer the organizers names as they are saved in the database.
If they are not saved, is ok to add a give me a new organizer that is not in the list.
If you cannot recognize the organizer, use the location name as organizer. 
This is the organizers already saved in the database:
{{ organizerNames }}

Prefer the locations names as they are saved in the database.
If they are not saved, is ok to add a give me a new location that is not in the list.
This are the locations area already saved in the database:
{{ locationNames }}

The events might already exist in the database.
If the event already exists, throw an error.
This are the future events already saved in the database:
{{ futureEventNames }}

{{ socialMediaMessage }}
`;

const aiEventSchema = z.object({
	// infoUrl: z.string().trim().url(),
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

function getMessageWithParameters(
	template: string,
	parameters: Record<string, string>
) {
	return template.replaceAll(/{{\s*(\w+)\s*}}/g, (match, key: string) => {
		return parameters[key] ?? match;
	});
}

async function eventExists(date: string, time: string, locationName: string) {
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
		console.info(
			`Event from ${locationName} at ${date} was not published. Now it is published`
		);
	}
	return !!event;
}

async function saveEvent(aiEvent: AiEvent) {
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

	return await db.event.create({
		data: {
			infoUrl: "",
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
	});
}

const promptTokensPrice = 0.15 / 1_000_000;
const completionTokensPrice = 0.6 / 1_000_000;

type Content =
	| { type: "text"; text: string }
	| { type: "image"; image: string };

// TODO
// add cached input
// https://sdk.vercel.ai/providers/ai-sdk-providers/openai#prompt-caching
