// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2025-07-15',

  css: ['~/assets/css/main.css'],

  nitro: {
    preset: 'static'
  },


  app: {
    baseURL: './',
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' }
      ]
    }
  },


  runtimeConfig: {
    public: {
      APP_NAME: process.env.APP_NAME,
      APP_ENV: process.env.APP_ENV,
      WEBAPI_URL: process.env.WEBAPI_URL,
      APPAPI_URL: process.env.APPAPI_URL
    }
  },


  devtools: { enabled: true }
})
