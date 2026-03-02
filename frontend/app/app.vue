<script setup>
const { token, fetchUser } = useAuth()
const { public: { APP_ENV, WEBAPI_URL, APPAPI_URL } } = useRuntimeConfig()

onMounted(async () => {
  const apiUrl = APP_ENV === 'mobile' ? APPAPI_URL : WEBAPI_URL
  console.log(`[AppMobile] === DÉMARRAGE ===`)
  console.log(`[AppMobile] APP_ENV: ${APP_ENV}`)
  console.log(`[AppMobile] WEBAPI_URL: ${WEBAPI_URL}`)
  console.log(`[AppMobile] APPAPI_URL: ${APPAPI_URL}`)
  console.log(`[AppMobile] URL API utilisée: ${apiUrl}`)
  console.log(`[AppMobile] Token présent: ${!!token.value}`)

  if (token.value) {
    await fetchUser()
  } else {
    navigateTo('/login')
  }
})
</script>


<template>
  <NuxtPage />
</template>