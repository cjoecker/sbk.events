import { remember } from "@epic-web/remember";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

export const db = remember("prisma", () => {
	const client = new PrismaClient().$extends(withAccelerate());
	void client.$connect();
	return client;
});
