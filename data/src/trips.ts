import { Prisma } from "@prisma/client";
import { db, haversine } from "./shared";

// trips break if there's this much time between checkins
const maxTime = 48 * 60 * 60;
// trips break if there's this much distance between checkins (km)
const maxDist = 40;
// trips must have at least this many checkins
const minCheckins = 1;

type Checkin = Prisma.CheckinGetPayload<{ include: { venue: true } }>;

type Cluster = {
  checkins: Checkin[];
  isHome: boolean;
};

const run = async () => {
  const checkins = await db.checkin.findMany({ include: { venue: true } });
  const clusters = createClusters(checkins);
  const homeAir = getHomeAirports(clusters);

  let trips = buildTrips(clusters);
  trips = combineTrips(trips, checkins, homeAir);
  trips = extendTrips(trips, checkins, homeAir);
  trips = trips.filter((t) => t.length >= minCheckins);

  await saveTrips(trips);
};

// cluster checkins based on distance between them
const createClusters = (checkins: Checkin[]): Cluster[] => {
  checkins.sort((a, b) => a.date - b.date);
  const clusters: Cluster[] = [];

  for (const c1 of checkins.filter((c) => c.venue.city)) {
    let found = false;

    for (const cluster of clusters) {
      for (const c2 of cluster.checkins) {
        const dist = haversine(c1.venue.lat, c1.venue.lng, c2.venue.lat, c2.venue.lng);
        if (dist < maxDist) {
          cluster.checkins.push(c1);
          found = true;
          break;
        }
      }

      if (found) {
        break;
      }
    }

    if (!found) {
      clusters.push({ checkins: [c1], isHome: false });
    }
  }

  // Flag large clusters as "home", which means they don't get included in trips.
  const largestSize = Math.max(...clusters.map((cl) => cl.checkins.length));
  for (const g of clusters) {
    g.isHome = g.checkins.length > largestSize * 0.5;
  }

  return clusters;
};

// return the venue IDs of the airports in the home clusters.
const getHomeAirports = (clusters: Cluster[]): number[] => {
  return Array.from(
    new Set(
      clusters
        .filter((c) => c.isHome)
        .flatMap((c) => c.checkins)
        .filter((c) => c.venue.category?.includes("Airport") && c.venue.name.match(/\([A-Z]{3}\)/))
        .map((c) => c.venue.eqId),
    ),
  );
};

// group non-home checkins into trips based on time gaps
const buildTrips = (clusters: Cluster[]): Checkin[][] => {
  const trips: Checkin[][] = [];
  const checkins = clusters.filter((c) => !c.isHome).flatMap((c) => c.checkins);
  checkins.sort((a, b) => a.date - b.date);
  let trip: Checkin[] = [checkins[0]];

  for (let i = 1; i < checkins.length; i++) {
    const c = checkins[i];

    // add checkins as long as they're close in time/distance
    const lastCheckin = trip[trip.length - 1];
    const time = c.date - lastCheckin.date;
    const dist = haversine(c.venue.lat, c.venue.lng, lastCheckin.venue.lat, lastCheckin.venue.lng);
    if (time <= maxTime && dist <= maxDist) {
      trip.push(c);
      continue;
    }

    // complete trip
    trips.push(trip);
    trip = [c];
  }

  trips.push(trip);
  trips.sort((a, b) => a[0].date - b[0].date);
  return trips;
};

// combine trips if they're close together in time, unless they stopped a home airport in between
const combineTrips = (trips: Checkin[][], checkins: Checkin[], homeAirports: number[]) => {
  for (let i = 0; i < trips.length - 1; i++) {
    const thisTrip = trips[i];
    const nextTrip = trips[i + 1];
    const lastCheckin = thisTrip[thisTrip.length - 1];
    const firstCheckin = nextTrip[0];
    const time = firstCheckin.date - lastCheckin.date;
    const airBreak = checkins.find(
      (c) => homeAirports.includes(c.venue.eqId) && c.date < firstCheckin.date && c.date > lastCheckin.date,
    );

    if (time <= maxTime * 2 && !airBreak) {
      // Combine trips
      thisTrip.push(...nextTrip);
      thisTrip.sort((a, b) => a.date - b.date);
      trips.splice(i + 1, 1);
      i--; // Recheck the current trip with the next one
    }
  }

  return trips;
};

// add the home airports to trips
const extendTrips = (trips: Checkin[][], checkins: Checkin[], homeAirports: number[]) => {
  for (let t = 0; t < trips.length - 1; t++) {
    const trip = trips[t];
    const hasAirports = trip.some((c) => c.venue.category?.includes("Airport") && c.venue.name.match(/\([A-Z]{3}\)/));
    if (!hasAirports) {
      continue;
    }

    const search = 5;

    // search backward from the start of the trip to find the home airport checkin
    const tripStart = checkins.indexOf(trip[0]);
    const prevTrip = trips[t - 1];
    // but don't search into the previous trip
    const prevTripEnd = prevTrip ? checkins.indexOf(prevTrip[prevTrip.length - 1]) : 0;

    for (let c = tripStart - 1; c >= Math.max(0, prevTripEnd, tripStart - search); c--) {
      const checkin = checkins[c];
      if (homeAirports.includes(checkin.venue.eqId)) {
        const time = trip[0].date - checkin.date;
        if (time <= maxTime) {
          trip.unshift(...checkins.slice(c, tripStart));
        }
        break;
      }
    }

    // search forward from the end of the trip to find the home airport checkin
    const tripEnd = checkins.indexOf(trip[trip.length - 1]);
    const nextTrip = trips[t + 1];
    // but don't search into the next trip
    const nextTripStart = nextTrip ? checkins.indexOf(nextTrip[0]) : checkins.length - 1;

    for (let c = tripEnd + 1; c <= Math.min(checkins.length - 1, nextTripStart, tripEnd + search); c++) {
      const checkin = checkins[c];
      if (homeAirports.includes(checkin.venueId)) {
        const time = checkin.date - trip[trip.length - 1].date;
        if (time <= maxTime) {
          trip.push(...checkins.slice(tripEnd + 1, c + 1));
        }
        break;
      }
    }
  }

  return trips;
};

const saveTrips = async (trips: Checkin[][]) => {
  const output = trips
    .map((t) => {
      t
        .map((c) => {
          const dt = new Date(c.date * 1000).toLocaleString();
          return `${dt} | ${c.venue.name} (${c.venue.city}, ${c.venue.state}, ${c.venue.country})`;
        })
        .join("\n") + "\n-----";
    })
    .join("\n");

  // fs.writeFileSync("trips.txt", output);

  for (const trip of trips) {
    const checkins = { connect: trip.map((c) => ({ eqId: c.eqId })) };
    await db.trip.upsert({
      where: { start: trip[0].date },
      update: { checkins },
      create: { start: trip[0].date, checkins },
    });
  }
};

if (require.main === module) {
  run();
}
