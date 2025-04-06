// because i really don't want any requests to domains other than my own, i'm proxying
// all the maplibry styles and assets through this api

export default defineEventHandler(async (event) => {
  // get style param from url
  const style = getRouterParam(event, "style");
  if (!style) {
    throw createError({ statusCode: 400, message: "Missing style parameter" });
  }

  const tilesDomain = "https://tiles.stadiamaps.com";

  try {
    // fetch original style json as text
    const response = await fetch(`${tilesDomain}/${style}`);

    if (!response.ok) {
      throw createError({ statusCode: response.status, message: `Failed to fetch style: ${response.statusText}` });
    }

    // get text content
    const styleText = await response.text();

    // get host info for replacement
    const host = getRequestHost(event);
    const protocol = getRequestProtocol(event);

    // replace any json urls to point back to this api
    const jsonUrl = `${protocol}://${host}/api/mapstyle/`;
    let modifiedStyle = styleText.replace(new RegExp(`${tilesDomain}/([^"]*\\.json)`, "g"), `${jsonUrl}$1`);

    // replace any asset urls to point to the tile proxy, see nuxt.config.ts
    const tileUrl = `${protocol}://${host}/maps/`;
    modifiedStyle = modifiedStyle.replace(new RegExp(`${tilesDomain}/([^"]*[^.json"])`, "g"), `${tileUrl}$1`);

    // set content type to json
    setResponseHeader(event, "Content-Type", "application/json");

    return modifiedStyle;
  } catch {
    throw createError({ statusCode: 500, message: "Failed to proxy style" });
  }
});
