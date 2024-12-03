import { remember } from "@epic-web/remember";
import prisma from "@prisma/client/edge"
import { withAccelerate } from '@prisma/extension-accelerate'

export const db = remember("prisma", () => {
	const client = new prisma.PrismaClient().$extends(withAccelerate());
	void client.$connect();
	return client;
});
