import type { ContentCollectionItem } from "@nuxt/content";

interface HeadProps {
  title?: string;
  description?: string;
  image?: string;
}

export default function (content?: ContentCollectionItem | undefined, props?: HeadProps) {
  // tracking
  if (!useDev()) {
    const umami = "bf393154-3d37-487c-8e86-d011b69fa26a";
    useHead({ script: [{ src: "/stats/script.js", async: true, "data-website-id": umami }] });
  }

  // icons
  useHead({
    link: [
      { rel: "icon", type: "image/ico", href: "/images/favicon/favicon.ico" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/images/favicon/favicon-32x32.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/images/favicon/favicon-16x16.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/images/favicon/apple-touch-icon.png" },
      { rel: "manifest", href: "/images/favicon/site.webmanifest" },
      { rel: "mask-icon", href: "/images/favicon/safari-pinned-tab.svg", color: "#000000" },
    ],
  });

  // feeds
  useHead({
    link: ["blog"]
      .map((col) => [
        { rel: "alternate", type: "application/feed+json", title: `${col}/json`, href: `/api/feed/${col}/json` },
        { rel: "alternate", type: "application/rss+xml", title: `${col}/rss`, href: `/api/feed/${col}/rss` },
        { rel: "alternate", type: "application/atom+xml", title: `${col}/atom`, href: `/api/feed/${col}/atom` },
      ])
      .flat(),
  });

  if (!content) {
    return;
  }

  const title = props?.title || content.seo.title;
  const description = props?.description || content.seo.description;
  const image = useImage()(props?.image || "images/collage-td.jpg", { format: "webp" });

  // content
  useHead({
    title: title,
    meta: [
      { name: "headline", content: title },
      { name: "description", content: description },
      { name: "image", content: image },
      { name: "author", content: "Josh Santangelo" },
      { name: "publisher", content: "endquote" },
    ],
  });

  // seo/social
  useSeoMeta({
    ogLocale: "en_US",
    ogSiteName: "Josh Santangelo",
    title: title,
    ogType: "article",
    description: description,
    ogImageUrl: image,
    ogImageSecureUrl: image,
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: image,
    twitterImageAlt: description,
    twitterSite: "@endquote",
    twitterCreator: "@endquote",
    ...content.seo,
  });
}
