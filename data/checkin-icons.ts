import type { Prisma } from "@prisma/client";
import emojiRegex from "emoji-regex";
import OpenAI from "openai";
import { db } from "./shared";

const API_KEY = process.env.OPENAI_KEY;
const MAX_RETRIES = 3;
const BATCH_SIZE = 50;

export async function main() {
  const client = new OpenAI({ apiKey: API_KEY });

  let retryCounter = MAX_RETRIES;
  let batchNumber = 0;

  while (true) {
    // get venues with category and null eqIcon in their venueIcon relation
    const venues = await db.venue.findMany({
      where: {
        fsIcon: { not: null },
        category: { not: null },
        venueIcon: { eqIcon: null },
      },
      select: { category: true, fsIcon: true, venueIcon: true },
    });

    // group venues by fsIcon
    const uniqueIconsMap: Map<string, { placeType: string; oldIcon: string }> = new Map();
    for (const venue of venues) {
      if (!uniqueIconsMap.has(venue.fsIcon)) {
        uniqueIconsMap.set(venue.fsIcon, { placeType: venue.category, oldIcon: venue.fsIcon });
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

    // grab one batch
    const oldIcons = uniqueIcons.slice(0, BATCH_SIZE);

    batchNumber++;
    console.log(`Processing batch ${batchNumber}, ${oldIcons.length} icons`);

    await processIconBatch(oldIcons, client);

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

async function processIconBatch(oldIcons: { placeType: string; oldIcon: string }[], client: OpenAI) {
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
            You're helping to make a map with markers on it for points of interest. We need to select a suitable emoji
            for each point of interest to use as a map marker.
            
            The user will provide a list of points of interest. Each includes a type (placeType) and a
            previously-chosen icon (oldIcon). For each item, select the most appropriate emoji character.

            REQUIREMENTS:
            1. Return a single Unicode emoji character for each item (not an emoji sequence)
            2. Choose an emoji that represents the place type semantically
            3. Provide a brief reason for each selection (1-2 sentences)
            4. Include ALL items from the input list in your output

            IMPORTANT: Only return single Unicode emoji characters that will display well at small sizes on a map.
          `,
        },
        { role: "user", content: JSON.stringify(oldIcons) },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "poi_emojis",
          schema: {
            type: "object",
            properties: {
              icons: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    oldIcon: { type: "string", description: "The user-provided old icon" },
                    newIcon: { type: "string", description: "A suitable Unicode emoji character" },
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

    for (const r of replacements) {
      const regex = emojiRegex();
      const matches = [...r.newIcon.matchAll(regex)];
      const isEmoji = r.newIcon && matches.length === 1 && matches[0][0] === r.newIcon;

      if (isEmoji) {
        success.set(r.oldIcon, r.newIcon);
      } else {
        console.warn(`invalid emoji suggested: ${r.newIcon} for ${r.oldIcon}, skipping`);
      }
    }
  } catch (e) {
    console.error(`API call failed: ${e.message}`);
    return;
  }

  // save new icons
  for (const oldIcon of oldIcons) {
    const newIcon = success.get(oldIcon.oldIcon);

    if (!newIcon) continue;

    // find all venues with this icon
    const venues = await db.venue.findMany({
      where: { fsIcon: oldIcon.oldIcon },
      select: { fsId: true },
    });

    // create venueIcon and link venues in one go
    const venueIcon: Prisma.venueIconCreateInput = {
      fsIcon: oldIcon.oldIcon,
      eqIcon: newIcon,
      venues: { connect: venues.map((v) => ({ fsId: v.fsId })) },
    };
    await db.venueIcon.upsert({
      where: { fsIcon: oldIcon.oldIcon },
      create: venueIcon,
      update: venueIcon,
    });

    console.log(`updated ${venues.length} venues with icon: ${oldIcon.oldIcon} → ${newIcon}`);
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
