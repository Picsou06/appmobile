<script setup>
import { App } from '@capacitor/app'

const { token, fetchUser } = useAuth()
const router = useRouter()
const { startPolling, stopPolling } = useNotifications()

const backButtonListener = App.addListener('backButton', ({ canGoBack }) => {
  if (canGoBack) router.back()
  else App.exitApp()
})

onMounted(async () => {
  if (token.value) {
    await fetchUser()
    startPolling()
  } else {
    navigateTo('/login')
  }
})

onUnmounted(async () => {
  (await backButtonListener).remove()
  stopPolling()
})
</script>


<template>
  <NuxtPage />
</template>
