import type { Prisma } from "@prisma/client";
import { HOME_DISTANCE } from "../app/utils/constants";
import { db, haversine } from "./shared";
// trips break if there's this much time between checkins (ms)
const maxTime = 48 * 60 * 60 * 1000;
// trips break if there's this much distance between checkins (km)
const tripDist = 40;
type Checkin = Prisma.checkinGetPayload<{ include: { venue: true } }>;
type Flight = Prisma.flightGetPayload<{}>;
type HomeAir = { venue: Prisma.venueGetPayload<{}>; home: Prisma.homeGetPayload<{}>; code: string };
type Trip = { checkins: Checkin[]; flights: Flight[]; start: Date; end: Date };

const main = async () => {
  const homes = await db.home.findMany();

  // all checkins, including venues
  const allCheckins = await db.checkin.findMany({
    orderBy: { date: "asc" },
    include: { venue: true },
    where: {
      venue: {
        NOT: {
          category: { in: ["Country", "City"] },
        },
      },
    },
  });

  // just the ones that are not at home
  const tripCheckins = allCheckins.filter((c) =>
    homes.some(
      (h) => c.date >= h.start && c.date <= h.end && haversine(h.lat, h.lng, c.venue.lat, c.venue.lng) > HOME_DISTANCE,
    ),
  );

  // airports in the home regions
  const homeAir: HomeAir[] = (await db.venue.findMany({ where: { category: { contains: "Airport" } } }))
    .map((v) => ({ venue: v, code: v.name.match(/\(([A-Z]{3})\)/)?.[1] }))
    .filter((v) => v.code)
    .filter((v) => homes.some((h) => h.airports.includes(v.code)))
    .map((v) => ({ venue: v.venue, code: v.code, home: homes.find((h) => h.airports.includes(v.code)) }));

  let checkinTrips = buildCheckinTrips(tripCheckins);
  checkinTrips = combineCheckinTrips(checkinTrips, allCheckins, homeAir);
  checkinTrips = extendCheckinTrips(checkinTrips, allCheckins, homeAir);

  const allFlights = await db.flight.findMany();
  const flightTrips = buildFlightTrips(allFlights, homeAir);

  const trips = buildTrips(checkinTrips, flightTrips);
  await saveTrips(trips);
};

// group non-home checkins into trips based on time gaps
const buildCheckinTrips = (checkins: Checkin[]): Checkin[][] => {
  const trips: Checkin[][] = [];
  checkins.sort((a, b) => (a.date > b.date ? 1 : -1));
  let trip: Checkin[] = [checkins[0]];

  for (let i = 1; i < checkins.length; i++) {
    const c = checkins[i];

    // add checkins as long as they're close in time/distance
    const lastCheckin = trip[trip.length - 1];
    const time = c.date.getTime() - lastCheckin.date.getTime();
    const dist = haversine(c.venue.lat, c.venue.lng, lastCheckin.venue.lat, lastCheckin.venue.lng);
    if (time <= maxTime && dist <= tripDist) {
      trip.push(c);
      continue;
    }

    // complete trip
    trips.push(trip);
    trip = [c];
  }

  trips.push(trip);
  trips.sort((a, b) => (a[0].date > b[0].date ? 1 : -1));
  return trips;
};

// combine trips if they're close together in time, unless they stopped a home airport in between
const combineCheckinTrips = (checkinTrips: Checkin[][], allCheckins: Checkin[], homeAir: HomeAir[]) => {
  for (let i = 0; i < checkinTrips.length - 1; i++) {
    const thisTrip = checkinTrips[i];
    const nextTrip = checkinTrips[i + 1];
    const lastCheckin = thisTrip[thisTrip.length - 1];
    const firstCheckin = nextTrip[0];
    const time = firstCheckin.date.getTime() - lastCheckin.date.getTime();
    const home = homeAir.find((h) => thisTrip[0].date >= h.home.start && thisTrip[0].date <= h.home.end);
    const airBreak = allCheckins.find(
      (c) => c.venue.fsId == home.venue.fsId && c.date < firstCheckin.date && c.date > lastCheckin.date,
    );

    if (time <= maxTime * 2 && !airBreak) {
      // Combine trips
      thisTrip.push(...nextTrip);
      thisTrip.sort((a, b) => (a.date > b.date ? 1 : -1));
      checkinTrips.splice(i + 1, 1);
      i--; // Recheck the current trip with the next one
    }
  }

  return checkinTrips;
};

