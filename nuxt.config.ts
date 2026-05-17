import { fileURLToPath } from "url";

export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: [
    "@nuxt/ui",
    "@nuxtjs/color-mode",
    "@pinia/nuxt",
    "@nuxt/eslint",
    "@nuxtjs/mcp-toolkit",
  ],
  css: [
    "@milkdown/crepe/theme/common/style.css",
    "@milkdown/crepe/theme/frame.css",
    "~/assets/css/main.css",
  ],

  colorMode: {
    preference: "system",
    fallback: "light",
  },
  app: {
    head: {
      title: "OpenDS - Design System Documentation",
      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Outfit:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap",
        },
      ],
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "OpenDS - Simple, self-hosted design system documentation tool",
        },
      ],
    },
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE || "/api",
    },
    // Server-only runtime config (private)
    dbUrl: process.env.DATABASE_URL || "postgresql://localhost/opends_dev",
    jwtSecret: process.env.JWT_SECRET,
    jwtAccessExpire: process.env.JWT_ACCESS_EXPIRE || "15m",
    jwtRefreshExpire: process.env.JWT_REFRESH_EXPIRE || "7d",
    allowRegistration: process.env.ALLOW_REGISTRATION === "true",
  },
  routeRules: {
    "/": { ssr: false },
    "/docs/**": { isr: 3600 },
    "/components/**": { isr: 3600 },
    "/tokens/**": { isr: 3600 },
    "/admin/**": { ssr: true },
  },
  vite: {
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "@design-system": fileURLToPath(
          new URL("./src/design-system", import.meta.url),
        ),
        "@api": fileURLToPath(new URL("./src/api", import.meta.url)),
      },
    },
  },
  nitro: {
    experimental: {
      openAPI: true,
      asyncContext: true,
    },
    // Externalize native modules - don't bundle them
    externals: {
      external: ["better-sqlite3"],
    },
    alias: {
      "pg-native": fileURLToPath(
        new URL("./server/utils/mock-pg-native.ts", import.meta.url),
      ),
    },
  },
  mcp: {
    name: "OpenDS Design System",
    version: "0.2.0",
    route: "/mcp",
    dir: "mcp",
  },
});
