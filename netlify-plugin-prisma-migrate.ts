import { NetlifyPlugin } from '@netlify/build';

export const onPreBuild: NetlifyPlugin['onPreBuild'] = async ({ utils }) => {
	try {
		console.log("Running Prisma migrations...");
		await utils.run.command("npx prisma migrate deploy");
		console.log("Prisma migrations completed.");
	} catch (error) {
		utils.build.failBuild("Failed to run Prisma migrations", { error } as never);
	}
}
