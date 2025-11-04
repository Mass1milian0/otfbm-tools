// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@pinia/nuxt'],
  css: ['./public/styles/main.css'],
  pinia: {
    storesDirs: ['./stores']
  },
  app: {
    baseURL: process.env.NODE_ENV === "development" ? "/" : "/otfbm-tools/"
  }
})