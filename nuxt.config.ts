// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-01-01",
  future: {
    compatibilityVersion: 4,
  },
  modules: [
    "@nuxt/ui",
    "@nuxt/image",
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxtjs/robots",
    "@nuxtjs/sitemap",
    "@nuxt/content",
    "nuxt-llms",
    "@prisma/nuxt",
    "nuxt-maplibre",
  ],
  build: {
    // https://trpc-nuxt.vercel.app/get-started/installation
    transpile: ["trpc-nuxt"],
  },
  content: {
    // https://content.nuxt.com/docs/studio/setup#troubleshooting
    preview: {
      api: "https://api.nuxt.studio",
      gitInfo: {
        name: "endquote.com",
        owner: "endquote",
        url: "https://github.com/endquote/endquote.com",
      },
    },
    build: {
      markdown: {
        // https://content.nuxt.com/docs/getting-started/configuration#remarkplugins
        remarkPlugins: {
          "remark-smartypants": {},
          "remark-link-rewrite": {
            options: {
              replacer: (url: string) => {
                if (url.startsWith("/source")) {
                  return url.replace("/source", "https://github.com/endquote/endquote.com/blob");
                }
                return url;
              },
            },
          },
        },
      },
    },
  },
  ui: {
    // https://ui.nuxt.com/getting-started/installation#options
  },
  image: {
    // https://image.nuxt.com/get-started/configuration
    domains: ["endquote.objects-us-east-1.dream.io"],
    alias: { do: "https://endquote.objects-us-east-1.dream.io" },
  },
  fonts: {
    // https://fonts.nuxt.com/get-started/configuration
    defaults: { weights: [400, 600, 700] },
  },
  site: {
    // https://nuxtseo.com/docs/sitemap/
    url: "https://endquote.com",
    name: "Josh Santangelo",
  },
  prisma: {
    // https://www.prisma.io/docs/orm/more/help-and-troubleshooting/prisma-nuxt-module#configuration
    runMigration: false,
  },
  llms: {
    // https://content.nuxt.com/docs/advanced/llms#llms-integration
    domain: "https://endquote.com",
    title: "endquote",
    description: "Josh Santangelo's personal site",
    full: { title: "endquote", description: "Josh Santangelo's personal site" },
  },
  css: ["~/assets/css/main.css"],
  devtools: { enabled: true, disableAuthorization: true },
  routeRules: {
    "/": { prerender: true },
    "/roles": { redirect: "/about" },
    "/stats/**": { proxy: "https://stats.endquote.com/**" },

    // proxy files in dreamobjects
    "/do/**": { proxy: "https://endquote.objects-us-east-1.dream.io/**" },

    // proxy maplibre tiles - see also server/api/mapstyle/[...style].ts
    "/maps/**": { proxy: "https://tiles.stadiamaps.com/**" },

    // sort of hide WIP features
    "/trips/**": { robots: false },
  },
  runtimeConfig: {
    // https://nuxt.com/docs/guide/going-further/runtime-config#environment-variables
    public: {
      hostname: "localhost",
    },
    openaiKey: "",
    s3: {
      region: "",
      bucket: "",
      token: "",
      secret: "",
      endpoint: "",
    },
  },
  nitro: {
    experimental: {
      // https://nitro.build/guide/utils#async-context-experimental
      asyncContext: true,
    },
  },
  vite: {
    resolve: {
      alias: {
        // https://www.prisma.io/docs/orm/more/help-and-troubleshooting/prisma-nuxt-module#resolving-typeerror-failed-to-resolve-module-specifier-prismaclientindex-browser
        ".prisma/client/index-browser": "./node_modules/.prisma/client/index-browser.js",
      },
    },
  },
});
