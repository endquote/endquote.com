import fs from "fs";
import { defineEventHandler, readBody } from "h3";
import path from "path";
import useDev from "~/composables/useDev";

export default defineEventHandler(async (event) => {
  if (!useDev()) {
    return { error: "Method not allowed", statusCode: 405 };
  }

  let dateParam;

  if (event.method === "POST") {
    const body = await readBody(event);
    dateParam = body.date;
  } else if (event.method === "DELETE") {
    const query = getQuery(event);
    dateParam = query.date;
  } else {
    return { error: "Method not allowed", statusCode: 405 };
  }

  // Validate date format (yyyy-mm-dd)
  if (!dateParam || !/^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
    return { error: "Invalid date format. Required: yyyy-mm-dd", statusCode: 400 };
  }

  const filePath = path.join(process.cwd(), "content/trips", `${dateParam}.md`);

  if (event.method === "POST") {
    try {
      // Create placeholder content
      const content = `---
date: ${dateParam}
---

# Title

Your trip details here
`;
      // Write file
      fs.writeFileSync(filePath, content, "utf-8");
      return { success: true, message: `Trip file for ${dateParam} created`, statusCode: 201 };
    } catch (error) {
      return { error: `Failed to create file: ${(error as Error).message}`, statusCode: 500 };
    }
  } else if (event.method === "DELETE") {
    try {
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return { error: "File not found", statusCode: 404 };
      }

      // Delete file
      fs.unlinkSync(filePath);
      return { success: true, message: `Trip file for ${dateParam} deleted`, statusCode: 200 };
    } catch (error) {
      return { error: `Failed to delete file: ${(error as Error).message}`, statusCode: 500 };
    }
  }
});
