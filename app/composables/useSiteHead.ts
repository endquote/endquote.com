import type { ContentCollectionItem } from "@nuxt/content";
import { useFavicon } from "@vueuse/core";

interface HeadProps {
  title?: string;
  description?: string;
  image?: string;
}

export default function (content?: ContentCollectionItem | undefined, props?: HeadProps) {
  const isDev = useDev();
  const img = useImage();

  if (isDev) {
    // TODO: remove this once nuxt/robots works
    // https://nuxtseo.com/docs/robots/guides/content#requirements
    useHead({ meta: [{ name: "robots", content: "noindex, nofollow, noarchive, nosnippet" }] });
  }

  if (!isDev) {
    // tracking
    const umami = "bf393154-3d37-487c-8e86-d011b69fa26a";
    useHead({ script: [{ src: "/stats/script.js", async: true, "data-website-id": umami }] });
  }

  if (!content) {
    return;
  }

  const title = props?.title || content.seo.title;
  const description = props?.description || content.seo.description;
  const image = img(props?.image || "images/collage-td.jpg", { format: "webp" });

  useHead({
    title: title,
    meta: [
      { name: "headline", content: title },
      { name: "description", content: description },
      { name: "image", content: image },
      { name: "author", content: "Josh Santangelo" },
      { name: "publisher", content: "endquote" },
    ],
    link: [{ rel: "alternate", type: "application/feed+json", title: "blog - json feed", href: "/feeds/blog.json" }],
  });

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

  useFavicon("/images/favicon.ico");
}