// add the home airports to trips
const extendCheckinTrips = (checkinTrips: Checkin[][], allCheckins: Checkin[], homeAir: HomeAir[]) => {
  for (let t = 0; t < checkinTrips.length - 1; t++) {
    const trip = checkinTrips[t];
    const hasAirports = trip.some((c) => c.venue.airport);
    if (!hasAirports) {
      continue;
    }

    const search = 5;
    const home = homeAir.find((h) => trip[0].date >= h.home.start && trip[0].date <= h.home.end);

    // search backward from the start of the trip to find the home airport checkin
    const tripStart = allCheckins.indexOf(trip[0]);
    const prevTrip = checkinTrips[t - 1];
    // but don't search into the previous trip
    const prevTripEnd = prevTrip ? allCheckins.indexOf(prevTrip[prevTrip.length - 1]) : 0;

    for (let c = tripStart - 1; c >= Math.max(0, prevTripEnd, tripStart - search); c--) {
      const checkin = allCheckins[c];
      if (home.venue.fsId === checkin.venue.fsId) {
        const time = trip[0].date.getTime() - checkin.date.getTime();
        if (time <= maxTime) {
          trip.unshift(...allCheckins.slice(c, tripStart));
        }
        break;
      }
    }

    // search forward from the end of the trip to find the home airport checkin
    const tripEnd = allCheckins.indexOf(trip[trip.length - 1]);
    const nextTrip = checkinTrips[t + 1];
    // but don't search into the next trip
    const nextTripStart = nextTrip ? allCheckins.indexOf(nextTrip[0]) : allCheckins.length - 1;

    for (let c = tripEnd + 1; c <= Math.min(allCheckins.length - 1, nextTripStart, tripEnd + search); c++) {
      const checkin = allCheckins[c];
      if (home.venue.fsId === checkin.venue.fsId) {
        const time = checkin.date.getTime() - trip[trip.length - 1].date.getTime();
        if (time <= maxTime) {
          trip.push(...allCheckins.slice(tripEnd + 1, c + 1));
        }
        break;
      }
    }
  }

  return checkinTrips;
};

// group flights into trips
const buildFlightTrips = (allFlights: Flight[], homeAir: HomeAir[]): Flight[][] => {
  const trips: Flight[][] = [];
  for (let i = 0; i < allFlights.length; i++) {
    const firstFlight = allFlights[i];
    const home = homeAir.find(
      (h) =>
        flightStart(firstFlight).getTime() >= h.home.start.getTime() &&
        flightEnd(firstFlight).getTime() <= h.home.end.getTime(),
    );

    if (!home) {
      // this happens on the one flight from one home to another
      continue;
    }

    if (firstFlight.fromAirport === home.code) {
      const trip = [firstFlight];

      for (let j = i + 1; j < allFlights.length; j++) {
        const nextFlight = allFlights[j];
        if (nextFlight.fromAirport === home.code) {
          // left from home twice, broken trip
          i = j - 1;
          break;
        }

        // add flight
        trip.push(nextFlight);

        if (nextFlight.toAirport === home.code && !nextFlight.canceled) {
          // returned home
          i = j;
          break;
        }
      }
      trips.push(trip);
    }
  }

  return trips;
};

