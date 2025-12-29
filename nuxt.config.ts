export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    '@primevue/nuxt-module',
    '@nuxtjs/tailwindcss',
    '@nuxt/eslint'
  ],
  css: [],
  primevue: {
    usePrimeVue: true,
    options: {
      theme: 'aura',
      cssLayerOrder: 'tailwind-base, tailwind-utilities, primevue'
    }
  },
  app: {
    head: {
      title: 'OpenDS - Design System Documentation',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'OpenDS - Simple, self-hosted design system documentation tool' }
      ]
    }
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE || '/api',
    },
    // Server-only runtime config (private)
    dbUrl: process.env.DATABASE_URL || 'postgresql://localhost/opends_dev',
    jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
    jwtAccessExpire: process.env.JWT_ACCESS_EXPIRE || '15m',
    jwtRefreshExpire: process.env.JWT_REFRESH_EXPIRE || '7d',
    allowRegistration: process.env.ALLOW_REGISTRATION === 'true',
  },
  routeRules: {
    '/': { prerender: true },
    '/docs/**': { isr: 3600 },
    '/components/**': { isr: 3600 },
    '/tokens/**': { isr: 3600 },
    '/admin/**': { ssr: true }
  },
  vite: {
    resolve: {
      alias: {
        '@': './src',
        '@design-system': './src/design-system',
        '@api': './src/api'
      }
    }
  },
  nitro: {
    experimental: {
      openAPI: {
        enabled: true
      }
    },
    // Externalize native modules - don't bundle them
    externals: {
      external: ['better-sqlite3']
    }
  }
})
