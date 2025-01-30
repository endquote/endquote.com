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
    "@prisma/nuxt",
  ],
  content: {
    preview: {
      // https://content.nuxt.com/docs/studio/setup#troubleshooting
      api: "https://api.nuxt.studio",
      gitInfo: {
        name: "endquote.com",
        owner: "endquote",
        url: "https://github.com/endquote/endquote.com",
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
  css: ["~/assets/css/main.css"],
  devtools: { enabled: true, disableAuthorization: true },
  routeRules: {
    "/": { prerender: true },
    "/roles": { redirect: "/about" },
    "/stats/**": { proxy: "https://stats.endquote.com/**" },
    "/do/**": { proxy: "https://endquote.objects-us-east-1.dream.io/**" },
  },
  runtimeConfig: {
    apiSecret: "", // can be overridden by NUXT_API_SECRET environment variable
    public: {
      apiBase: "", // can be overridden by NUXT_PUBLIC_API_BASE environment variable
      hostname: "localhost",
    },
  },
  vite: {
    // https://www.prisma.io/docs/orm/more/help-and-troubleshooting/prisma-nuxt-module#resolving-typeerror-failed-to-resolve-module-specifier-prismaclientindex-browser
    resolve: {
      alias: {
        ".prisma/client/index-browser": "./node_modules/.prisma/client/index-browser.js",
      },
    },
  },
});
