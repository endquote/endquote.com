import { main as homes } from "./homes";
import { db } from "./shared";

async function main() {
  await homes();
}

if (require.main === module) {
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
