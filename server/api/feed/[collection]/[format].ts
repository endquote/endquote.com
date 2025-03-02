import { Feed } from "feed";
import type { Parent, Root, Text } from "mdast";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import remarkFrontmatter from "remark-frontmatter";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkSmartypants from "remark-smartypants";
import { unified } from "unified";
import { EXIT, visit } from "unist-util-visit";
import useDev from "~/composables/useDev";

const feedCollections = ["blog"] as const;
type FeedCollections = (typeof feedCollections)[number];
const feedFormats = ["json", "rss", "atom"] as const;
type FeedFormats = (typeof feedFormats)[number];

export default cachedEventHandler(
  async (event) => {
    const collection = event.context.params?.collection as FeedCollections;
    const format = event.context.params?.format as FeedFormats;

    // make sure this is a collection we support feeds for
    if (!collection || !format || !feedCollections.includes(collection) || !feedFormats.includes(format)) {
      setResponseStatus(event, 404);
      return;
    }

    const now = new Date().toISOString();
    const hostname = useRuntimeConfig(event).public.hostname;

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

    const base = hostname === "localhost" ? "http://localhost:3000" : `https://${hostname}`;

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

    // render markdown to html
    const html: Record<string, string> = {};

    for (const post of posts) {
      // unescape newlines
      const preprocess = post.rawbody.replace(/\\n/g, "\n");

      const file = await unified()
        // parse markdown
        .use(remarkParse)

        // parse frontmatter
        .use(remarkFrontmatter, ["yaml"])

        // custom parsing
        .use(() => (tree: Root) => {
          // remove frontmatter
          visit(tree, "yaml", (node, index, parent) => {
            (parent as Parent).children.splice(index!, 1);
            return EXIT;
          });

          // remove h1 matching post title
          visit(tree, "heading", (node, index, parent) => {
            if (
              node.depth === 1 &&
              node.children.length === 1 &&
              (node.children[0] as Text).type === "text" &&
              (node.children[0] as Text).value === post.title
            ) {
              (parent as Parent).children.splice(index!, 1);
              return EXIT;
            }
          });

          // convert relative links to absolute
          visit(tree, "link", (node) => {
            if (node.url.startsWith("http")) return;
            node.url = node.url.replace(/\.md$/, "");
            const url = new URL(node.url, `${base}${post.path}`).toString();
            node.url = url;
          });

          // convert relative images to absolute
          visit(tree, "image", (node) => {
            if (node.url.startsWith("http")) return;
            const url = new URL(node.url, `${base}${post.path}`).toString();
            node.url = url;
          });
        })

        // make nice typography
        .use(remarkSmartypants)

        // convert markdown AST to HTML AST
        .use(remarkRehype)

        // sanitize HTML
        .use(rehypeSanitize)

        // convert HTML AST to HTML string
        .use(rehypeStringify)
        .process(preprocess);

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
      setHeaders(event, { "Content-Type": "application/feed+json; charset=utf-8" });
      return feed.json1();
    } else if (format === "rss") {
      setHeaders(event, { "Content-Type": "application/rss+xml; charset=utf-8" });
      return feed.rss2();
    } else if (format === "atom") {
      setHeaders(event, { "Content-Type": "application/atom+xml; charset=utf-8" });
      return feed.atom1();
    }
  },
  {
    // https://nitro.build/guide/cache#options
    swr: false,
    maxAge: 24 * 60 * 60,

    // return a cache key that's similar to the default
    getKey: (event) => {
      const collection = event.context.params?.collection as FeedCollections;
      const format = event.context.params?.format as FeedFormats;
      return `apifeed${collection}${format}`;
    },

    // don't render the feed again if there hasn't been a new post
    shouldInvalidateCache: async (event) => {
      if (useDev()) return true;

      const base = "cache";
      const name = "_";
      const group = "nitro:handlers";
      const collection = event.context.params?.collection as FeedCollections;
      const format = event.context.params?.format as FeedFormats;
      const handler = `apifeed${collection}${format}`;
      const key = `${base}:${group}:${name}:${handler}.json`;
      const val = await useStorage().getItem(key);

      if (!val) {
        return true;
      }

      const now = new Date().toISOString();
      const lastDate = await queryCollection(event, collection)
        .select("date")
        .where("robots", "=", true)
        .where("date", "<", now)
        .order("date", "DESC")
        .first();

      // @ts-expect-error mtime is not in the type
      const mtime = val.mtime;
      const cached = new Date(mtime).toISOString();
      return lastDate.date > cached;
    },
  },
);
