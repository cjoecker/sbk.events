export const onPreBuild = async ({ utils }) => {
	try {
		console.info("Running Prisma migrations...");
		await utils.run.command("npx prisma generate --no-engine");
		await utils.run.command("npx prisma migrate deploy");
		console.info("Prisma migrations completed.");
	} catch (error) {
		utils.build.failBuild("Failed to run Prisma migrations", { error });
	}
};
