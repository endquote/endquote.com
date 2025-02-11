import { Feed } from "feed";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import useDev from "~/composables/useDev";

const collections = ["blog"] as const;
type ValidCollections = (typeof collections)[number];
const formats = ["json", "rss", "atom"] as const;
type ValidFormats = (typeof formats)[number];

export default defineEventHandler(async (event) => {
  const collection = event.context.params?.collection as ValidCollections;
  const format = event.context.params?.format as ValidFormats;
  if (!collection || !format || !collections.includes(collection) || !formats.includes(format)) {
    setResponseStatus(event, 404);
    return;
  }

  const now = new Date().toISOString();
  const hostname = useRuntimeConfig(event).public.hostname;
  const base = hostname === "localhost" ? "http://localhost:3000" : `https://${hostname}`;

  // get the date of the most recent post
  const lastDate = await queryCollection(event, collection)
    .select("date")
    .where("robots", "=", true)
    .where("date", "<", now)
    .order("date", "DESC")
    .first();

  // get posts going three months back
  const firstDate = new Date(lastDate.date);
  firstDate.setUTCMonth(firstDate.getUTCMonth() - 3);
  let posts = await queryCollection(event, collection)
    .where("robots", "=", true)
    .where("date", "<", now)
    .where("date", ">", firstDate.toISOString())
    .order("date", "DESC")
    .all();

  if (useDev()) {
    // get all posts
    posts = await queryCollection(event, collection).order("date", "DESC").all();
  }

  const feed = new Feed({
    title: `endquote.com/${collection}`,
    id: `${base}/${collection}`,
    link: `${base}/${collection}`,
    image: `${base}/images/favicon/favicon-32x32.png`,
    favicon: `${base}/images/favicon/favicon.ico`,
    copyright: `All rights reserved ${new Date().getUTCFullYear()}, Josh Santangelo`,
    updated: new Date(lastDate.date),
    author: { name: "Josh Santangelo", email: "josh@endquote.com", link: base },
  });

  // render markdown to html (why doesn't nuxt-content have this?)
  const html: Record<string, string> = {};
  for (const post of posts) {
    // unescape newlines
    let clean = post.rawbody.replace(/\\n/g, "\n");
    // remove frontmatter
    clean = clean.replace(/---\n[\s\S]*?\n---\n/, "");
    // remove title in h1
    clean = clean.replace(new RegExp(`\n# ${post.title}\n`), "");
    // replace markdown links that start with / to be relative to the base
    clean = clean.replace(/\]\((\/[^)]+)\)/g, `](${base}$1)`);
    // tODO: handle internal links/images

    const file = await unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeSanitize)
      .use(rehypeStringify)
      .process(clean);

    html[post.id] = String(file);
  }

  // build feed
  posts.forEach(async (post) => {
    feed.addItem({
      date: new Date(post.date),
      title: post.title,
      id: post.id,
      link: `${base}${post.path}`,
      description: post.seo.description,
      content: html[post.id],
    });
  });

  if (format === "json") {
    setHeaders(event, { "Content-Type": "application/feed+json" });
    return feed.json1();
  } else if (format === "rss") {
    setHeaders(event, { "Content-Type": "application/rss+xml" });
    return feed.rss2();
  } else if (format === "atom") {
    setHeaders(event, { "Content-Type": "application/atom+xml" });
    return feed.atom1();
  }
});
