// Get recent checkins from Swarm and write it to a file.

import clone from "clone";
import fs from "fs";
import path from "path";
import request from "request-promise-native";

// Lost your token? Here's how to get one:

// Make .env, get SWARM_CLIENT_ID and SWARM_CLIENT_SECRET from here:
// https://foursquare.com/developers/apps/LV4TILXRHDJJ5YZ1HJGA4GDLRSH3FCCOLIO33U2EGXAPZO5U/settings

// Go to this URL:
const authReq = `https://foursquare.com/oauth2/authenticate?client_id=${process.env.SWARM_CLIENT_ID}&response_type=code&redirect_uri=https%3A%2F%2Fendquote.com%2Fabout`;

// Pull the code from the redirect, save it to .env in SWARM_OAUTH_CODE.

// Then go to this URL:
const tokenReq = `https://foursquare.com/oauth2/access_token?client_id=${process.env.SWARM_CLIENT_ID}&client_secret=${process.env.SWARM_CLIENT_SECRET}&grant_type=authorization_code&redirect_uri=https%3A%2F%2Fendquote.com%2Fabout&code=${process.env.SWARM_OAUTH_CODE}`;

// Put the token in .env as SWARM_OAUTH_TOKEN.

// Filter by some criteria.
function filter(checkin) {
  return checkin.venue.location.state === "FL";
}

const auth = {
  client_id: process.env.SWARM_CLIENT_ID,
  client_secret: process.env.SWARM_CLIENT_SECRET,
  oauth_token: process.env.SWARM_OAUTH_TOKEN,
  v: "20180323",
};

// https://developer.foursquare.com/docs/api-reference/users/checkins/
const getCheckins = {
  url: "https://api.foursquare.com/v2/users/self/checkins",
  qs: Object.assign(clone(auth), {
    limit: 250,
    afterTimestamp: Math.round(new Date(2019, 11, 4).getTime() / 1000),
    beforeTimestamp: Math.round(new Date(2019, 11, 9).getTime() / 1000),
    sort: "newestfirst",
  }),
};

async function run() {
  const body = await request(getCheckins);
  const items = JSON.parse(body).response.checkins.items;
  const unique: any[] = [];
  const details: any[] = [];

  // Get the last page of checkins.
  items
    .filter(filter)
    .map((c) => {
      return {
        date: c.createdAt,
        id: c.venue.id,
        name: c.venue.name,
        location: [c.venue.location.lng, c.venue.location.lat],
      };
    })
    .sort((a, b) => a.date - b.date)
    .forEach((v) => {
      delete v.location.labeledLatLngs;
      delete v.location.formattedAddress;

      // Remove any duplicate venues.
      if (unique.findIndex((u: any) => u.id === v.id) === -1) {
        unique.push(v);

        // Set up a request for venue details.
        details.push(
          request({
            url: `https://api.foursquare.com/v2/venues/${v.id}`,
            qs: auth,
          })
        );
      }
    });

  // Get all the venue details.
  const venueDetails = await Promise.all(details);
  venueDetails.forEach((d) => {
    const venue = JSON.parse(d).response.venue;
    const checkin = unique.find((c: any) => c.id === venue.id) as any;
    const category = venue.categories.find((c) => c.primary == true);

    // Add some props to the checkin.
    checkin.description = venue.description;
    checkin.url = venue.url || `https://foursquare.com/v/${checkin.id}`;
    checkin.category = category.name.toLowerCase().replace(/\s/g, "_");
  });

  // Write to a temp file.
  const output = JSON.stringify(unique, null, 2);
  const outFile = path.join(__dirname, "checkins.json");
  fs.writeFileSync(outFile, output);
}

run();
