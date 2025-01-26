import dotenv from "dotenv";
import { db, http, normalizeString } from "./shared";

dotenv.config();

const run = async () => {
  const venues = await db.venue.findMany({
    where: { icon: "fsq-lodging", hotelChecked: false },
    select: { name: true, eqId: true, lat: true, lng: true },
    distinct: ["fsId"],
  });

  for (const venue of venues) {
    const res = await http.post(
      "https://8nvhrd7onv-dsn.algolia.net/1/indexes/*/queries",
      {
        requests: [
          {
            indexName: "prod-hotels-en",
            query: venue.name,
            params: `aroundLatLng=${venue.lat}%2C${venue.lng}&aroundRadius=200`,
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
      data: { hotelChecked: true },
    });

    if (!hit) {
      continue;
    }

    await db.hotel.create({
      data: {
        michelinId: Number(hit.objectID),
        lat: hit._geoloc.lat,
        lng: hit._geoloc.lng,
        name: hit.name,
        city: hit.city.name,
        country: hit.country.name,
        award: hit.distinction.name,
        url: hit.michelin_guide_url,
        venue: { connect: { eqId: venue.eqId } },
      },
    });
  }
};

if (require.main === module) {
  run();
}
