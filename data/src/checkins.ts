import dotenv from "dotenv";
import { stdin as input, stdout as output } from "node:process";
import readline from "readline/promises";
import { db, http } from "./shared";

dotenv.config();

const run = async () => {
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
  let found = 0;
  const limit = 250;

  while (true) {
    const { data } = await http.get(`https://api.foursquare.com/v2/users/self/checkins`, {
      params: { oauth_token: token, v: 20231010, limit, offset },
    });

    const { items } = data.response.checkins;
    let done = items.length < limit;

    for (const item of items) {
      const fsVenue = {
        name: item.venue.name,
        address: item.venue.location.address,
        lat: item.venue.location.lat,
        lng: item.venue.location.lng,
        postalCode: item.venue.location.postalCode,
        cc: item.venue.location.cc,
        city: item.venue.location.city,
        state: item.venue.location.state,
        country: item.venue.location.country,
        category: item.venue.categories[0]?.name,
        icon: item.venue.categories[0]?.mapIcon,
      };

      const venue = await db.venue.upsert({
        where: { fsId: item.venue.id },
        update: { ...fsVenue },
        create: { fsId: item.venue.id, ...fsVenue },
      });

      try {
        await db.checkin.create({
          data: {
            fsId: item.id,
            date: item.createdAt,
            tz: item.timeZoneOffset,
            venue: { connect: { eqId: venue.eqId } },
          },
        });
        found++;
      } catch (e: any) {
        if (e.code === "P2002" && e.meta?.target?.includes("fsId")) {
          // console.log(`Checkin with fsId ${item.id} already exists.`);
          done = true;
          break;
        } else {
          throw e;
        }
      }

      offset++;
    }

    if (done) {
      break;
    }
  }
};

if (require.main === module) {
  run();
}
