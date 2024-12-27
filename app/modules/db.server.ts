import { remember } from "@epic-web/remember";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

export const db = remember("prisma", () => {
	const client = new PrismaClient()
	if(process.env.NODE_ENV === "production") {
		client.$extends(withAccelerate());
	}
	void client.$connect();
	return client;
});
