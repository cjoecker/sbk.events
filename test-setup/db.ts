import { afterAll, beforeAll } from "vitest";

import { databaseTemplateName, pgClient } from "./global";

const databaseName = `${databaseTemplateName}_${process.env.VITEST_POOL_ID}`;
process.env.DATABASE_URL = process.env.DATABASE_URL?.replace(
	"/local",
	`/${databaseName}`
);

beforeAll(async () => {
	// copy postgres template for every test
	await pgClient.connect();

	await pgClient.query(`DROP DATABASE IF EXISTS ${databaseName} WITH (FORCE);`);
	await pgClient.query(
		`CREATE DATABASE ${databaseName} WITH TEMPLATE ${databaseTemplateName}`
	);
});
afterAll(async () => {
	const { db } = await import("~/modules/db.server");
	await db.$disconnect();
	await pgClient.query(`DROP DATABASE IF EXISTS ${databaseName} WITH (FORCE);`);
	await pgClient.end();
});
