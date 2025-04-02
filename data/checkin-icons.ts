import fs from "fs";
import { createRequire } from "module";
import OpenAI from "openai";
import { db, saveString } from "./shared";

const API_KEY = process.env.OPENAI_KEY;
const MAX_RETRIES = 3;
const BATCH_SIZE = 50;

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

  const client = new OpenAI({ apiKey: API_KEY });

  let retryCounter = MAX_RETRIES;
  let batchNumber = 0;

  while (true) {
    // get all icons that need processing
    const venues = await db.venue.findMany({
      where: {
        llmIcon: null,
        OR: [{ category: { not: null } }, { icon: { not: null } }],
      },
    });

    // Group venues by icon first
    const uniqueIconsMap = new Map();
    for (const venue of venues) {
      if (!uniqueIconsMap.has(venue.icon)) {
        uniqueIconsMap.set(venue.icon, { placeType: venue.category, oldIcon: venue.icon });
      }
    }

    // convert map to array for shuffling
    const uniqueIcons = Array.from(uniqueIconsMap.values());
    console.log(`Found ${venues.length} venues with ${uniqueIcons.length} unique icons`);

    // if no venues left to process, we're done
    if (!uniqueIcons.length) {
      console.log("No venues to process, finishing");
      break;
    }

    // shuffle the array using Fisher-Yates algorithm
    for (let i = uniqueIcons.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [uniqueIcons[i], uniqueIcons[j]] = [uniqueIcons[j], uniqueIcons[i]];
    }

    // grab one batch
    const oldIcons = uniqueIcons.slice(0, BATCH_SIZE);

    batchNumber++;
    console.log(
      `Processing batch ${batchNumber}, processing ${oldIcons.length} icons from ${uniqueIcons.length} total unique icons`,
    );

    await processIconBatch(oldIcons, newIcons, client);

    // if there's less than a full batch left, we'll retry any failures
    if (oldIcons.length < BATCH_SIZE) {
      retryCounter--;
      console.log(`Found less than a full batch (${oldIcons.length}), retry count: ${retryCounter}`);

      if (retryCounter <= 0) {
        console.log("Max retry count reached, finishing");
        break;
      }
    }
  }
}

async function processIconBatch(
  oldIcons: { placeType: string; oldIcon: string }[],
  newIcons: Record<string, string[]>,
  client: OpenAI,
) {
  const success = new Map();

  try {
    // call the LLM
    const response = await client.responses.create({
      model: "o3-mini",
      // reasoning: { effort: "medium" },
      input: [
        {
          role: "developer",
          content: `
            You're helping to make a map with markers on it for points of interest. We need to pick an icon
            for each point of interest. Following is a list of new icons grouped by category.
            
            ${JSON.stringify(newIcons)}

            The user will provide a list of points of interest. Each includes a type (placeType) and a
            previously-chosen icon (oldIcon). For each item, select the most appropriate new icon from the
            provided categories list.

            REQUIREMENTS:
            1. Only suggest icons that exist in the provided categories list above
            2. Match each oldIcon with a new icon based on semantic similarity 
            3. Consider the placeType when making your selection
            4. Provide a brief reason for each selection (1-2 sentences)
            5. Include ALL items from the input list in your output

            IMPORTANT: Double-check that every suggested icon exists in the provided categories list.
          `,
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

    const { icons: replacements } = JSON.parse(response.output_text) as {
      icons: Array<{ oldIcon: string; newIcon: string; reason: string }>;
    };

    // validate output
    for (const replacement of replacements) {
      // it's not an empty string and it exists in the icons list
      const isValid = Object.values(newIcons).some(
        (category) => replacement.newIcon && category.includes(replacement.newIcon),
      );

      if (isValid) {
        success.set(replacement.oldIcon, replacement.newIcon);
      } else {
        console.warn(`Invalid icon suggested: ${replacement.newIcon} for ${replacement.oldIcon}, skipping`);
      }
    }
  } catch (e) {
    console.error(`API call failed: ${e.message}`);
    return;
  }

  // save new icons
  for (const oldIcon of oldIcons) {
    const newIcon = success.get(oldIcon.oldIcon);
    console.log(`Updating icon: ${oldIcon.oldIcon} → ${newIcon}`);

    await db.venue.updateMany({
      where: { icon: oldIcon.oldIcon },
      data: { llmIcon: newIcon },
    });
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
