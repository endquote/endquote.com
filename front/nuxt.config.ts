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
    "@nuxt/content",
    "@nuxtjs/sitemap",
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
  css: ["~/assets/css/main.css"],
  devtools: { enabled: true, disableAuthorization: true },
  routeRules: {
    "/": { prerender: true },
    "/roles": { redirect: "/about" },
    "/stats/**": { proxy: "https://stats.endquote.com/**" },
    "/do/**": { proxy: "https://endquote.objects-us-east-1.dream.io/**" },
  },
  runtimeConfig: {
    public: {
      hostname: "localhost",
    },
  },
});
