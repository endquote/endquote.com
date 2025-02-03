import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export interface TripQuery {
  start: string; // YYYY-MM-DD format
}

// let the client know that dates will be strings
export interface Trip
  extends Omit<
    Prisma.tripGetPayload<{
      include: {
        checkins: { include: { venue: true } };
        flights: true;
      };
    }>,
    "start" | "end"
  > {
  start: string;
  end: string;
}

export interface TripResponse {
  data: Trip;
}

export default defineEventHandler(async (event): Promise<TripResponse> => {
  try {
    const query = getQuery<TripQuery>(event);

    if (!query.start) {
      throw createError({ statusCode: 403 });
    }

    const trip = await prisma.trip.findFirst({
      include: {
        checkins: { include: { venue: true }, orderBy: { date: "asc" } },
        flights: { orderBy: { date: "asc" } },
      },
      orderBy: { start: "asc" },
      where: {
        start: {
          gte: new Date(query.start as string),
        },
      },
    });

    if (!trip) {
      throw createError({ statusCode: 404 });
    }

    return {
      data: {
        ...trip,
        start: trip.start.toISOString(),
        end: trip.end.toISOString(),
      },
    };
  } catch (error) {
    throw createError(JSON.stringify(error));
  }
});
