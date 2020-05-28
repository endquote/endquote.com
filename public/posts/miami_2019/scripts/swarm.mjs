// Get recent checkins from Swarm and write it to a file.

import url from "url";
import path from "path";
import request from "request-promise-native";
import fs from "fs";
import clone from "clone";

const authReq = `https://foursquare.com/oauth2/authenticate?client_id=${process.env.SWARM_CLIENT_ID}&response_type=code&redirect_uri=https%3A%2F%2Fendquote.com%2Fabout`;
const tokenReq = `https://foursquare.com/oauth2/access_token?client_id=${process.env.SWARM_CLIENT_ID}&client_secret=${process.env.SWARM_CLIENT_SECRET}&grant_type=authorization_code&redirect_uri=https%3A%2F%2Fendquote.com%2Fabout&code=KHAWGKFP4ULO2AMNHAKMXZMUJSZBJFOKSKPOEIHU2OPPKTYS`;
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

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

const getCheckins = {
  url: "https://api.foursquare.com/v2/users/self/checkins",
  qs: Object.assign(clone(auth), {
    limit: 250,
    offset: 0,
    sort: "newestfirst",
  }),
};

async function run() {
  const body = await request(getCheckins);
  const items = JSON.parse(body).response.checkins.items;
  const unique = [];
  const details = [];

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
      if (unique.findIndex((u) => u.id === v.id) === -1) {
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
    const checkin = unique.find((c) => c.id === venue.id);
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
