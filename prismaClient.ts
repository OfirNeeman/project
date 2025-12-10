import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  // Prisma 7 expects either `adapter` or `accelerateUrl`
  adapter: {
    type: "sqlite",
    url: process.env.DATABASE_URL, // make sure DATABASE_URL is in .env
  },
});
