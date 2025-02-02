import { db, getMichelinToken, http } from "./shared";

const main = async () => {
  const token = await getMichelinToken();
  const visited = await getFavorites();
  await setFavorites(token, visited);
};

const getFavorites = async (): Promise<number[]> => {
  // not sure where this urserid comes from
  const { data } = await http.get("https://api.prod.r53.tablethotels.com/list/v1/hotel-list/?user_id=491305");
  return data[0].hotels.map((h: any) => h.property_id as number);
};

const setFavorites = async (token: string, visited: number[]): Promise<void> => {
  const hotels = await db.hotel.findMany({ select: { michelinId: true } });

  for (const hotel of hotels) {
    if (visited.includes(hotel.michelinId)) {
      continue;
    }

    await http.post(
      // not sure where this list number comes from
      "https://api.prod.r53.tablethotels.com/list/v1/hotel-list/491302/",
      [{ property_id: hotel.michelinId }],
      { headers: { authorization: `JWT ${token}`, Referer: "https://guide.michelin.com/" } },
    );
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
