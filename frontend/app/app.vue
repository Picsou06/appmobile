<script setup>
const { token, fetchUser } = useAuth()
const { public: { APP_ENV, WEBAPI_URL, APPAPI_URL } } = useRuntimeConfig()

onMounted(async () => {
  const apiUrl = useApiUrl()
  console.log(`[AppMobile] === DÉMARRAGE ===`)
  console.log(`[AppMobile] APP_ENV: ${APP_ENV}`)
  console.log(`[AppMobile] WEBAPI_URL: ${WEBAPI_URL}`)
  console.log(`[AppMobile] APPAPI_URL: ${APPAPI_URL}`)
  console.log(`[AppMobile] API URL sélectionnée: ${apiUrl}`)
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