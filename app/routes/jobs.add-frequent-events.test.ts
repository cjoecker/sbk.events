import { EventFrequency, EventStatus, Event } from "@prisma/client";
import { addDays } from "date-fns";

import {
	mockDateAdvancingTime,
	restoreDateAdvancingTime,
} from "../../test-setup/utils";

import { db } from "~/modules/db.server";
import { loader } from "~/routes/jobs.add-frequent-events";

const eventMock: Omit<Event, "id" | "createdAt" | "updatedAt"> = {
	infoUrl: "https://salsa.com",
	name: "Salsa Event",
	startDate: new Date(),
	endDate: new Date(),
	salsaPercentage: 50,
	bachataPercentage: 30,
	kizombaPercentage: 20,
	likes: 2,
	status: EventStatus.PUBLISHED,
	frequency: EventFrequency.WEEKLY,
	locationId: 1,
	organizerId: 1,
};

describe("add frequent events job", () => {
	afterEach(async () => {
		restoreDateAdvancingTime();
		await db.event.deleteMany();
	});
	test("create frequent event from last two weeks and ignore one time events", async () => {
		// thursday
		mockDateAdvancingTime("2025-01-16 12:32:34");
		const eventStartDate = new Date("2025-01-12 21:30");
		const eventEndDate = new Date("2025-01-13 03:00");

		await setup();
		await db.event.createMany({
			data: [
				{
					...eventMock,
					startDate: eventStartDate,
					endDate: new Date("2025-01-13 03:00"),
				},
				{
					...eventMock,
					startDate: new Date("2025-01-13 21:30"),
					endDate: new Date("2025-01-14 03:00"),
					frequency: EventFrequency.ONE_TIME,
				},
			],
		});
		await loader();
		const events = await db.event.findMany({
			orderBy: {
				startDate: "asc",
			},
		});
		expect(events.length).toBe(3);
		expect(events[0].startDate.getDate()).toBe(eventStartDate.getDate());
		expect(events[2].startDate.getDate()).toBe(eventStartDate.getDate() + 7);
		expect(events[2].endDate.getDate()).toBe(eventEndDate.getDate() + 7);
	});
	test("create frequent event for all days of the week", async () => {
		const date = "2025-01-16 12:32:34";
		// thursday
		mockDateAdvancingTime(date);
		const today = new Date(date);

		await setup();
		await db.event.createMany({
			data: [
				{
					...eventMock,
					// Wed
					startDate: new Date("2025-01-08 03:00"),
					endDate: new Date("2025-01-09 03:00"),
				},
				{
					...eventMock,
					// Thu
					startDate: new Date("2025-01-09 03:00"),
					endDate: new Date("2025-01-10 03:00"),
				},
				{
					...eventMock,
					// Fri
					startDate: new Date("2025-01-10 03:00"),
					endDate: new Date("2025-01-11 03:00"),
				},
				{
					...eventMock,
					// Sat
					startDate: new Date("2025-01-11 03:00"),
					endDate: new Date("2025-01-12 03:00"),
				},
				{
					...eventMock,
					// Sun
					startDate: new Date("2025-01-12 03:00"),
					endDate: new Date("2025-01-13 03:00"),
				},
				{
					...eventMock,
					// Mon
					startDate: new Date("2025-01-13 03:00"),
					endDate: new Date("2025-01-14 03:00"),
				},
				{
					...eventMock,
					// Tue
					startDate: new Date("2025-01-14 03:00"),
					endDate: new Date("2025-01-15 03:00"),
				},
				{
					...eventMock,
					// Wed
					startDate: new Date("2025-01-15 03:00"),
					endDate: new Date("2025-01-16 03:00"),
				},
			],
		});
		await loader();
		const events = await db.event.findMany({
			orderBy: {
				startDate: "asc",
			},
			where: {
				startDate: {
					gte: today,
				},
			},
		});
		expect(events.length).toBe(7);
		expect(events[0].startDate.getDate()).toBe(addDays(today, 1).getDate());
		expect(events[1].startDate.getDate()).toBe(addDays(today, 2).getDate());
		expect(events[2].startDate.getDate()).toBe(addDays(today, 3).getDate());
		expect(events[3].startDate.getDate()).toBe(addDays(today, 4).getDate());
		expect(events[4].startDate.getDate()).toBe(addDays(today, 5).getDate());
		expect(events[5].startDate.getDate()).toBe(addDays(today, 6).getDate());
		expect(events[6].startDate.getDate()).toBe(addDays(today, 7).getDate());
	});
	test("ignore events older than one week", async () => {
		// thursday
		mockDateAdvancingTime("2025-01-16 12:32:34");
		const eventStartDate = new Date("2025-01-12 21:30");

		await setup();
		await db.event.createMany({
			data: [
				{
					...eventMock,
					startDate: addDays(eventStartDate, -15),
					endDate: new Date("2025-01-13 03:00"),
				},
			],
		});
		await loader();
		const events = await db.event.findMany({
			orderBy: {
				startDate: "asc",
			},
		});
		expect(events.length).toBe(1);
	});
	test("ignore events that already exist", async () => {
		// thursday
		mockDateAdvancingTime("2025-01-16 12:32:34");
		const eventStartDate = new Date("2025-01-12 21:30");

		await setup();
		await db.event.createMany({
			data: [
				{
					...eventMock,
					startDate: eventStartDate,
				},
				{
					...eventMock,
					startDate: addDays(eventStartDate, 7),
				},
			],
		});
		await loader();
		await loader();
		const events = await db.event.findMany({
			orderBy: {
				startDate: "asc",
			},
		});
		expect(events.length).toBe(2);
	});
	test("avoid duplicate of two events followed", async () => {
		// thursday
		mockDateAdvancingTime("2025-01-16 12:32:34");
		const eventStartDate = new Date("2025-01-15 21:30");

		await setup();
		await db.event.createMany({
			data: [
				{
					...eventMock,
					startDate: eventStartDate,
				},
				{
					...eventMock,
					startDate: addDays(eventStartDate, -7),
				},
				{
					...eventMock,
					startDate: addDays(eventStartDate, -14),
				},
			],
		});
		await loader();
		const events = await db.event.findMany({
			orderBy: {
				startDate: "asc",
			},
		});
		expect(events.length).toBe(4);
	});
	test("create frequent event from two weeks ago", async () => {
		// thursday
		const date = "2025-01-16 12:32:34";
		mockDateAdvancingTime(date);
		const eventStartDate = new Date("2025-01-15 21:30");

		await setup();
		await db.event.createMany({
			data: [
				{
					...eventMock,
					startDate: eventStartDate,
				},
				{
					...eventMock,
					startDate: addDays(eventStartDate, -14),
				},
			],
		});
		await loader();
		const events = await db.event.findMany({
			orderBy: {
				startDate: "asc",
			},
		});
		expect(events.length).toBe(3);
		expect(events[2].startDate.getDate()).toBe(eventStartDate.getDate() + 7);
	});
});

async function setup() {
	await db.organizer.upsert({
		where: { id: 1 },
		update: {},
		create: {
			name: "Organizer 1",
		},
	});

	const city = await db.city.upsert({
		where: { id: 1 },
		update: {},
		create: { name: "Valencia" },
	});

	await db.location.upsert({
		where: { id: 1 },
		update: {},
		create: {
			name: "Salsa Club",
			googleMapsUrl: "https://goo.gl/maps/1",
			city: {
				connect: { id: city.id },
			},
		},
	});
}
