import { main as airports } from "./airports";
import { main as homes } from "./homes";
import { db } from "./shared";

async function main() {
  await airports();
  await homes();
}

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
