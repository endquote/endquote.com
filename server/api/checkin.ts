import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const data = await prisma.checkin.findFirst();
    return data;
  } catch (error) {
    console.error(error);
    return { error: "Failed to fetch data" };
  }
});
