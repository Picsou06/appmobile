// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2025-07-15',

  routeRules: {
    '/api/**': { proxy: `${process.env.WEBAPI_URL || 'http://localhost:8000'}/api/**` },
    '/storage/**': { proxy: `${process.env.WEBAPI_URL || 'http://localhost:8000'}/storage/**` }
  },

  modules: ['@nuxtjs/tailwindcss'],

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
  },

  css: ['~/assets/css/main.css'],

  nitro: {
    preset: 'static'
  },


  app: {
    baseURL: './',
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Karla:wght@300;400;500;600&family=Fira+Code:wght@300;400;500&display=swap' }
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
