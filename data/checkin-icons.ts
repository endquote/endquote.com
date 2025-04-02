import fs from "fs";
import { createRequire } from "module";
import OpenAI from "openai";
import { db, saveString } from "./shared";

export async function main() {
  // get the possible checkin icons
  const iconMetaPath = createRequire(import.meta.url).resolve("@iconify-json/fluent-emoji-high-contrast/metadata.json");
  const iconMetaText = fs.readFileSync(iconMetaPath, "utf-8");
  const iconMetaData = JSON.parse(iconMetaText);
  const categories = ["Activities", "Animals & Nature", "Food & Drink", "Objects", "Travel & Places"];
  const newIcons: Record<string, string[]> = {};
  for (const category of categories) {
    newIcons[category] = iconMetaData.categories[category];
  }

  // save for debugging
  await saveString(JSON.stringify(newIcons), "icons.json");

  // get the icons that need to be replaced
  const venues = await db.venue.findMany({
    where: {
      llmIcon: null,
      OR: [{ category: { not: null } }, { icon: { not: null } }],
    },
    // take: 10,
  });
  const oldIcons = Array.from(
    new Map(venues.map((v) => [v.icon, { placeType: v.category, oldIcon: v.icon }])).values(),
  );

  const apiKey = process.env.OPENAI_KEY;
  const client = new OpenAI({ apiKey });
  try {
    // call the LLM
    const response = await client.responses.create({
      model: "o3-mini",
      reasoning: { effort: "medium" },
      input: [
        {
          role: "developer",
          content: `
          You're helping to make a map with markers on it for points of interest. We need to pick an icon
          for each point of interest. Following is a list of new icons grouped by category.
          
          ${JSON.stringify(newIcons)}

          The user will provide a list of points of interest. Each includes a type and a previously-chosen
          icon called oldIcon. Use that to suggest a new icon from the previous list provided.

          It's very important to not suggest any icons that do not exist in the previous list.

          It's very important to find a new icon for each old icon, even if the match isn't perfect. Look
          for the closest conceptual match.
          
          Also include a brief reason for your choice.
          
          Each item in the user's list should be included in the output, don't skip any.
          
          If you really can't find a good replacement icon return an empty string, but this should almost
          never happen.`,
        },
        { role: "user", content: JSON.stringify(oldIcons) },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "poi_icons",
          schema: {
            type: "object",
            properties: {
              icons: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    oldIcon: { type: "string", description: "The user-provided old icon" },
                    newIcon: { type: "string", description: "Your selection from the provided list of new icons" },
                    reason: { type: "string", description: "Reason for the choice" },
                  },
                  required: ["oldIcon", "newIcon", "reason"],
                  additionalProperties: false,
                },
              },
            },
            required: ["icons"],
            additionalProperties: false,
          },
        },
      },
    });

    // parse the response
    const { icons: replacements } = JSON.parse(response.output_text) as {
      icons: Array<{ oldIcon: string; newIcon: string; reason: string }>;
    };

    // create a mapping for quick lookup
    const iconMapping = new Map(replacements.map((icon) => [icon.oldIcon, icon.newIcon]));

    // process the replacements
    for (const oldIcon of oldIcons) {
      const newIcon = iconMapping.get(oldIcon.oldIcon);

      if (!newIcon) {
        console.warn("no new icon for", oldIcon.oldIcon);
        continue;
      }

      if (!Object.values(newIcons).some((iconsArray) => iconsArray.includes(newIcon))) {
        console.warn("new icon not in list", oldIcon.oldIcon, newIcon);
        continue;
      }

      console.info("icon replacement", oldIcon.oldIcon, newIcon);

      await db.venue.updateMany({
        where: { icon: oldIcon.oldIcon },
        data: { llmIcon: newIcon },
      });
    }
  } catch (e) {
    console.error(e);
  }
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
