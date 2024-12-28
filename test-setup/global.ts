import "dotenv/config";
import { execaCommand } from "execa";
import { Client } from "pg";

export const pgClient = new Client({
	connectionString: process.env.DATABASE_URL,
});
export const databaseTemplateName = "test";
const templateDatabaseUrl = process.env.DATABASE_URL?.replace(
	"/local",
	`/${databaseTemplateName}`
);

export async function setup() {
	// create postgres template database
	await pgClient.connect();
	await pgClient.query(
		`UPDATE pg_database SET datistemplate='false' WHERE datname='${databaseTemplateName}';`
	);
	await pgClient.query(
		`DROP DATABASE IF EXISTS ${databaseTemplateName} WITH (FORCE);`
	);

	await execaCommand(
		"prisma migrate reset --force --skip-seed --skip-generate",
		{
			stdio: "inherit",
			env: {
				DATABASE_URL: templateDatabaseUrl,
			},
		}
	);
	await pgClient.query(
		`UPDATE pg_database SET datistemplate='true', datallowconn='false' WHERE datname='${databaseTemplateName}';`
	);
	await pgClient.end();
}
