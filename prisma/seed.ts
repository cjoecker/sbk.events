import { PrismaClient } from "@prisma/client";
import { db } from "~/modules/db.server";
import { addDays, addHours, addMonths, addYears } from "date-fns";

const prisma = new PrismaClient();

const devEmails = ["c.jocker@hotmail.com"];

async function main() {
	console.info("seeding... 🪹");

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

	await db.location.upsert({
		where: { id: 2 },
		update: {},
		create: {
			name: "Bachata Club",
			googleMapsUrl: "https://goo.gl/maps/1",
			city: {
				connect: { id: city.id },
			},
		},
	});

	await db.organizer.upsert({
		where: { id: 1 },
		update: {},
		create: {
			name: "Organizer 1",
			website: "https://salsa.com",
		},
	});

	await db.organizer.upsert({
		where: { id: 2 },
		update: {},
		create: {
			name: "Organizer 2",
			website: "https://salsa.com",
		},
	});

	const today = addYears(new Date(), 3);
	await db.event.upsert({
		where: { id: 1 },
		update: {},
		create: {
			infoUrl: "https://salsa.com",
			name: "Salsa Event",
			organizer: {
				connect: { id: 1 },
			},
			startDate: today,
			endDate: today,
			location: {
				connect: { id: 1 },
			},
			salsaPercentage: 50,
			bachataPercentage: 30,
			kizombaPercentage: 20,
			likes: 2,
		},
	});

	await db.event.upsert({
		where: { id: 2 },
		update: {},
		create: {
			infoUrl: "https://salsa.com",
			name: "Bachata Event",
			organizer: {
				connect: { id: 2 },
			},
			startDate: addHours(today, 1),
			endDate: addHours(today, 3),
			location: {
				connect: { id: 2 },
			},
			salsaPercentage: 20,
			bachataPercentage: 50,
			kizombaPercentage: 30,
			likes: 3,
		},
	});

	await db.event.upsert({
		where: { id: 3 },
		update: {},
		create: {
			infoUrl: "https://salsa.com",
			name: "Kizomba Event",
			organizer: {
				connect: { id: 2 },
			},
			startDate: addHours(today, 4),
			endDate: addHours(today, 2),
			location: {
				connect: { id: 2 },
			},
			salsaPercentage: 20,
			bachataPercentage: 50,
			kizombaPercentage: 30,
			likes: 3,
		},
	});

	const tomorrow = addDays(today, 1);
	await db.event.upsert({
		where: { id: 4 },
		update: {},
		create: {
			infoUrl: "https://salsa.com",
			name: "Salsa Event",
			organizer: {
				connect: { id: 1 },
			},
			startDate: tomorrow,
			endDate: tomorrow,
			location: {
				connect: { id: 1 },
			},
			salsaPercentage: 50,
			bachataPercentage: 30,
			kizombaPercentage: 20,
			likes: 2,
		},
	});

	await db.event.upsert({
		where: { id: 5 },
		update: {},
		create: {
			infoUrl: "https://salsa.com",
			name: "Bachata Event",
			organizer: {
				connect: { id: 2 },
			},
			startDate: addHours(tomorrow, 1),
			endDate: addHours(tomorrow, 3),
			location: {
				connect: { id: 2 },
			},
			salsaPercentage: 20,
			bachataPercentage: 50,
			kizombaPercentage: 30,
			likes: 3,
		},
	});

	await db.event.upsert({
		where: { id: 6 },
		update: {},
		create: {
			infoUrl: "https://salsa.com",
			name: "Kizomba Event",
			organizer: {
				connect: { id: 2 },
			},
			startDate: addMonths(tomorrow, 1),
			endDate: addMonths(tomorrow, 1),
			location: {
				connect: { id: 2 },
			},
			salsaPercentage: 20,
			bachataPercentage: 50,
			kizombaPercentage: 30,
			likes: 3,
		},
	});

	console.info("seeded 🪺");
}

main()
	.catch((error: unknown) => {
		console.error(error);
		throw error;
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
