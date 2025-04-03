import type { Prisma } from "@prisma/client";
import dotenv from "dotenv";
import { stdin as input, stdout as output } from "node:process";
import readline from "readline/promises";
import { db, http } from "./shared";

dotenv.config();

const main = async () => {
  const token = await getToken();
  await getCheckins(token);
};

const getToken = async () => {
  const token = process.env.FS_ACCESS_TOKEN;
  if (token) {
    return token;
  }

  const clientId = process.env.FS_CLIENT_ID;
  const secret = process.env.FS_CLIENT_SECRET;
  const redirect = encodeURIComponent(process.env.FS_REDIRECT_URI);

  let url = `https://foursquare.com/oauth2/authenticate?client_id=${clientId}&response_type=code&redirect_uri=${redirect}`;
  console.log(`Open this URL in your browser: ${url}`);

  const code = await readline.createInterface({ input, output }).question("Enter code: ");

  url = `https://foursquare.com/oauth2/access_token?client_id=${clientId}&client_secret=${secret}&grant_type=authorization_code&redirect_uri=${redirect}&code=${code}`;
  const { data } = await http.get(url);
  console.log(data);

  process.exit(1);
};

const getCheckins = async (token: string): Promise<void> => {
  let offset = 0;
  const limit = 250;

  while (true) {
    // https://docs.foursquare.com/developer/reference/get-user-checkins
    const { data } = await http.get(`https://api.foursquare.com/v2/users/self/checkins`, {
      params: { oauth_token: token, v: 20231010, limit, offset },
    });

    const { items } = data.response.checkins;
    let done = items.length < limit;

    for (const item of items) {
      const isAirport = item.venue.categories.some((c: any) => c.name.includes("Airport"));
      let airportCode = isAirport ? item.venue.name.match(/\(([A-Z]{3})\)/)?.[1] : undefined;

      // cheating on one because i checked in to the terminal, not the airport
      if (isAirport && item.venue.name.includes("Ninoy") && !airportCode) {
        airportCode = "MNL";
      }

      const loc = item.venue.location;
      const cat = item.venue.categories[0];

      const fsIcon = cat?.icon.prefix.match(/(\w+\/\w+)_$/)?.[1];
      const fsVenue: Prisma.venueCreateInput = {
        fsId: item.venue.id,
        name: item.venue.name,
        address: loc.address,
        lat: loc.lat,
        lng: loc.lng,
        postalCode: loc.postalCode,
        cc: loc.cc,
        city: loc.city,
        state: loc.state,
        country: loc.country,
        category: cat?.name,
        airport: airportCode ? airportCode : undefined,
        venueIcon: fsIcon
          ? {
              connectOrCreate: {
                where: { fsIcon },
                create: { fsIcon },
              },
            }
          : undefined,
      };

      const venue = await db.venue.upsert({
        where: { fsId: fsVenue.fsId },
        update: { ...fsVenue },
        create: { ...fsVenue },
      });

      if (await db.checkin.findFirst({ where: { fsId: item.id } })) {
        done = true;
        break;
      }

      const checkin: Prisma.checkinCreateInput = {
        fsId: item.id,
        date: new Date(item.createdAt * 1000),
        tz: item.timeZoneOffset,
        venue: { connect: { fsId: venue.fsId } },
      };
      await db.checkin.upsert({
        where: { fsId: checkin.fsId },
        update: { ...checkin },
        create: { ...checkin },
      });
    }

    if (done) {
      break;
    }

    offset += items.length;
  }
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
