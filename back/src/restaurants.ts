import dotenv from "dotenv";
import { db, http, normalizeString } from "./shared";

dotenv.config();

const run = async () => {
  const venues = await db.venue.findMany({
    where: { icon: { not: "fsq-lodging" }, restaurantChecked: false },
    select: { name: true, eqId: true, lat: true, lng: true },
    distinct: ["fsId"],
  });

  for (const venue of venues) {
    // hit the michelin API, include only the location
    const query = ""; // encodeURIComponent(venue.name);
    const res = await http.post(
      "https://8nvhrd7onv-dsn.algolia.net/1/indexes/*/queries",
      {
        requests: [
          {
            indexName: "prod-restaurants-en",
            params: `aroundLatLng=${venue.lat}%2C${venue.lng}&aroundRadius=200&query=${query}`,
          },
        ],
      },
      {
        params: { "x-algolia-api-key": "3222e669cf890dc73fa5f38241117ba5", "x-algolia-application-id": "8NVHRD7ONV" },
        headers: { referer: "https://guide.michelin.com/" },
      },
    );

    // from the hits that come back for the location, try to match the name
    const hits = res.data.results[0]?.hits || [];
    const normalName = normalizeString(venue.name);
    const hit = hits.find((h: any) => {
      const hitName = normalizeString(h.name);
      return normalName && (normalName.includes(hitName) || hitName.includes(normalName));
    });

    console.log(
      venues.indexOf(venue) + 1,
      venues.length,
      hit ? "✅" : "❎",
      `${venue.name} / ${normalName}`,
      hit ? `${hit.name} / ${normalizeString(hit.name)}` : "",
    );

    await db.venue.update({
      where: { eqId: venue.eqId },
      data: { restaurantChecked: true },
    });

    if (!hit) {
      continue;
    }

    await db.restaurant.create({
      data: {
        michelinId: Number(hit.identifier),
        lat: hit._geoloc.lat,
        lng: hit._geoloc.lng,
        name: hit.name,
        city: hit.city.name,
        country: hit.country.name,
        street: hit.street,
        award: hit.michelin_award,
        url: "https://guide.michelin.com" + hit.url,
        website: hit.website,
        venue: { connect: { eqId: venue.eqId } },
      },
    });
  }
};

if (require.main === module) {
  run();
}