// combine checkin and flight trips into trips
const buildTrips = (checkinTrips: Checkin[][], flightTrips: Flight[][]): Trip[] => {
  const trips: Trip[] = [];
  const ct = [...checkinTrips];
  const ft = [...flightTrips];

  // pair checkins with flights to build trips
  for (const checkins of ct) {
    const ctStart = checkins[0].date.getTime();
    const ctEnd = checkins[checkins.length - 1].date.getTime();
    let f: Flight[] = [];
    for (const flights of ft) {
      const ftStart = flightStart(flights[0]).getTime();
      const ftEnd = flightEnd(flights[flights.length - 1]).getTime();

      if (
        (ftStart >= ctStart && ftStart <= ctEnd) ||
        (ftEnd >= ctStart && ftEnd <= ctEnd) ||
        (ctStart >= ftStart && ctEnd <= ftEnd) ||
        (ctEnd >= ftStart && ctEnd <= ftEnd)
      ) {
        f = flights;
        ft.splice(ft.indexOf(flights), 1);
        break;
      }
    }

    const start = new Date(
      Math.min(checkins[0]?.date?.getTime() ?? Infinity, flightStart(f[0])?.getTime() ?? Infinity),
    );
    const end = new Date(
      Math.max(checkins[checkins.length - 1]?.date?.getTime() ?? 0, flightEnd(f[f.length - 1])?.getTime() ?? 0),
    );

    trips.push({ checkins, flights: f, start, end });
  }

  // make trips of any flights without checkins
  for (const flights of ft) {
    trips.push({ checkins: [], flights, start: flightStart(flights[0]), end: flightEnd(flights[flights.length - 1]) });
  }

  trips.sort((a, b) => a.start.getTime() - b.start.getTime());

  return trips;
};

const saveTrips = async (trips: Trip[]) => {
  await db.trip.deleteMany();

  for (const trip of trips) {
    // save the trip
    await db.trip.create({
      data: {
        start: trip.start,
        end: trip.end,
        checkins: { connect: trip.checkins.map((c) => ({ fsId: c.fsId })) },
        flights: { connect: trip.flights.map((f) => ({ flightyId: f.flightyId })) },
      },
    });
  }

  // remove flights from all checkins
  await db.checkin.updateMany({ data: { flightId: null } });
  const airportSearch = 3;

  // link checkins to flights
  for (const trip of trips) {
    for (const checkin of trip.checkins.filter((c) => c.venue.airport)) {
      const code = checkin.venue.airport;
      if (!code) continue;

      // see if there are more airports in the near future
      const moreAirports = trip.checkins
        .slice(trip.checkins.indexOf(checkin) + 1, trip.checkins.indexOf(checkin) + (airportSearch + 1))
        .some((c) => c.venue.airport);

      const foundFlight = moreAirports
        ? // if there are more airports, we are flying away from this checkin
          findClosestFlight(
            trip.flights.filter((f) => f.fromAirport === code),
            checkin.date,
            true,
          )
        : // if there are no more airports, we are flying toward this checkin
          findClosestFlight(
            trip.flights.filter((f) => f.toAirport === code),
            checkin.date,
            false,
          );

      if (foundFlight) {
        await db.checkin.update({
          where: { fsId: checkin.fsId },
          data: { flight: { connect: { flightyId: foundFlight.flightyId } } },
        });
      }
    }
  }
};

const findClosestFlight = (flights: Flight[], date: Date, checkStart: boolean): Flight | null => {
  let closestFlight: Flight | null = null;
  let smallestDiff = Infinity;

  for (const flight of flights) {
    const flightDate = checkStart ? flightStart(flight) : flightEnd(flight);
    if (!flightDate) continue;

    const diff = Math.abs(flightDate.getTime() - date.getTime());

    if (diff < smallestDiff) {
      smallestDiff = diff;
      closestFlight = flight;
    }
  }

  const maxDiff = 12 * 60 * 60 * 1000;
  if (smallestDiff > maxDiff) {
    return null;
  }

  return closestFlight;
};

const flightStart = (flight: Flight): Date | null => {
  if (!flight) {
    return null;
  }
  return flight.actualDeparture || flight.scheduledDeparture || flight.date;
};

const flightEnd = (flight: Flight): Date | null => {
  if (!flight) {
    return null;
  }
  return flight.actualArrival || flight.scheduledArrival || flight.date;
};

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
    .then(async () => {
      await db.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await db.$disconnect();
      process.exit(1);
    });
}
