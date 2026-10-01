// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@vueuse/nuxt',
    '@nuxt/ui',
  ],

  devtools: {
    enabled: false,
    timeline: { enabled: true },
  },

  css: ['~/assets/css/main.css'],

  compatibilityDate: '2026-09-20',

  nitro: {
    preset: 'cloudflare_module',

    storage: {
      files: { driver: 'cloudflare-r2-binding', binding: 'FILES' },
    },

    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },
  },

  vite: {
    server: {
      allowedHosts: ['free-loudly-dingo.ngrok-free.app'],
    },
  },

  typescript: {
    typeCheck: false,
    strict: true,
  },

  eslint: {
    checker: false,
    config: { stylistic: true },
  },
})
