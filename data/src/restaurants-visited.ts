import { db, getMichelinToken, http } from "./shared";

const run = async () => {
  const token = await getMichelinToken();
  const visited = await getVisited(token);
  await setVisited(token, visited);
};

const getVisited = async (token: string): Promise<number[]> => {
  const { data } = await http.get("https://api.prod.r53.tablethotels.com/account/v1/entities/", {
    headers: {
      authorization: `JWT ${token}`,
      Referer: "https://guide.michelin.com/",
    },
  });

  return data.results.entity_relations.map((r: any) => Number(r.entity_identifier));
};

const setVisited = async (token: string, visited: number[]): Promise<void> => {
  const restaurants = await db.restaurant.findMany({ select: { michelinId: true } });

  for (const restaurant of restaurants) {
    if (visited.includes(restaurant.michelinId)) {
      continue;
    }

    await http.post(
      "https://api.prod.r53.tablethotels.com/account/v1/entity-relations/",
      {
        entity_identifier: restaurant.michelinId,
        entity_type: "2", // 2 is restaurant, 1 is hotel
        entity_relation_type: "1",
      },
      { headers: { authorization: `JWT ${token}`, Referer: "https://guide.michelin.com/" } },
    );
  }
};

if (require.main === module) {
  run();
}
